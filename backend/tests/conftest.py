"""Pytest configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """FastAPI test client fixture."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def clear_memory():
    """Clear memory between tests."""
    from core.memory_manager import _sessions
    _sessions.clear()
    yield
    _sessions.clear()


@pytest.fixture
def sample_session_id():
    """Sample session ID for testing."""
    return "test-session-123"


@pytest.fixture
def sample_messages():
    """Sample chat messages for testing."""
    return [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there!"},
        {"role": "user", "content": "Tell me about yourself"},
    ]