"""
Logging utility for the AI Assistant
"""
import logging
import sys
from pathlib import Path
import config.settings as settings


def setup_logger(name: str = "AI_Assistant") -> logging.Logger:
    """Setup and configure logger"""
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    
    # Formatter
    formatter = logging.Formatter(settings.LOG_FORMAT)
    console_handler.setFormatter(formatter)
    
    # Add handlers
    if not logger.handlers:
        logger.addHandler(console_handler)
    
    return logger


# Global logger instance
logger = setup_logger()
