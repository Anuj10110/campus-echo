"""
Speech-to-Text Handler
"""
import speech_recognition as sr
import config.settings as settings
from utils.logger import logger


class STTHandler:
    """Speech-to-text using Google Speech Recognition"""
    
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = None
        
        try:
            self.microphone = sr.Microphone()
            logger.info("Microphone initialized")
        except Exception as e:
            logger.error(f"Error initializing microphone: {e}")
    
    def listen(self) -> str:
        """
        Listen for voice input and convert to text
        
        Returns:
            Transcribed text or empty string if failed
        """
        if not self.microphone:
            logger.error("Microphone not available")
            return ""
        
        try:
            with self.microphone as source:
                logger.info("Listening... Speak now!")
                # Adjust for ambient noise
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                
                # Listen for audio
                audio = self.recognizer.listen(
                    source,
                    timeout=settings.STT_TIMEOUT,
                    phrase_time_limit=settings.STT_PHRASE_TIME_LIMIT
                )
                
                logger.info("Processing speech...")
                
                # Recognize speech using Google Speech Recognition
                text = self.recognizer.recognize_google(audio)
                logger.info(f"Recognized: {text}")
                return text
                
        except sr.WaitTimeoutError:
            logger.warning("Listening timed out")
            return ""
        except sr.UnknownValueError:
            logger.warning("Could not understand audio")
            return ""
        except sr.RequestError as e:
            logger.error(f"Speech recognition service error: {e}")
            return ""
        except Exception as e:
            logger.error(f"Error during speech recognition: {e}")
            return ""
    
    def is_available(self) -> bool:
        """Check if microphone is available"""
        return self.microphone is not None
