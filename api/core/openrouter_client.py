"""OpenRouter streaming client for LLM communication.

Streams responses from OpenRouter API with fallback to profile-based responses.
"""

import os
import json
import httpx
import re
from pathlib import Path
from typing import AsyncGenerator, List, Dict
from dotenv import load_dotenv

# Load from project root .env (two levels up from core/)
ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-oss-120b")
SITE_URL = os.getenv("SITE_URL", "https://princewill.dev")
OPENROUTER_STRICT = os.getenv("OPENROUTER_STRICT", "false").lower() == "true"


class OpenRouterError(RuntimeError):
    """Raised when strict live OpenRouter mode fails."""


def get_profile_context() -> str:
    """Get profile context for the digital twin."""
    from core.profile_loader import load_profile
    return load_profile()


async def stream_completion(
    system_prompt: str,
    messages: List[Dict[str, str]],
) -> AsyncGenerator[str, None]:
    """Stream completion tokens from OpenRouter or fallback.
    
    Args:
        system_prompt: System prompt for context.
        messages: List of conversation messages.
        
    Yields:
        Text delta tokens from the LLM.
        
    Falls back to profile-based responses if no valid API key.
    """
    api_key = OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY", "")
    user_msg = messages[-1]["content"].lower() if messages else ""
    
    # Fallback to profile-based responses only when strict mode is disabled.
    if not _is_real_api_key(api_key):
        if OPENROUTER_STRICT:
            raise OpenRouterError("OPENROUTER_API_KEY is missing or invalid in backend runtime")
        async for token in _profile_stream(user_msg):
            yield token
        return
    
    payload = {
        "models": [MODEL, "deepseek/deepseek-v4-flash"],
        "stream": True,
        "max_tokens": 1024,
        "temperature": 0.7,
        "messages": [{"role": "system", "content": system_prompt}, *messages],
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL,
        "X-Title": "Princewill Digital Twin",
    }
    
    yielded_tokens = False
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", OPENROUTER_URL, json=payload, headers=headers) as response:
                if response.status_code >= 400:
                    error_body = await response.aread()
                    message = (
                        f"OpenRouter HTTP {response.status_code}: "
                        f"{error_body[:400].decode('utf-8', errors='ignore')}"
                    )
                    print(message)
                    if OPENROUTER_STRICT:
                        raise OpenRouterError(message)
                    async for token in _profile_stream(user_msg):
                        yield token
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        break
                    if not data:
                        continue
                    try:
                        chunk = json.loads(data)
                        if "error" in chunk:
                            message = f"OpenRouter stream error payload: {chunk.get('error')}"
                            print(message)
                            if OPENROUTER_STRICT:
                                raise OpenRouterError(message)
                            async for token in _profile_stream(user_msg):
                                yield token
                            return
                        delta = _extract_delta_content(chunk)
                        if delta:
                            yielded_tokens = True
                            yield delta
                    except (json.JSONDecodeError, KeyError, IndexError, TypeError):
                        continue
    except (httpx.HTTPError, httpx.TimeoutException, ValueError) as exc:
        message = f"OpenRouter request failed: {exc}"
        print(message)
        if OPENROUTER_STRICT:
            raise OpenRouterError(message) from exc
        async for token in _profile_stream(user_msg):
            yield token
        return

    if not yielded_tokens:
        if OPENROUTER_STRICT:
            raise OpenRouterError("OpenRouter stream returned no assistant content")
        async for token in _profile_stream(user_msg):
            yield token
        return


def _is_real_api_key(api_key: str) -> bool:
    """Check whether OPENROUTER_API_KEY looks usable (not empty/placeholder)."""
    stripped = api_key.strip()
    if not stripped:
        return False
    placeholders = {
        "sk-or-...",
        "sk-or-v1-...",
        "your-openrouter-api-key",
        "your_openrouter_api_key",
        "changeme",
    }
    return stripped.lower() not in placeholders


def _extract_delta_content(chunk: Dict) -> str:
    """Extract incremental text content from OpenRouter stream payload safely."""
    choice = chunk.get("choices", [{}])[0]
    delta = choice.get("delta", {})
    if isinstance(delta, dict):
        content = delta.get("content", "")
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            return "".join(
                part.get("text", "")
                for part in content
                if isinstance(part, dict) and isinstance(part.get("text"), str)
            )
    message = choice.get("message", {})
    if isinstance(message, dict):
        message_content = message.get("content", "")
        if isinstance(message_content, str):
            return message_content
    return ""


async def _profile_stream(user_msg: str) -> AsyncGenerator[str, None]:
    """Profile-based streaming response using actual profile data."""
    profile = get_profile_context()
    summary = _extract_clean_summary(profile)
    
    responses = {
        "hello": f"Hello! I'm Princewill's digital twin. {summary}\n\nHow can I help you today?",
        "about": f"Here is a concise overview:\n\n{summary}",
        "experience": f"Here is my experience summary:\n\n{summary}",
        "skills": f"Here are my core skills:\n\n{summary}",
        "projects": f"Here are the kinds of systems I build:\n\n{summary}",
        "certifications": f"Here is a quick profile snapshot:\n\n{summary}",
        "contact": f"You can reach me at:\n- Email: chiomaprincewillc@yahoo.com\n- LinkedIn: linkedin.com/in/pwill01\n- GitHub: github.com/MrPwill\n\nI'm actively seeking AI Engineer, LLM Engineer, Agentic AI Engineer roles, and freelance projects.",
    }
    
    response = ""
    for key, value in responses.items():
        if key in user_msg:
            response = value
            break
    
    if not response:
        response = (
            "I'm Princewill C. Chioma, an AI Systems Engineer based in Lagos, Nigeria. "
            f"{summary}\n\nWould you like to know more about my experience, skills, or projects?"
        )
    
    # Stream words instead of characters for cleaner display
    words = response.split()
    for i, word in enumerate(words):
        if i > 0:
            yield " "
        yield word


def _compact_profile_summary(profile: str, max_len: int = 450) -> str:
    """Convert extracted profile text into a readable short summary fallback."""
    collapsed = " ".join(profile.replace("\n", " ").split())
    if len(collapsed) <= max_len:
        return collapsed
    return collapsed[:max_len].rstrip() + "..."


def _extract_clean_summary(profile: str) -> str:
    """Prefer the PROFESSIONAL SUMMARY section and clean PDF extraction artifacts."""
    marker = "=== PROFESSIONAL SUMMARY ==="
    summary_text = profile
    if marker in profile:
        summary_text = profile.split(marker, 1)[1]

    # Remove common PDF extraction artifacts and normalize whitespace.
    summary_text = re.sub(r"[^\x20-\x7E\n]", " ", summary_text)
    summary_text = " ".join(summary_text.replace("\n", " ").split())
    summary_text = summary_text.strip(" -|")

    if not summary_text:
        return (
            "I design and deploy production AI systems including LLM apps, "
            "RAG pipelines, and agentic workflows with a focus on business impact."
        )

    return _compact_profile_summary(summary_text)
