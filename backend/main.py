import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import asyncio
from typing import List, Optional
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration from environment
OLLAMA_DEFAULT_MODEL = os.getenv("OLLAMA_DEFAULT_MODEL", "llama3.1:8b")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

app = FastAPI(title="Ethics Companion API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 400
    model: Optional[str] = "llama3.2:latest"
    images: Optional[List[str]] = None

class ChatResponse(BaseModel):
    response: str
    principles_applied: List[str]
    perspectives_considered: List[str]

# Ethical Principles Engine
class EthicsEngine:
    def __init__(self):
        self.principles = [
            "Respect for human dignity and autonomy",
            "Truth-seeking with uncertainty acknowledgment",
            "Harm prevention and beneficence",
            "Justice and fairness",
            "Care and relational responsibility"
        ]

        self.frameworks = {
            "virtue_ethics": "Focus on character, virtues, and what a good person would do",
            "utilitarian": "Consider consequences for all affected parties",
            "deontological": "Consider duties, rules, and inherent rights",
            "care_ethics": "Consider relationships, care, and contextual particularity",
            "justice": "Consider fairness, equality, and systemic impacts"
        }

    def build_ethics_prompt(self, messages: List[ChatMessage]) -> str:
        """Build a prompt that guides the model toward ethical responses"""
        system_prompt = f"""You are an Ethics Companion - a thoughtful AI assistant designed to engage in conversations with strong ethical grounding.

CORE ETHICAL PRINCIPLES:
{chr(10).join(f"- {p}" for p in self.principles)}

RESPONSE GUIDELINES:
1. Acknowledge uncertainty when appropriate - "This is complex and I may not have the full picture"
2. Consider multiple perspectives - "Different ethical frameworks might view this differently"
3. Respect all people mentioned - avoid dehumanizing language
4. When making factual claims, be clear about limitations
5. Consider how your response might affect users and others

ETHICAL FRAMEWORKS IN YOUR KNOWLEDGE:
{chr(10).join(f"- {k.replace('_', ' ').title()}: {v}" for k, v in self.frameworks.items())}

CONVERSATION STYLE:
- Thoughtful but accessible
- Honest about AI limitations
- Encouraging of reflection
- Non-judgmental but principled
- Direct about ethical tensions when they exist

When responding, briefly note: "Considering [relevant principle/framework]..." to show your reasoning process."""

        # Format conversation history
        conversation = "\n\n".join([
            f"{msg.role.title()}: {msg.content}" for msg in messages
        ])

        return f"{system_prompt}\n\nCONVERSATION:\n{conversation}\n\nResponse:"

# Initialize ethics engine
ethics_engine = EthicsEngine()

# Ollama client
async def query_ollama_stream(prompt: str, temperature: float = 0.7, model: str = None, images: List[str] = None):
    if model is None:
        model = OLLAMA_DEFAULT_MODEL

    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "model": model,
                "stream": True,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                        "images": images or []
                    }
                ],
                "options": {
                    "temperature": temperature
                }
            }

            async with client.stream(
                "POST",
                f"{OLLAMA_HOST}/api/chat",
                json=payload,
                timeout=120.0
            ) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    yield f"data: {json.dumps({'error': error_text.decode('utf-8')})}\n\n"
                    return
                async for line in response.aiter_lines():
                    if line:
                        try:
                            data = json.loads(line)

                            if "message" in data and "content" in data["message"]:
                                yield f"data: {json.dumps({'token': data['message']['content']})}\n\n"

                            if data.get("done", False):
                                yield f"data: {json.dumps({'done': True})}\n\n"
                                break

                        except json.JSONDecodeError:
                            continue
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

def identify_principles_used(response: str) -> List[str]:
    """Identify which ethical principles the response touched on"""
    principles = []
    response_lower = response.lower()

    if any(word in response_lower for word in ["uncertain", "complex", "hard to say", "may not have"]):
        principles.append("Truth-seeking with uncertainty acknowledgment")
    if any(word in response_lower for word in ["perspective", "view", "different", "framework"]):
        principles.append("Respect for multiple viewpoints")
    if any(word in response_lower for word in ["care", "relationship", "consider", "impact"]):
        principles.append("Care and relational responsibility")
    if any(word in response_lower for word in ["fair", "justice", "equal", "systemic"]):
        principles.append("Justice and fairness")

    return principles if principles else ["Respect for human dignity and autonomy"]

def identify_perspectives_considered(response: str) -> List[str]:
    """Extract perspectives mentioned in response"""
    perspectives = []

    if "virtue" in response.lower() or "character" in response.lower():
        perspectives.append("Virtue ethics lens")
    if "consequence" in response.lower() or "outcome" in response.lower():
        perspectives.append("Consequentialist perspective")
    if "duty" in response.lower() or "right" in response.lower():
        perspectives.append("Deontological perspective")
    if "care" in response.lower() or "relationship" in response.lower():
        perspectives.append("Care ethics perspective")

    return perspectives if perspectives else ["General ethical reflection"]

