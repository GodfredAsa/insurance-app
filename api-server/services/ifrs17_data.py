"""
IFRS 17 data loader. Loads sample data from project-root ifrs17_sample_data.json.
"""
from pathlib import Path
import json
from typing import Any

# Project root (parent of api-server) for ifrs17_sample_data.json
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
_DEFAULT_DATA_PATH = _PROJECT_ROOT / "ifrs17_sample_data.json"

_data_cache: dict[str, Any] | None = None


def load_data(path: Path | None = None) -> dict[str, Any]:
    """Load IFRS 17 JSON data. Uses cached copy if already loaded."""
    global _data_cache
    if _data_cache is not None:
        return _data_cache
    data_path = path or _DEFAULT_DATA_PATH
    if not data_path.exists():
        raise FileNotFoundError(f"IFRS 17 data file not found: {data_path}")
    with open(data_path, encoding="utf-8") as f:
        _data_cache = json.load(f)
    return _data_cache


def clear_cache() -> None:
    """Clear cached data (e.g. for tests or reload)."""
    global _data_cache
    _data_cache = None
