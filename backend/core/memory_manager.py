"""Memory manager for session-based conversation storage.

In production, replace the in-memory dict with Redis for multi-instance support.
Each module in `backend/core/` must be independently testable with clear inputs/outputs.
"""

from typing import List, Optional
from models.schemas import ChatMessage

_sessions: dict[str, List[ChatMessage]] = {}

MAX_HISTORY = 20
CONTEXT_TURNS = 6


def get_history(session_id: str) -> List[ChatMessage]:
    """Get conversation history for a session."""
    return _sessions.get(session_id, [])[-MAX_HISTORY:]


def append_message(session_id: str, message: ChatMessage) -> None:
    """Append a message to session history."""
    if session_id not in _sessions:
        _sessions[session_id] = []
    _sessions[session_id].append(message)


def format_memory_context(session_id: str) -> str:
    """Format last N turns for context injection."""
    history = get_history(session_id)
    if not history:
        return ""
    lines = [f"{m.role.upper()}: {m.content}" for m in history[-CONTEXT_TURNS:]]
    return "\n".join(lines)


def clear_session(session_id: str) -> Optional[str]:
    """Clear session and return cleared ID, or None if not found."""
    if session_id in _sessions:
        del _sessions[session_id]
        return session_id
    return None


def get_session_count() -> int:
    """Get number of active sessions. For testing/monitoring."""
    return len(_sessions)