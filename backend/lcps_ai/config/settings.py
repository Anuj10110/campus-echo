"""
Configuration settings for the AI Assistant
"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage" / "data"
CACHE_DIR = STORAGE_DIR / "cache"
MODELS_DIR = BASE_DIR / "models" / "cache"

# Database
DATABASE_PATH = STORAGE_DIR / "assistant.db"

# Models Configuration
CONVERSATIONAL_MODEL = "microsoft/DialoGPT-medium"  # For general conversation
SUMMARIZATION_MODEL = "facebook/bart-large-cnn"  # For document summarization
SENTENCE_TRANSFORMER_MODEL = "all-MiniLM-L6-v2"  # For intent analysis

# Cache Configuration
CACHE_SIZE_LIMIT = 500 * 1024 * 1024  # 500 MB
CACHE_TTL = 86400  # 24 hours in seconds

# Weather API
WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

# Speech Recognition
STT_TIMEOUT = 5  # seconds
STT_PHRASE_TIME_LIMIT = 10  # seconds

# TTS Configuration
TTS_RATE = 150  # words per minute
TTS_VOLUME = 0.9  # 0.0 to 1.0

# Logging
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Task Reminder
REMINDER_CHECK_INTERVAL = 60  # Check every 60 seconds

# AI Model Parameters
MAX_CONVERSATION_LENGTH = 5  # Keep last 5 conversation turns
MAX_GENERATION_LENGTH = 100  # Max tokens for response generation
TEMPERATURE = 0.7  # Creativity vs coherence (0.0 to 1.0)
TOP_P = 0.9  # Nucleus sampling

# Ensure directories exist
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
