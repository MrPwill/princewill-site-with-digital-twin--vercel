# Princewill C. Chioma · Personal Career Website & Digital Twin Agent

> This file is the authoritative project guide for any AI coding assistant working on this codebase.
> Read it in full before writing, editing, or generating any code.

---

## 🧭 Project Overview

This is a **production-grade personal career website** for **Princewill C. Chioma**, an AI Systems
Engineer based in Lagos, Nigeria. The site serves two distinct but unified purposes:

1. **Portfolio Platform** — Showcases career history, projects, certifications, and skills
2. **Digital Twin Agent** — An AI system that represents Princewill in conversations with
   recruiters, collaborators, and clients

This is **not a template**. It is a **live demonstration of AI engineering capability** built
with a deliberate full-stack split: a **Next.js frontend** and a **Python FastAPI backend**.
The Python backend is intentional — Python is Princewill's primary language and must be visible
as a first-class part of the architecture, not hidden inside a TypeScript API route.

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (Next.js)                         │
│   Portfolio UI  ◄──────────────────────────────────────────────  │
│   Digital Twin Chat  ──── fetch SSE ──► /api/twin (proxy)        │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP  (SSE stream)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│              PYTHON BACKEND  (FastAPI)  · port 8000              │
│                                                                   │
│  POST /chat/stream                                                │
│   ├─ ProfileLoader   (PDF + summary.txt → context string)        │
│   ├─ MemoryManager   (session conversation history)              │
│   ├─ PromptBuilder   (system prompt + context injection)         │
│   └─ OpenRouterClient ──► openai/gpt-oss-120b  (streaming)       │
└──────────────────────────────────────────────────────────────────┘
```

- The **Next.js frontend** handles all UI rendering, routing, and static content.
- The **Python FastAPI backend** owns all AI logic: context loading, prompt construction,
  memory management, and OpenRouter streaming.
- The Next.js API route (`/api/twin`) acts as a **thin proxy** — it forwards requests to
  FastAPI and pipes the SSE stream back to the browser. No AI logic lives in TypeScript.
- This split makes Princewill's Python expertise **visibly central** to the system.

---

## 🗂️ Project Structure

```
/
├── frontend/                          # Next.js App (TypeScript)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Home / Hero
│   │   ├── about/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── contact/page.tsx
│   │   └── twin/page.tsx              # Digital Twin chat interface
│   │
│   ├── app/api/twin/route.ts          # Thin SSE proxy → FastAPI backend
│   │
│   ├── components/
│   │   ├── layout/                    # Navbar, Footer, PageWrapper
│   │   ├── sections/                  # Hero, About, Projects, Skills, Contact
│   │   ├── twin/                      # ChatWindow, MessageBubble, TypingIndicator,
│   │   │                              # InputBar, StarterChips
│   │   └── ui/                        # GlowCard, GradientButton, SectionHeading,
│   │                                  # AnimatedBadge, NeuralBackground, GlowRing
│   │
│   ├── lib/
│   │   ├── twin/
│   │   │   ├── memory.ts              # Client-side session ID + memory helpers
│   │   │   └── stream.ts              # SSE reader — parses chunks into React state
│   │   └── utils.ts
│   │
│   ├── data/
│   │   ├── profile.ts                 # Typed career data (experience, certs, skills)
│   │   └── projects.ts                # Project metadata for portfolio cards
│   │
│   ├── public/
│   │   ├── princewill.jpg
│   │   └── og-image.png
│   │
│   ├── styles/globals.css
│   ├── .env.local                     # NEVER commit
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                           # Python FastAPI Service
│   ├── main.py                        # App entry point + CORS + router registration
│   ├── routers/
│   │   └── chat.py                    # POST /chat/stream · DELETE /chat/session/{id}
│   ├── core/
│   │   ├── profile_loader.py          # PDF + summary.txt → cached context string
│   │   ├── prompt_builder.py          # Assembles system prompt with context + memory
│   │   ├── memory_manager.py          # In-process session memory store
│   │   └── openrouter_client.py       # Async httpx streaming client for OpenRouter
│   ├── models/
│   │   └── schemas.py                 # Pydantic request/response models
│   ├── me/
│   │   ├── princewill_profile.pdf     # Source of truth — career profile PDF
│   │   └── summary.txt                # Professional summary text
│   |                           # NEVER commit
│   ├── requirements.txt
│   └── Dockerfile
│__.env
├── docker-compose.yml
├── CLAUDE.md                          # ← You are here
└── AGENTS.md
```

---

## 🐍 Python Backend — Full Specification

### Entry Point (`backend/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat

