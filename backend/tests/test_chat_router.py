"""Integration tests for chat router endpoints."""

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def clear_memory():
    """Clear memory between tests."""
    from core.memory_manager import _sessions
    _sessions.clear()
    yield
    _sessions.clear()


def test_health_endpoint(client):
    """Test /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_chat_stream_basic(client):
    """Test basic chat stream."""
    response = client.post(
        "/chat/stream",
        json={"message": "hello", "session_id": "test-123"},
    )
    assert response.status_code == 200
    assert "text" in response.text


def test_chat_stream_saves_history(client):
    """Test that chat saves to history."""
    session_id = "test-history-123"
    client.post(
        "/chat/stream",
        json={"message": "Hello", "session_id": session_id},
    )
    # Get history
    response = client.get(f"/chat/session/{session_id}/history")
    assert response.status_code == 200
    data = response.json()
    assert data["message_count"] > 0


def test_delete_session(client):
    """Test clearing session."""
    session_id = "test-clear-123"
    # Add some messages
    client.post(
        "/chat/stream",
        json={"message": "Hello", "session_id": session_id},
    )
    # Clear session
    response = client.delete(f"/chat/session/{session_id}")
    assert response.status_code == 200
    assert response.json()["cleared"] == session_id


def test_get_history_empty(client):
    """Test getting history for new session."""
    response = client.get("/chat/session/new-session/history")
    assert response.status_code == 200
    data = response.json()
    assert data["message_count"] == 0


def test_chat_stream_with_long_message(client):
    """Test chat with max length message."""
    long_message = "a" * 2000
    response = client.post(
        "/chat/stream",
        json={"message": long_message, "session_id": "test-long"},
    )
    assert response.status_code == 200


def test_chat_stream_message_too_long(client):
    """Test chat with message exceeding limit."""
    long_message = "a" * 2001
    response = client.post(
        "/chat/stream",
        json={"message": long_message, "session_id": "test-long"},
    )
    assert response.status_code == 422  # Validation error