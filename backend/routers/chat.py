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
from core.memory_manager import (
    get_history,
    append_message,
    format_memory_context,
    clear_session,
)
from core.openrouter_client import stream_completion, OpenRouterError

router = APIRouter()


@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """Stream Digital Twin responses as Server-Sent Events.
    
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
        
        # Only persist complete, non-errored responses
        if full_response and not error_occurred and len(full_response) > 10:
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
async def clear_memory(session_id: str) -> Dict[str, str]:
    """Reset conversation memory for a session.
    
    Triggered by 'New Conversation' button.
    """
    clear_session(session_id)
    return {"cleared": session_id}


@router.get("/session/{session_id}/history")
async def get_memory(session_id: str) -> Dict[str, Any]:
    """Get conversation history for a session (for debugging)."""
    history = get_history(session_id)
    return {
        "session_id": session_id,
        "message_count": len(history),
        "messages": [{"role": m.role, "content": m.content[:100]} for m in history],
    }
