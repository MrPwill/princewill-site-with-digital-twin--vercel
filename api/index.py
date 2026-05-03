import os
import sys
from pathlib import Path

# Add the current directory to sys.path to allow absolute imports of internal modules
# when running as a Vercel serverless function.
sys.path.append(str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.chat import router as chat_router

app = FastAPI(
    title="Princewill Digital Twin API",
    description="Python AI backend powering the Digital Twin career agent",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://princewill.dev"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(chat_router, prefix="/api/chat", tags=["Digital Twin"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "agent": "Princewill Digital Twin v1.0"}


@app.get("/api")
async def root():
    return {"message": "Princewill Digital Twin API - Use /api/docs for Swagger UI"}