app = FastAPI(
    title="Princewill Digital Twin API",
    description="Python AI backend powering the Digital Twin career agent",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://princewill.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["Digital Twin"])


@app.get("/health")
async def health():
    return {"status": "ok", "agent": "Princewill Digital Twin v1.0"}
```

---

### Profile Loader (`backend/core/profile_loader.py`)

Loads the PDF and summary once at startup and caches the result via `@lru_cache`.

```python
from pypdf import PdfReader
from functools import lru_cache


@lru_cache(maxsize=1)
def load_profile() -> str:
    """Load and cache Princewill's career context from PDF + summary.txt."""

    # --- PDF ---
    pdf_text = ""
    reader = PdfReader("me/princewill_profile.pdf")
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            pdf_text += extracted.strip() + "\n"

    # --- Summary ---
    with open("me/summary.txt", "r", encoding="utf-8") as f:
        summary_text = f.read().strip()

    return f"""
=== CAREER PROFILE (PDF) ===
{pdf_text}

=== PROFESSIONAL SUMMARY ===
{summary_text}
""".strip()
```

---

### Prompt Builder (`backend/core/prompt_builder.py`)

```python
from core.profile_loader import load_profile

SYSTEM_PROMPT_TEMPLATE = """
You are the digital twin of Princewill C. Chioma, an AI Systems Engineer based in Lagos, Nigeria.

Your purpose is to represent him accurately in conversations with recruiters, collaborators,
and potential clients. You speak as Princewill — in first person, with his voice.

=== IDENTITY ===
You are professional, technically confident, business-aware, and direct.
You avoid hype. You connect technical capability to measurable real-world outcomes.
You are not a generic assistant — you are a career representative.

=== CAREER CONTEXT ===
{profile_context}

=== MEMORY (this session) ===
{memory_context}

=== RESPONSE RULES ===
1. Answer ONLY from the provided context. Never fabricate roles, projects, or credentials.
2. Speak strictly in first person ("I built...", "My experience includes...").
3. Be concise and structured. Lead with the direct answer.
4. Connect technical work to business impact wherever possible.
5. If asked about something outside the profile context, respond:
   "That's outside my current experience, but here's how I would approach it..."
6. Never break character. If sincerely asked whether you are an AI, answer briefly and
   honestly, then redirect to Princewill's work.
7. Maintain a professional, confident, and clear tone at all times.
""".strip()


def build_system_prompt(memory_context: str = "") -> str:
    return SYSTEM_PROMPT_TEMPLATE.format(
        profile_context=load_profile(),
        memory_context=memory_context or "No prior messages in this session.",
    )
```

---

### Memory Manager (`backend/core/memory_manager.py`)

Session memory is stored **in-process** (per session ID).
For production, swap the dict for Redis or Vercel KV.

```python
from collections import defaultdict
from typing import List
from models.schemas import ChatMessage

# In-memory store: session_id → message list
# Replace with Redis for multi-instance / persistent deployments
_sessions: dict[str, List[ChatMessage]] = defaultdict(list)

MAX_HISTORY = 20   # total messages kept per session
CONTEXT_TURNS = 6  # last N messages injected into system prompt


def get_history(session_id: str) -> List[ChatMessage]:
    return _sessions[session_id][-MAX_HISTORY:]


def append_message(session_id: str, message: ChatMessage) -> None:
    _sessions[session_id].append(message)


def format_memory_context(session_id: str) -> str:
    history = get_history(session_id)
    if not history:
        return ""
    lines = [f"{m.role.upper()}: {m.content}" for m in history[-CONTEXT_TURNS:]]
    return "\n".join(lines)


def clear_session(session_id: str) -> None:
    _sessions.pop(session_id, None)
```

---

### Pydantic Schemas (`backend/models/schemas.py`)

```python
from pydantic import BaseModel, Field
from typing import List, Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: str = Field(..., description="Client-generated UUID for session tracking")
    history: List[ChatMessage] = Field(default_factory=list)
```

---

### OpenRouter Streaming Client (`backend/core/openrouter_client.py`)

```python
import os
import httpx
import json
from typing import AsyncGenerator

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-oss-120b"


async def stream_completion(
    system_prompt: str,
    messages: list[dict],
) -> AsyncGenerator[str, None]:
    """
    Streams token chunks from OpenRouter via httpx async streaming.
    Yields plain text delta strings as they arrive.
    """
    payload = {
        "model": MODEL,
        "stream": True,
        "max_tokens": 1024,
        "temperature": 0.7,
        "messages": [
            {"role": "system", "content": system_prompt},
            *messages,
        ],
    }
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("SITE_URL", "https://princewill.dev"),
        "X-Title": "Princewill Digital Twin",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream("POST", OPENROUTER_URL,
                                  json=payload, headers=headers) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:]
                if data.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(data)
                    delta = chunk["choices"][0]["delta"].get("content", "")
                    if delta:
                        yield delta
                except (json.JSONDecodeError, KeyError, IndexError):
                    continue
