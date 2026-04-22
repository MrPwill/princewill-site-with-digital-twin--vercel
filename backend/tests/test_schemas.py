"""Tests for Pydantic schemas."""

import pytest
from pydantic import ValidationError
from models.schemas import ChatMessage, ChatRequest


def test_chat_message_user():
    """Test ChatMessage with user role."""
    msg = ChatMessage(role="user", content="Hello")
    assert msg.role == "user"
    assert msg.content == "Hello"


def test_chat_message_assistant():
    """Test ChatMessage with assistant role."""
    msg = ChatMessage(role="assistant", content="Hi there!")
    assert msg.role == "assistant"
    assert msg.content == "Hi there!"


def test_chat_message_invalid_role():
    """Test ChatMessage with invalid role."""
    with pytest.raises(ValidationError):
        ChatMessage(role="system", content="Hello")


def test_chat_request_valid():
    """Test ChatRequest with valid data."""
    req = ChatRequest(message="Hello", session_id="abc-123")
    assert req.message == "Hello"
    assert req.session_id == "abc-123"


def test_chat_request_empty_message():
    """Test ChatRequest with empty message."""
    with pytest.raises(ValidationError):
        ChatRequest(message="", session_id="abc-123")


def test_chat_request_long_message():
    """Test ChatRequest with message exceeding max length."""
    with pytest.raises(ValidationError):
        ChatRequest(message="x" * 2001, session_id="abc-123")


def test_chat_request_default_history():
    """Test ChatRequest default history is empty list."""
    req = ChatRequest(message="Hello", session_id="abc-123")
    assert req.history == []