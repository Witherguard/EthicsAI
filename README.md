# Ethics Companion Chatbot

A thoughtful AI chatbot designed with ethical principles at its core, focused on respectful, honest, and perspective-aware conversation.

## Quick Start

### Prerequisites
1. **Ollama** - Install from https://ollama.ai
2. **Node.js 18+** and **Python 3.11+**

### Option 1: Unified Development (Single Command)

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:8000

### Option 2: Manual Local Development

1. **Install and setup Ollama:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the model
ollama pull llama3.1:8b

# Start Ollama (in a separate terminal)
ollama serve
```

2. **Run the backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Or the command (python -m uvicorn main:app --reload --port 8000)
```

3. **Run the frontend:**
```bash
cd frontend
npm install

npm run dev
# Optional: configure default model
cp .env.example .env.local
# Edit .env.local to set VITE_DEFAULT_MODEL

npm run dev
```

4. **Open** http://localhost:5173 in your browser

### Option 3: Docker (One command)

```bash
# Make sure Ollama is running locally
docker-compose up --build
```

## Available Commands

From the project root:

```bash
npm run dev           # Run both frontend and backend (concurrently)
npm run dev:frontend  # Run only frontend (port 5173)
npm run dev:backend   # Run only backend (port 8000)
npm run install:all   # Install all dependencies (npm + pip)
npm run build         # Build frontend for production
npm run preview       # Preview production build
```

## Configuration

### Environment Variables

#### Backend (`.env` or docker-compose.yml)
| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_DEFAULT_MODEL` | `llama3.1:latest` | Default model for chat |

#### Frontend (`.env.local` or docker-compose.yml)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |
| `VITE_DEFAULT_MODEL` | `llama3.1:latest` | Default model selector value |

### Model Selection
The frontend includes a model selector in the settings panel (click the gear icon). Available models:
- Llama 3.1 (Latest) - 4.7GB
- Llama 3.1 8B - 4.7GB
- Llama 3.2 (Latest) - 2.0GB
- Mistral 7B - 4.1GB
- Gemma 2 9B - 5.4GB

To use a different model, pull it first with Ollama:
```bash
ollama pull mistral:latest
```

Then select it in the settings panel, or set `VITE_DEFAULT_MODEL` / `OLLAMA_DEFAULT_MODEL` to your preferred model.

## Features

### Ethical Foundation
- **Respect** - Every response considers human dignity
- **Honesty** - Acknowledges uncertainty and limitations
- **Harm Prevention** - Actively avoids harmful suggestions
- **Perspective Awareness** - Presents multiple ethical lenses

### Ethical Insights
Every response includes:
- Which ethical principles were applied
- Which philosophical perspectives were considered
- The reasoning process behind the response

### Frameworks Available
- **Virtue Ethics** - Character-based moral reasoning
- **Utilitarian** - Consequences for all affected parties
- **Deontological** - Duties and inherent rights
- **Care Ethics** - Relationships and care
- **Justice** - Fairness and equity

## Project Structure

```
ethics-chatbot/
├── backend/           # FastAPI server
│   ├── main.py        # Core API + ethics engine
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/          # React chat interface
│   ├── src/
│   │   ├── main.jsx
│   │   ├── ChatApp.jsx
│   │   └── *.css
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

## Customization

### Adjusting Ethical Principles
Edit `ETHICAL_PRINCIPLES` in `backend/main.py` to add your own:

```python
ETHICAL_PRINCIPLES = [
    "Your custom principle here...",
    "Another principle...",
]
```

### Adding Knowledge
Add markdown files to a `data/frameworks/` directory with ethical content. The chatbot can reference these for deeper responses.

## Notes

- This is a **companion for reflection**, not professional ethical advice
- The model runs locally for privacy - your conversations stay on your machine
- Llama 3.1 8B works on most modern computers with 8GB+ RAM

## License

MIT - Build and customize freely!