```

---

### Chat Router (`backend/routers/chat.py`)

```python
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json

from models.schemas import ChatRequest, ChatMessage
from core.prompt_builder import build_system_prompt
from core.memory_manager import (
    get_history, append_message, format_memory_context, clear_session
)
from core.openrouter_client import stream_completion

router = APIRouter()


@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """
    Streams Digital Twin responses as Server-Sent Events.
    Persists each turn to session memory.
    """
    memory_context = format_memory_context(req.session_id)
    system_prompt = build_system_prompt(memory_context)

    history = get_history(req.session_id)
    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": req.message})

    append_message(req.session_id, ChatMessage(role="user", content=req.message))

    async def event_generator():
        full_response = ""
        async for token in stream_completion(system_prompt, messages):
            full_response += token
            yield f"data: {json.dumps({'text': token})}\n\n"

        # Persist full assistant reply after stream completes
        append_message(
            req.session_id,
            ChatMessage(role="assistant", content=full_response),
        )
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.delete("/session/{session_id}")
async def clear_memory(session_id: str):
    """Reset conversation memory for a given session (triggered by 'New Conversation')."""
    clear_session(session_id)
    return {"cleared": session_id}
```

---

### Requirements (`backend/requirements.txt`)

```txt
fastapi>=0.111.0
uvicorn[standard]>=0.29.0
httpx>=0.27.0
pypdf>=4.2.0
pydantic>=2.7.0
python-dotenv>=1.0.0
```

### Backend Environment Variables (`backend/.env`)

```env
# backend/.env — NEVER commit
OPENROUTER_API_KEY=sk-or-...
SITE_URL=https://princewill.dev
```

### Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🐳 Docker Compose

```yaml
# docker-compose.yml
version: "3.9"
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
```

### Backend Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## ⚡ Next.js Frontend — Key Details

### SSE Proxy Route (`frontend/app/api/twin/route.ts`)

This is a **thin proxy only**. Zero AI logic here — all intelligence is in Python.

```typescript
export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await fetch(`${process.env.BACKEND_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Pipe FastAPI's SSE stream straight to the browser
  return new Response(backendRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

### SSE Stream Reader (`frontend/lib/twin/stream.ts`)

```typescript
export async function readStream(
  response: Response,
  onChunk: (text: string) => void,
  onDone: () => void,
): Promise<void> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") { onDone(); return; }
      try {
        const { text } = JSON.parse(data);
        if (text) onChunk(text);
      } catch { /* skip malformed */ }
    }
  }
}
```

### Client Memory (`frontend/lib/twin/memory.ts`)

```typescript
export function getOrCreateSessionId(): string {
  const key = "twin_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
```

### Frontend Environment Variables (`frontend/.env.local`)

```env
# frontend/.env.local — NEVER commit
BACKEND_URL=http://localhost:8000       # Server-side only — used by proxy route
NEXT_PUBLIC_SITE_URL=https://princewill.dev
```

---

## 🎨 Design System — Neural Indigo Theme

This is the **only** approved design system. Do not deviate.

### Core Colors & Gradients

```css
:root {
  --bg-base:          #0A0F1F;
  --bg-card:          #12182B;
  --bg-elevated:      #1A2240;

  --blue-primary:     #2EA8FF;
  --indigo-secondary: #6D4AFF;
  --gold-accent:      #F5B942;

  --text-primary:     #E6EAF2;
  --text-secondary:   #9AA4B2;
  --text-muted:       #4A5568;

  --border-subtle:    rgba(46, 168, 255, 0.12);
  --glow-blue:        0 0 24px rgba(46, 168, 255, 0.25);
  --glow-indigo:      0 0 24px rgba(109, 74, 255, 0.30);
  --glow-active:      0 0 40px rgba(109, 74, 255, 0.45);

  --gradient-primary: linear-gradient(135deg, #2EA8FF 0%, #6D4AFF 100%);
  --gradient-accent:  linear-gradient(135deg, #6D4AFF 0%, #F5B942 100%);
  --gradient-bg:      radial-gradient(ellipse at 20% 50%, rgba(109,74,255,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(46,168,255,0.06) 0%, transparent 55%);
}
```

### Typography

```css
--font-display: 'Syne', sans-serif;
--font-body:    'DM Sans', sans-serif;
--font-mono:    'JetBrains Mono', monospace;
```

### Design Rules

- Background is **always** `--bg-base`. Never white.
- Cards: `background: var(--bg-card)` + `border: 1px solid var(--border-subtle)`.
- Gradients only on CTAs, user messages, key interactive elements.
- Gold used **sparingly** — highlights and active states only.
- All transitions: `transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)`.
- Glow on focus/hover: `box-shadow: var(--glow-blue)` or `var(--glow-indigo)`.
- Subtle noise/grain texture on hero background for depth.

---

## 💬 Digital Twin UI — Chat Interface Spec

| Element          | Style                                                                  |
|------------------|------------------------------------------------------------------------|
| AI messages      | `bg-card` (#12182B), 3px left border `--indigo-secondary`, subtle glow |
| User messages    | `--gradient-primary` bubble, right-aligned, white text                |
| Typing indicator | Three pulse-animated dots in `bg-card`                                |
| Streaming text   | Characters render in real-time as SSE chunks arrive                   |
| Timestamps       | `--text-muted`, `font-mono`, 11px                                     |
| AI avatar        | Headshot thumbnail with indigo glow ring                              |

### Starter Question Chips

```
"Tell me about yourself"
"What's your most impressive project?"
"How do you design multi-agent systems?"
"What makes you different from other AI engineers?"
"Are you available for freelance work?"
"Walk me through your tech stack"
"What's your experience with RAG pipelines?"
"How have you delivered business value with AI?"
```

### Input Bar Rules

- Gradient border on focus
- `Shift+Enter` → newline | `Enter` → send
- Disabled + spinner during API call
- **"New Conversation"** button calls `DELETE /chat/session/{id}` then resets UI state

### Guardrails (frontend)

✅ Must Do:
- Show disclaimer: *"AI representation of Princewill. Direct: chiomaprincewillc@yahoo.com"*
- Pass `session_id` on every request
- Sanitize all API output before rendering

❌ Must NOT Do:
- Expose `BACKEND_URL` to the browser
- Render raw HTML from API responses
- Send requests before a session ID exists

---

## 🏠 Portfolio Sections

**Hero (`/`)** — Full-screen dark landing, `--gradient-bg` atmosphere + noise texture.
Name in Syne; "AI Systems Engineer" with gradient text clip. CTAs: `[Chat With My Digital Twin]`
(gradient) + `[View Projects]` (ghost). Gold-dot availability badge. Headshot with glow ring.

**About (`/about`)** — Vertical timeline, gradient left border. Per role: company, tenure, 2–3
impact bullets. Callout: *"10+ years finance & ops × production AI engineering"*.

**Projects (`/projects`)** — GlowCard grid: name, description, tech badges, track label, GitHub
link. Filter tabs: All · LLM/RAG · Agentic · MLOps · Automation. Gold star on flagships.

**Skills (`/skills`)** — Categories: AI/LLM · Agentic · MLOps/Cloud · Python & Code ·
Automation · Domain. Animated proficiency bars or icon clusters.

**Contact (`/contact`)** — Form: name, email, message, intent (hire / collaborate / consult).
Social links: GitHub, LinkedIn, Email.

---

## ⚙️ Full Tech Stack

| Layer               | Technology                                          |
|---------------------|-----------------------------------------------------|
| Frontend            | Next.js 14+ (App Router, TypeScript)                |
| Styling             | Tailwind CSS + CSS Variables                        |
| Animations          | Framer Motion                                       |
| Fonts               | Syne · DM Sans · JetBrains Mono                    |
| **Backend**         | **Python 3.12 + FastAPI**                           |
| **AI Orchestration**| **Python — prompt builder, memory, profile loader** |
| **LLM Provider**    | **OpenRouter API — `openai/gpt-oss-120b`**          |
| **HTTP Client**     | **httpx (async streaming)**                         |
| **Validation**      | **Pydantic v2**                                     |
| Streaming           | SSE — FastAPI `StreamingResponse` → Next.js proxy   |
| Session Memory      | In-process Python dict (swap to Redis for prod)     |
| Containerisation    | Docker + Docker Compose                             |
| Frontend Deploy     | Vercel                                              |
| Backend Deploy      | Railway / Fly.io / AWS App Runner                   |

---

## 🔒 Secrets Summary

| File                  | Variable              | Used by                   |
|-----------------------|-----------------------|---------------------------|
| `backend/.env`        | `OPENROUTER_API_KEY`  | Python OpenRouter client  |
| `backend/.env`        | `SITE_URL`            | OpenRouter HTTP-Referer   |
| `frontend/.env.local` | `BACKEND_URL`         | Next.js proxy route (SSR) |
| `frontend/.env.local` | `NEXT_PUBLIC_SITE_URL`| Meta / OG tags            |

**`OPENROUTER_API_KEY` must never leave the Python backend process.**

---

## 🚀 Development Commands

```bash
# Run everything
docker-compose up --build

# Or individually:
cd backend  && uvicorn main:app --reload --port 8000
cd frontend && npm install && npm run dev
```

---

## 🛡️ Code Quality Rules

**Python (backend)**
- Type hints on all function signatures
- Pydantic models for all request/response shapes — never raw dicts in routers
- `async def` for all I/O-bound operations
- Env vars via `python-dotenv` — never hardcoded
- Errors return `{"detail": "..."}` — never raw tracebacks

**TypeScript (frontend)**
- Strict mode — no `any` types
- Functional components with typed props throughout
- Zero AI logic in TypeScript — all intelligence lives in Python
- No inline styles — Tailwind or CSS variables only
- All interactive elements have ARIA labels; AA colour contrast minimum

---

## 🧪 Future Enhancements (Planned — Do Not Build Yet)

| Feature           | Description                                                     |
|-------------------|-----------------------------------------------------------------|
| RAG Embeddings    | FAISS / PGVector — chunk profile, retrieve on each query        |
| Persistent Memory | Redis — session memory survives restarts, recognises returners  |
| Voice Interface   | ElevenLabs TTS — stream spoken responses in the browser         |
| Multi-Agent Mode  | Recruiter Agent + Portfolio Explainer Agent (CrewAI)            |
| Observability     | LangFuse tracing on every OpenRouter call                       |
| Analytics         | Track most-asked questions — inform profile updates             |

---

## 🎯 Success Criteria

1. The Digital Twin answers like Princewill in a real recruiter conversation
2. The Python backend is visibly the intelligent core of the system
3. The portfolio communicates both technical depth and business impact
4. The UI feels premium, intelligent, and AI-native — not like a template
5. A visitor converts to a contact, interview, or collaboration request
6. The site itself is proof of Princewill's engineering capability

---

## 🏁 Final Principle

> This is not a portfolio website with a chatbot bolted on.
> It is a **full-stack AI system** — Python brain, Next.js face — wrapped in a
> professional brand experience.
>
> Every line of code, every design choice, every API response must communicate:
> **Clarity · Competence · Depth · Real-World Readiness**