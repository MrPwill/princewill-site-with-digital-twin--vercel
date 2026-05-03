"""Chat router for Digital Twin conversation endpoints.

Provides SSE streaming and session management.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import json
import traceback
from typing import Dict, List, Any

from models.schemas import ChatRequest, ChatMessage
from core.prompt_builder import build_system_prompt
from core.openrouter_client import stream_completion, OpenRouterError

router = APIRouter()


@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """Stream Digital Twin responses as Server-Sent Events.
    
    Uses provided history for context (stateless for Vercel).
    """
    # Use provided history if available, otherwise fallback to empty (stateless)
    history = req.history or []
    
    # Format context from the provided history
    # We'll take the last CONTEXT_TURNS from the provided history
    context_turns = 6
    history_lines = [f"{m.role.upper()}: {m.content}" for m in history[-context_turns:]]
    memory_context = "\n".join(history_lines)
    
    system_prompt = build_system_prompt(memory_context)
    
    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": req.message})
    
    async def event_generator():
        full_response = ""
        error_occurred = False
        try:
            async for token in stream_completion(system_prompt, messages):
                full_response += token
                yield f"data: {json.dumps({'text': token})}\n\n"
        except Exception as e:
            error_occurred = True
            print(f"Stream error: {traceback.format_exc()}")
            if isinstance(e, OpenRouterError):
                error_message = (
                    "Live OpenRouter error: "
                    f"{str(e)[:280]}. "
                    "Verify backend/.env key, model access, and restart backend."
                )
                yield f"data: {json.dumps({'text': error_message})}\n\n"
            else:
                fallback_response = (
                    "I hit an unexpected backend error. "
                    "Please retry, and if it persists contact chiomaprincewillc@yahoo.com."
                )
                yield f"data: {json.dumps({'text': fallback_response})}\n\n"
        
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.delete("/session/{session_id}")
async def clear_memory(session_id: str) -> Dict[str, str]:
    """Reset conversation memory for a session.
    
    Note: In stateless mode, this is handled by the client clearing its own state.
    """
    return {"cleared": session_id}


@router.get("/session/{session_id}/history")
async def get_memory(session_id: str) -> Dict[str, Any]:
    """Get conversation history for a session.
    
    Note: In stateless mode, history is managed by the client.
    """
    return {
        "session_id": session_id,
        "message_count": 0,
        "messages": [],
        "note": "History is now managed client-side for Vercel compatibility."
    }
