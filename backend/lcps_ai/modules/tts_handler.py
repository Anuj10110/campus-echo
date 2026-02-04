"""
Text-to-Speech Handler
"""
import pyttsx3
import config.settings as settings
from utils.logger import logger


class TTSHandler:
    """Text-to-speech using pyttsx3 (offline)"""
    
    def __init__(self):
        self.engine = None
        try:
            self.engine = pyttsx3.init()
            
            # Configure voice properties
            self.engine.setProperty('rate', settings.TTS_RATE)
            self.engine.setProperty('volume', settings.TTS_VOLUME)
            
            # Try to set a voice (optional)
            voices = self.engine.getProperty('voices')
            if voices:
                # Use first available voice (usually default)
                self.engine.setProperty('voice', voices[0].id)
            
            logger.info("TTS engine initialized")
        except Exception as e:
            logger.error(f"Error initializing TTS engine: {e}")
    
    def speak(self, text: str):
        """
        Convert text to speech and play
        
        Args:
            text: Text to speak
        """
        if not self.engine:
            logger.error("TTS engine not available")
            return
        
        try:
            logger.info(f"Speaking: {text[:50]}...")
            self.engine.say(text)
            self.engine.runAndWait()
        except Exception as e:
            logger.error(f"Error during speech synthesis: {e}")
    
    def is_available(self) -> bool:
        """Check if TTS engine is available"""
        return self.engine is not None
    
    def set_rate(self, rate: int):
        """Set speech rate"""
        if self.engine:
            self.engine.setProperty('rate', rate)
    
    def set_volume(self, volume: float):
        """Set volume (0.0 to 1.0)"""
        if self.engine:
            self.engine.setProperty('volume', volume)
