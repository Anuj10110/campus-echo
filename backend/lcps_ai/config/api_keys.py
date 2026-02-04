"""API Keys Configuration.

This file is intentionally safe to commit.
Configure keys via environment variables:
- OPENWEATHER_API_KEY
- HUGGINGFACE_API_TOKEN (optional)
"""

import os

OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', '')
HUGGINGFACE_API_TOKEN = os.environ.get('HUGGINGFACE_API_TOKEN', '')
