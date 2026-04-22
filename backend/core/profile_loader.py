"""Profile loader for Digital Twin.

Loads Princewill's profile from PDF and summary.txt files.
Returns clean, pre-formatted profile data for LLM context injection.
"""

from functools import lru_cache
from pathlib import Path
import os


@lru_cache(maxsize=1)
def load_profile() -> str:
    """Load and cache Princewill's career profile from PDF and summary.
    
    Reads from:
    - backend/me/princewill_profile.pdf (via pypdf)
    - backend/me/summary.txt (plain text)
    
    Returns combined profile string for Digital Twin context.
    """
    pdf_text = ""
    summary_text = ""
    
    # Resolve from backend/ directory (this file is backend/core/profile_loader.py)
    base_path = Path(__file__).resolve().parent.parent
    pdf_path = base_path / "me" / "princewill_profile.pdf"
    summary_path = base_path / "me" / "summary.txt"
    
    # Load PDF if available
    try:
        if pdf_path.exists():
            from pypdf import PdfReader
            reader = PdfReader(str(pdf_path))
            for page_num, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    pdf_text += extracted.strip() + "\n"
    except Exception as e:
        print(f"Warning: Could not read PDF ({pdf_path}): {e}")
    
    # Load summary if available
    try:
        if summary_path.exists():
            with open(summary_path, "r", encoding="utf-8") as f:
                summary_text = f.read().strip()
    except Exception as e:
        print(f"Warning: Could not read summary ({summary_path}): {e}")
    
    # Construct final profile with headers
    profile_parts = []
    
    if pdf_text:
        profile_parts.append("=== CAREER PROFILE (PDF) ===")
        profile_parts.append(pdf_text)
    
    if summary_text:
        profile_parts.append("=== PROFESSIONAL SUMMARY ===")
        profile_parts.append(summary_text)
    
    if not profile_parts:
        # Fallback if files missing (should not happen in production)
        profile_parts.append("Profile data unavailable. Contact: chiomaprincewillc@yahoo.com")
    
    return "\n\n".join(profile_parts).strip()


def get_profile_length() -> int:
    """Get character length of loaded profile. For testing/validation."""
    return len(load_profile())


def clear_profile_cache() -> None:
    """Clear the profile cache. For testing."""
    load_profile.cache_clear()
