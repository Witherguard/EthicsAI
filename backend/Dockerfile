FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt

# Environment variables for Ollama configuration
ENV OLLAMA_DEFAULT_MODEL=llama3.1:latest
ENV OLLAMA_HOST=http://host.docker.internal:11434

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]