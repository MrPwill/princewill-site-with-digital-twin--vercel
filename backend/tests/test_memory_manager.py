"""Tests for memory_manager module."""

import pytest
from core.memory_manager import (
    get_history,
    append_message,
    format_memory_context,
    clear_session,
    get_session_count,
)
from models.schemas import ChatMessage


def test_append_message(sample_session_id):
    """Test appending a message to session."""
    msg = ChatMessage(role="user", content="Hello")
    append_message(sample_session_id, msg)
    history = get_history(sample_session_id)
    assert len(history) == 1
    assert history[0].content == "Hello"


def test_get_history_empty(sample_session_id):
    """Test getting history for new session."""
    history = get_history(sample_session_id)
    assert history == []


def test_get_history_max_limit(sample_session_id):
    """Test that history respects MAX_HISTORY limit."""
    for i in range(25):
        append_message(sample_session_id, ChatMessage(role="user", content=f"Msg {i}"))
    history = get_history(sample_session_id)
    assert len(history) <= 20


def test_format_memory_context_empty(sample_session_id):
    """Test memory context for empty session."""
    result = format_memory_context(sample_session_id)
    assert result == ""


def test_format_memory_context_with_history(sample_session_id):
    """Test memory context formatting."""
    append_message(sample_session_id, ChatMessage(role="user", content="Hi"))
    append_message(sample_session_id, ChatMessage(role="assistant", content="Hello"))
    result = format_memory_context(sample_session_id)
    assert "USER: Hi" in result
    assert "ASSISTANT: Hello" in result


def test_clear_session(sample_session_id):
    """Test clearing a session."""
    append_message(sample_session_id, ChatMessage(role="user", content="Test"))
    cleared_id = clear_session(sample_session_id)
    assert cleared_id == sample_session_id
    assert get_history(sample_session_id) == []


def test_clear_nonexistent_session(sample_session_id):
    """Test clearing a session that doesn't exist."""
    result = clear_session(sample_session_id)
    assert result is None


def test_get_session_count(sample_session_id):
    """Test session count tracking."""
    initial_count = get_session_count()
    append_message(sample_session_id, ChatMessage(role="user", content="Test"))
    assert get_session_count() == initial_count + 1
    clear_session(sample_session_id)
    assert get_session_count() == initial_count