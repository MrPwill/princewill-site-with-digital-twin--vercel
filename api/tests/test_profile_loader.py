"""Tests for profile_loader module."""

import pytest
from core.profile_loader import (
    load_profile,
    get_profile_length,
    clear_profile_cache,
)


def test_load_profile_returns_string():
    """Test that load_profile returns a non-empty string."""
    result = load_profile()
    assert isinstance(result, str)
    assert len(result) > 0


def test_profile_contains_sections():
    """Test that profile contains expected sections."""
    result = load_profile()
    assert "CAREER PROFILE (PDF)" in result
    assert "PROFESSIONAL SUMMARY" in result


def test_profile_caching():
    """Test that profile is cached."""
    clear_profile_cache()
    result1 = load_profile()
    result2 = load_profile()
    assert result1 is result2  # Same object due to caching


def test_profile_length():
    """Test get_profile_length returns positive int."""
    length = get_profile_length()
    assert isinstance(length, int)
    assert length > 0


def test_clear_profile_cache():
    """Test cache clearing."""
    clear_profile_cache()
    load_profile()  # Prime the cache
    clear_profile_cache()
    # Should work without error