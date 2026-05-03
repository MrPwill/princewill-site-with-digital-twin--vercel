"""Integration tests for chat router endpoints."""

import pytest
from fastapi.testclient import TestClient
from index import app


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


def test_health_endpoint(client):
    """Test /health endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/api")
    assert response.status_code == 200
    assert "message" in response.json()


def test_chat_stream_basic(client):
    """Test basic chat stream."""
    response = client.post(
        "/api/chat/stream",
        json={"message": "hello", "session_id": "test-123"},
    )
    assert response.status_code == 200
    assert "text" in response.text


def test_delete_session(client):
    """Test clearing session (stateless stub)."""
    session_id = "test-clear-123"
    response = client.delete(f"/api/chat/session/{session_id}")
    assert response.status_code == 200
    assert response.json()["cleared"] == session_id


def test_get_history_empty(client):
    """Test getting history (stateless stub)."""
    response = client.get(f"/api/chat/session/new-session/history")
    assert response.status_code == 200
    data = response.json()
    assert data["message_count"] == 0
    assert "note" in data


def test_chat_stream_with_long_message(client):
    """Test chat with max length message."""
    long_message = "a" * 2000
    response = client.post(
        "/api/chat/stream",
        json={"message": long_message, "session_id": "test-long"},
    )
    assert response.status_code == 200


def test_chat_stream_message_too_long(client):
    """Test chat with message exceeding limit."""
    long_message = "a" * 2001
    response = client.post(
        "/api/chat/stream",
        json={"message": long_message, "session_id": "test-long"},
    )
    assert response.status_code == 422  # Validation error