@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    if request.images:
        user_question = request.messages[-1].content if request.messages else "Analyze this image ethically."

        full_prompt = f"""Analyze the attached image directly.

    First, describe exactly what is visible in the image.
    Second, answer the user's question based only on what is actually visible.
    Do not invent people, objects, or events that are not present.

    User question:
    {user_question}
    """
    else:
        full_prompt = ethics_engine.build_ethics_prompt(request.messages)
    print("MODEL:", request.model)
    print("IMAGE COUNT:", len(request.images or []))
    print("IMAGE LENGTH:", len(request.images[0]) if request.images else 0)

    async def generate():
        full_response = ""
        async for chunk in query_ollama_stream(full_prompt, request.temperature, request.model, request.images):
            if chunk.startswith("data: "):
                try:
                    data = json.loads(chunk[6:])
                    if "token" in data:
                        full_response += data["token"]
                        yield chunk
                    elif "done" in data:
                        principles = identify_principles_used(full_response)
                        perspectives = identify_perspectives_considered(full_response)
                        yield f"data: {json.dumps({'done': True, 'principles': principles, 'perspectives': perspectives})}\n\n"
                    elif "error" in data:
                        yield f"data: {json.dumps({'error': data['error']})}\n\n"
                except json.JSONDecodeError:
                    continue

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

async def query_ollama_stream(prompt: str, temperature: float = 0.7, model: str = None, images: List[str] = None):
    if model is None:
        model = OLLAMA_DEFAULT_MODEL

    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            payload = {
                "model": model,
                "stream": True,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                        "images": images or []
                    }
                ],
                "options": {
                    "temperature": temperature
                }
            }

            async with client.stream(
                "POST",
                f"{OLLAMA_HOST}/api/chat",
                json=payload
            ) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    yield f"data: {json.dumps({'error': error_text.decode('utf-8')})}\n\n"
                    return

                async for line in response.aiter_lines():
                    if not line:
                        continue

                    try:
                        data = json.loads(line)

                        if "message" in data and "content" in data["message"]:
                            token = data["message"]["content"]
                            yield f"data: {json.dumps({'token': token})}\n\n"

                        if data.get("done", False):
                            yield f"data: {json.dumps({'done': True})}\n\n"
                            break
                    except json.JSONDecodeError:
                        continue

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

@app.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    print("MODEL:", request.model, flush=True)
    print("IMAGE COUNT:", len(request.images or []), flush=True)
    print("IMAGE LENGTH:", len(request.images[0]) if request.images else 0, flush=True)

    if request.images:
        user_question = request.messages[-1].content if request.messages else "Analyze this image ethically."
    """Streaming chat endpoint with ethical processing"""

    # Build ethical prompt
    full_prompt = ethics_engine.build_ethics_prompt(request.messages)

    async def generate():
        full_response = ""
        async for chunk in query_ollama_stream(full_prompt, request.temperature, request.model, request.images):
            if chunk.startswith("data: "):
                try:
                    data = json.loads(chunk[6:])
                    if "token" in data:
                        full_response += data["token"]
                        yield chunk
                    elif "done" in data:
                        # After streaming completes, identify principles and send final metadata
                        principles = identify_principles_used(full_response)
                        perspectives = identify_perspectives_considered(full_response)
                        yield f"data: {json.dumps({'done': True, 'principles': principles, 'perspectives': perspectives})}\n\n"
                    elif "error" in data:
                        yield f"data: {json.dumps({'error': data['error']})}\n\n"
                except json.JSONDecodeError:
                    continue

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.get("/api/frameworks")
async def get_frameworks():
    """Get available ethical frameworks"""
    return {
        "frameworks": [
            {"key": "virtue_ethics", "name": "Virtue Ethics", "description": "What character traits would guide this choice?"},
            {"key": "utilitarian", "name": "Utilitarian", "description": "What creates the greatest good for all affected?"},
            {"key": "deontological", "name": "Deontological", "description": "What duties and rights are at stake?"},
            {"key": "care_ethics", "name": "Care Ethics", "description": "How does this affect relationships and care?"},
            {"key": "justice", "name": "Justice", "description": "What's fair and equitable here?"}
        ]
    }

@app.get("/api/health")
async def health_check():
    """Check if services are running"""
    ollama_status = "unknown"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_HOST}/api/tags", timeout=5.0)
            ollama_status = "running" if response.status_code == 200 else "error"
    except:
        ollama_status = "not running"

    return {"status": "healthy", "ollama": ollama_status, "ollama_host": OLLAMA_HOST, "default_model": OLLAMA_DEFAULT_MODEL}