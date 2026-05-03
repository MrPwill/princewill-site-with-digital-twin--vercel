"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class ChatMessage(BaseModel):
    """A single message in the conversation."""
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Request body for /chat/stream endpoint."""
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: str = Field(..., min_length=1, description="Client-generated UUID for session tracking")
    history: Optional[List[ChatMessage]] = Field(default_factory=list)


class ClearSessionResponse(BaseModel):
    """Response from clearing a session."""
    cleared: str


class SessionHistoryResponse(BaseModel):
    """Response containing session history."""
    session_id: str
    message_count: int
    messages: List[dict]