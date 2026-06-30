import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatApp.css";

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your Ethics Companion. Ask me about AI bias, privacy, fairness, transparency, accountability, or any ethical question you want to think through.",
  principles: ["Respect for human dignity and autonomy"],
  perspectives: ["General ethical reflection"],
};

const TEXT_MODEL = "llama3.2:latest";
const VISION_MODEL = "llava-llama3:8b";
const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || TEXT_MODEL;
const API_URL = "";

const AVAILABLE_MODELS = [
  { id: "llama3.2:latest", name: "Llama 3.2 Text", size: "2GB" },
  { id: "llava-llama3:8b", name: "LLaVA Vision", size: "5GB" },
  { id: "llama3.1:8b", name: "Llama 3.1 8B", size: "5GB" },
  { id: "mistral:latest", name: "Mistral 7B", size: "4GB" },
  { id: "gemma2:latest", name: "Gemma 2 9B", size: "5GB" },
];

function loadMessages() {
  try {
    const stored = localStorage.getItem("ethics-chat-history");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Failed to load chat history:", error);
  }

  return [INITIAL_MESSAGE];
}

function ChatApp() {
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageData, setImageData] = useState("");
  const [showInsights, setShowInsights] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("ethics-chat-theme") === "dark";
  });
  const [temperature, setTemperature] = useState(() => {
    const saved = localStorage.getItem("ethics-chat-temperature");
    return saved ? parseFloat(saved) : 0.7;
  });
  const [model, setModel] = useState(() => {
    return localStorage.getItem("ethics-chat-model") || DEFAULT_MODEL;
  });

  const messagesEndRef = useRef(null);
  const chatMainRef = useRef(null);
  const shouldAutoScrollRef = useRef(false);
  const hasMountedRef = useRef(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("ethics-chat-temperature", temperature.toString());
  }, [temperature]);

  useEffect(() => {
    localStorage.setItem("ethics-chat-model", model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("ethics-chat-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem("ethics-chat-history", JSON.stringify(messages));
    } catch (error) {
      console.warn("Failed to save chat history:", error);
    }
  }, [messages]);

 useEffect(() => {
  if (!hasMountedRef.current) {
    hasMountedRef.current = true;
    return;
  }

  const chatMain = chatMainRef.current;

  if (!chatMain || !shouldAutoScrollRef.current) {
    return;
  }

    chatMain.scrollTop = chatMain.scrollHeight;
  }, [messages]);

  const handleChatScroll = () => {
    const chatMain = chatMainRef.current;

    if (!chatMain) {
      return;
    }

    const distanceFromBottom =
      chatMain.scrollHeight - chatMain.scrollTop - chatMain.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 80;
  };

  const stopAutoScroll = () => {
    shouldAutoScrollRef.current = false;
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setFileText("");
    setImageData("");

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result || "";
        const base64 = String(result).split(",")[1] || "";
        setImageData(base64);
      };

      reader.readAsDataURL(file);
      return;
    }

    const text = await file.text();
    setFileText(text);
  };

  const removeFile = () => {
    setFileName("");
    setFileText("");
    setImageData("");
  };

  const stopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !fileText && !imageData) || loading) {
      return;
    }

    shouldAutoScrollRef.current = true;

    const currentImageData = imageData;
    const currentFileText = fileText;
    const currentFileName = fileName;

    const messageContent = currentFileText
      ? `${input.trim()}\n\n[Attached file: ${currentFileName}]\n${currentFileText}`
      : input.trim() || "Analyze the attached image and answer my question.";

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: messageContent,
    };

    const assistantMessageId = `${Date.now()}-assistant`;

    setMessages((previous) => [
      ...previous,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        principles: [],
        perspectives: [],
        streaming: true,
      },
    ]);

    setInput("");
    setFileText("");
    setFileName("");
    setImageData("");
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: currentImageData
            ? [
                {
                  role: "user",
                  content:
                    userMessage.content ||
                    "Analyze the attached image and answer my ethical question.",
                },
              ]
            : [...messages, userMessage]
                .filter(
                  (message) =>
                    message.role === "user" || message.role === "assistant"
                )
                .slice(-6)
                .map((message) => ({
                  role: message.role,
                  content: message.content,
                })),
          temperature,
          model: currentImageData ? VISION_MODEL : model,
          images: currentImageData ? [currentImageData] : [],
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("The chatbot could not connect to the backend.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let finalPrinciples = [];
      let finalPerspectives = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          let data;

          try {
            data = JSON.parse(line.slice(6));
          } catch {
            continue;
          }

          if (data.token) {
            fullContent += data.token;

            setMessages((previous) =>
              previous.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, content: fullContent }
                  : message
              )
            );
          }

          if (data.done) {
            finalPrinciples = data.principles || [];
            finalPerspectives = data.perspectives || [];
          }

          if (data.error) {
            throw new Error(data.error);
          }
        }
      }

      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: fullContent || "I did not receive a response.",
                principles: finalPrinciples,
                perspectives: finalPerspectives,
                streaming: false,
              }
            : message
        )
      );
    } catch (error) {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content:
                  error.name === "AbortError"
                    ? "Response stopped."
                    : `Error: ${error.message || error}`,
                streaming: false,
              }
            : message
        )
      );
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear the entire conversation? This cannot be undone.")) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem("ethics-chat-history");
    }
  };

  const exportChat = (format = "json") => {
    const chatData = messages.filter((message) => message.id !== "welcome");
    let content;
    let filename;
    let mimeType;

    if (format === "json") {
      content = JSON.stringify(chatData, null, 2);
      filename = `ethics-chat-${new Date().toISOString().split("T")[0]}.json`;
      mimeType = "application/json";
    } else {
      content = chatData
        .map(
          (message) =>
            `**${
              message.role === "user" ? "You" : "Ethics Companion"
            }**: ${message.content}`
        )
        .join("\n\n");
      filename = `ethics-chat-${new Date().toISOString().split("T")[0]}.md`;
      mimeType = "text/markdown";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className={`chat-app ${darkMode ? "dark" : ""}`}>
      <header className="chat-header">
        <div className="header-left">
          <h1>EthicAI Assistant</h1>
          <p>Ask about bias, privacy, fairness, transparency, and AI impact.</p>
        </div>

        <div className="header-actions">
          <button
            className="insights-toggle"
            type="button"
            onClick={() => setShowInsights(!showInsights)}
          >
            {showInsights ? "Hide" : "Show"} Insights
          </button>

          <button
            className="action-btn"
            type="button"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </button>

          <button
            className="action-btn"
            type="button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            className="action-btn"
            type="button"
            onClick={clearChat}
            disabled={messages.length <= 1}
          >
            Clear
          </button>

          <button
            className="action-btn"
            type="button"
            onClick={() => exportChat("json")}
            disabled={messages.length <= 1}
          >
            JSON
          </button>

          <button
            className="action-btn"
            type="button"
            onClick={() => exportChat("md")}
            disabled={messages.length <= 1}
          >
            MD
          </button>
        </div>
      </header>

      <main
        className="chat-main"
        ref={chatMainRef}
        onScroll={handleChatScroll}
        onWheel={stopAutoScroll}
        onTouchMove={stopAutoScroll}
      >
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role} ${
                message.streaming ? "streaming" : ""
              }`}
            >
              <div className="message-avatar">
                {message.role === "user" ? "👤" : "⚖️"}
              </div>

              <div className="message-content">
                <div className="message-text">
                  {message.role === "assistant" ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>

                {showInsights &&
                  message.principles &&
                  message.principles.length > 0 && (
                    <div className="message-insights">
                      <details>
                        <summary>Ethical Reflection</summary>

                        <div className="principles-list">
                          <strong>Principles applied:</strong>
                          <ul>
                            {message.principles.map((principle, index) => (
                              <li key={index}>{principle}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="perspectives-list">
                          <strong>Perspectives considered:</strong>
                          <ul>
                            {message.perspectives.map((perspective, index) => (
                              <li key={index}>{perspective}</li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    </div>
                  )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer">
        <div className="input-container">
          <label className="file-upload-btn">
            +
            <input
              type="file"
              accept="image/*,.txt,.md,.json,.csv"
              onChange={handleFileUpload}
              disabled={loading}
              hidden
            />
          </label>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about AI ethics..."
            rows={2}
            disabled={loading}
          />

          <button
            type="button"
            onClick={loading ? stopResponse : sendMessage}
            disabled={!loading && !input.trim() && !fileText && !imageData}
          >
            {loading ? "Stop" : "Send"}
          </button>
        </div>

        {fileName && (
          <div className="file-preview">
            <span>📎 {fileName}</span>
            <button type="button" onClick={removeFile}>
              Remove
            </button>
          </div>
        )}

        <p className="disclaimer">
          Educational AI ethics guidance only. Always verify important decisions
          with trusted sources or qualified experts.
        </p>
      </footer>

      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div
            className="settings-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Settings</h2>

            <div className="setting-group">
              <label htmlFor="model-select">Default Model</label>
              <select
                id="model-select"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              >
                {AVAILABLE_MODELS.map((availableModel) => (
                  <option key={availableModel.id} value={availableModel.id}>
                    {availableModel.name} ({availableModel.size})
                  </option>
                ))}
              </select>

              <p className="setting-hint">
                Default: {DEFAULT_MODEL}. Images automatically use{" "}
                {VISION_MODEL}.
              </p>
            </div>

            <div className="setting-group">
              <label htmlFor="temperature">
                Temperature: {temperature.toFixed(1)}
              </label>

              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(event) =>
                  setTemperature(parseFloat(event.target.value))
                }
              />

              <p className="setting-hint">
                Higher means more creative. Lower means more focused.
              </p>
            </div>

            <div className="setting-group">
              <button
                className="action-btn"
                type="button"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatApp;

/*
import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import './ChatApp.css'

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm your Ethics Companion - designed to engage in thoughtful, principled conversation. I care about treating everyone with dignity, being honest about what I don't know, and considering multiple perspectives on complex issues.\n\nHow can I help you think through something today?",
  principles: ['Respect for human dignity and autonomy'],
  perspectives: ['General ethical reflection']
}

function loadMessages() {
  try {
    const stored = localStorage.getItem('ethics-chat-history')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Failed to load chat history:', e)
  }
  return [INITIAL_MESSAGE]
}

// Default model from environment (Vite exposes VITE_* vars via import.meta.env)
const TEXT_MODEL = 'llama3.2:latest'
const VISION_MODEL = 'llava-llama3:8b'
const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || TEXT_MODEL

// Use Vite proxy for API requests - no hardcoded URL needed
const API_URL = ''

const AVAILABLE_MODELS = [
  { id: 'llama3.2:latest', name: 'Llama 3.2 Text', size: '2GB' },
  { id: 'llava-llama3:8b', name: 'LLaVA Vision', size: '5GB' },
  { id: 'llama3.1:8b', name: 'Llama 3.1 8B', size: '5GB' },
  { id: 'mistral:latest', name: 'Mistral 7B', size: '4GB' },
  { id: 'gemma2:latest', name: 'Gemma 2 9B', size: '5GB' },
]

function ChatApp() {
  const [messages, setMessages] = useState(loadMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileText, setFileText] = useState('')
  const [fileName, setFileName] = useState('')  
  const [imageData, setImageData] = useState('')
  const [showInsights, setShowInsights] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('ethics-chat-theme') === 'dark'
  })
  const [temperature, setTemperature] = useState(() => {
    const saved = localStorage.getItem('ethics-chat-temperature')
    return saved ? parseFloat(saved) : 0.7
  })
  const [model, setModel] = useState(() => {
    return localStorage.getItem('ethics-chat-model') || DEFAULT_MODEL
  })
  const messagesEndRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Persist settings
  useEffect(() => {
    localStorage.setItem('ethics-chat-temperature', temperature.toString())
  }, [temperature])

  useEffect(() => {
    localStorage.setItem('ethics-chat-model', model)
  }, [model])

  useEffect(() => {
    localStorage.setItem('ethics-chat-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ethics-chat-history', JSON.stringify(messages))
    } catch (e) {
      console.warn('Failed to save chat history:', e)
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  setFileName(file.name)
  setFileText('')
  setImageData('')

  if (file.type.startsWith('image/')) {
    const reader = new FileReader()

    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      setImageData(base64)
    }

    reader.readAsDataURL(file)
    return
  }

  const text = await file.text()
  setFileText(text)
  }
  const stopResponse = () => {
  if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }
  const sendMessage = async () => {
    if ((!input.trim() && !fileText && !imageData) || loading) return

    const messageContent = fileText
      ? `${input}\n\nAttached file: ${fileName}\n\n${fileText}`
      : input || 'Analyze the attached image and answer my question.'

    const contentWithFile = fileText
      ? `${input.trim()}\n\n[Attached file: ${fileName}]\n${fileText}`
      : input
    const userMessage = {
      id: Date.now() + '-user',
      role: 'user',
      content: messageContent
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setFileText('')
    setFileName('')
    setImageData('')
    setLoading(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    // Add placeholder for streaming response
    const assistantMessageId = Date.now()
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      principles: [],
      perspectives: [],
      streaming: true
    }])

    try {
      console.log('Using model:', imageData ? VISION_MODEL : model)
      console.log('Image attached:', Boolean(imageData))
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: imageData
            ? [{ role: 'user', content: userMessage.content || 'Analyze the attached image and answer my ethical question.' }]
            : [...messages, userMessage]
                .slice(-6)
                .map(m => ({ role: m.role, content: m.content })),
          temperature,
          model: imageData ? VISION_MODEL : model,
          images: imageData ? [imageData] : []
        })
      })

      if (!response.ok) throw new Error('Stream failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let finalPrinciples = []
      let finalPerspectives = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            let data
            try {
              data = JSON.parse(line.slice(6))
            } catch (e) {
              continue
            }

            if (data.token) {
              fullContent += data.token
              setMessages(prev => prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: fullContent }
                  : msg
              ))
            } else if (data.done) {
              finalPrinciples = data.principles || []
              finalPerspectives = data.perspectives || []
            } else if (data.error) {
              throw new Error(data.error)
            }
          }
        }
      }

      // Update with final message including insights
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: fullContent, principles: finalPrinciples, perspectives: finalPerspectives, streaming: false }
          : msg
      ))
    } catch (error) {
      console.error('Chat error:', error)

    setMessages(prev => prev.map(msg =>
      msg.id === assistantMessageId
        ? {
            ...msg,
            content: `Error: ${error.message || error}`,
            streaming: false
          }
        : msg
      ))
    } finally {
      abortControllerRef.current = null
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    if (window.confirm('Clear the entire conversation? This cannot be undone.')) {
      setMessages([INITIAL_MESSAGE])
      localStorage.removeItem('ethics-chat-history')
    }
  }

  const exportChat = (format = 'json') => {
    const chatData = messages.filter(m => m.id !== 'welcome')
    let content, filename, mimeType

    if (format === 'json') {
      content = JSON.stringify(chatData, null, 2)
      filename = `ethics-chat-${new Date().toISOString().split('T')[0]}.json`
      mimeType = 'application/json'
    } else {
      content = chatData.map(m => `**${m.role === 'user' ? 'You' : 'Ethics Companion'}**: ${m.content}`).join('\n\n')
      filename = `ethics-chat-${new Date().toISOString().split('T')[0]}.md`
      mimeType = 'text/markdown'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`chat-app ${darkMode ? 'dark' : ''}`}>
      <header className="chat-header">
        <div className="header-left">
          <h1>Ethics Companion</h1>
          <p>Thoughtful AI conversation with ethical grounding</p>
        </div>
        <div className="header-actions">
          <button
            className="insights-toggle"
            onClick={() => setShowInsights(!showInsights)}
          >
            {showInsights ? 'Hide' : 'Show'} Ethical Insights
          </button>
          <button className="action-btn" onClick={() => setShowSettings(true)}>
            Settings
          </button>
          <button className="action-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="action-btn" onClick={clearChat} disabled={messages.length <= 1}>
            Clear Chat
          </button>
          <button className="action-btn" onClick={() => exportChat('json')} disabled={messages.length <= 1}>
            Export JSON
          </button>
          <button className="action-btn" onClick={() => exportChat('md')} disabled={messages.length <= 1}>
            Export MD
          </button>
        </div>
      </header>

      <main className="chat-main">
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role} ${msg.streaming ? 'streaming' : ''}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '⚖️'}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
                {showInsights && msg.principles && msg.principles.length > 0 && (
                  <div className="message-insights">
                    <details>
                      <summary>Ethical Reflection</summary>
                      <div className="principles-list">
                        <strong>Principles applied:</strong>
                        <ul>{msg.principles.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      </div>
                      <div className="perspectives-list">
                        <strong>Perspectives considered:</strong>
                        <ul>{msg.perspectives.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer">
        <div className="input-container">
          <label className="file-upload-btn">
            +
            <input
              type="file"
              accept="image/*,.txt,.md,.json,.csv"
              onChange={handleFileUpload}
              disabled={loading}
              hidden
            />
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share something you're thinking through..."
            rows={2}
            disabled={loading}
          />
          <button
            onClick={loading ? stopResponse : sendMessage}
            disabled={!loading && !input.trim() && !fileText && !imageData}
          >
            {loading ? 'Stop' : 'Send'}
          </button>
        </div>
        {fileName && (
          <div className="file-preview">
            <span>📎 {fileName}</span>
            <button onClick={() => {
              setFileName('')
              setFileText('')
            }}>
              Remove
            </button>
          </div>
        )}
        
      </footer>

      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>

            <div className="setting-group">
              <label htmlFor="model-select">Default Model</label>
              <select
                id="model-select"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.size})
                  </option>
                ))}
              </select>
              <p className="setting-hint">
                Default: {DEFAULT_MODEL} (from VITE_DEFAULT_MODEL env var)
              </p>
            </div>

            <div className="setting-group">
              <label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
              <p className="setting-hint">
                Higher = more creative, Lower = more focused
              </p>
            </div>

            <div className="setting-group">
              <button className="action-btn" onClick={() => setShowSettings(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatApp

*/