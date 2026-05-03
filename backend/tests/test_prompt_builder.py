"""Tests for prompt_builder module."""

import pytest
from core.prompt_builder import build_system_prompt, get_prompt_length


def test_build_system_prompt_no_memory():
    """Test building prompt without memory context."""
    prompt = build_system_prompt()
    assert isinstance(prompt, str)
    assert len(prompt) > 0
    assert "Princewill C. Chioma" in prompt
    assert "digital twin" in prompt.lower()


def test_build_system_prompt_with_memory():
    """Test building prompt with memory context."""
    memory = "USER: Hello\nASSISTANT: Hi there!"
    prompt = build_system_prompt(memory)
    assert memory in prompt


def test_prompt_contains_rules():
    """Test that prompt contains response rules."""
    prompt = build_system_prompt()
    assert "RULES" in prompt
    assert "first person" in prompt.lower()


def test_prompt_contains_about_section():
    """Test that prompt contains about section."""
    prompt = build_system_prompt()
    assert "ABOUT PRINCEWILL" in prompt
    assert "professional" in prompt.lower()


def test_prompt_contains_context_placeholder():
    """Test that prompt contains context placeholder."""
    prompt = build_system_prompt()
    assert "CONTEXT FROM PROFILE" in prompt
    assert "SESSION MEMORY" in prompt


def test_get_prompt_length():
    """Test token length estimation."""
    prompt = "This is a test prompt"
    length = get_prompt_length(prompt)
    assert length > 0
    assert isinstance(length, int)


def test_memory_context_defaults():
    """Test that empty memory uses default text."""
    prompt = build_system_prompt("")
    assert "No prior messages in this session" in prompt