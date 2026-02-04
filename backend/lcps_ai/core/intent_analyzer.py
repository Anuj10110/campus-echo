"""
Intent Analyzer using sentence transformers
"""
from sentence_transformers import SentenceTransformer, util
import config.settings as settings
from utils.logger import logger
from typing import Dict, List


class IntentAnalyzer:
    """Analyze intent from text and documents"""
    
    def __init__(self):
        self.model = None
        logger.info("Initializing intent analyzer...")
        self._load_model()
        
        # Define intent categories and their keywords
        self.intent_patterns = {
            'schedule': ['schedule', 'timetable', 'class', 'classes', 'today schedule', 'my schedule'],
            'deadline': ['deadline', 'exam', 'fee', 'library', 'due date', 'assignment', 'submit'],
            'task': ['task', 'todo', 'reminder', 'remind me', 'add task', 'complete task'],
            'weather': ['weather', 'temperature', 'forecast', 'climate', 'rain', 'sunny'],
            'calculate': ['calculate', 'compute', 'math', 'add', 'subtract', 'multiply', 'divide', 'average', 'plus', 'minus'],
            'summarize': ['summarize', 'summary', 'key points', 'brief', 'main idea', 'tldr'],
            'youtube': ['youtube', 'open youtube', 'search youtube', 'play video', 'watch'],
            'joke': ['joke', 'tell me a joke', 'funny', 'make me laugh', 'humor'],
            'conversation': ['hello', 'hi', 'how are you', 'what\'s up', 'hey', 'good morning', 'good evening'],
        }
    
    def _load_model(self):
        """Load sentence transformer model"""
        try:
            logger.info(f"Loading sentence transformer: {settings.SENTENCE_TRANSFORMER_MODEL}")
            self.model = SentenceTransformer(
                settings.SENTENCE_TRANSFORMER_MODEL,
                cache_folder=str(settings.MODELS_DIR)
            )
            logger.info("Intent analyzer model loaded!")
        except Exception as e:
            logger.error(f"Error loading intent analyzer model: {e}")
            raise
    
    def detect_intent(self, text: str) -> str:
        """
        Detect the primary intent from text
        
        Args:
            text: Input text
        
        Returns:
            Intent category as string
        """
        text_lower = text.lower()
        
        # Simple keyword matching first (faster)
        for intent, keywords in self.intent_patterns.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return intent
        
        # If no direct match, use semantic similarity
        return self._detect_intent_semantic(text)
    
    def _detect_intent_semantic(self, text: str) -> str:
        """Use semantic similarity to detect intent"""
        try:
            # Encode input text
            text_embedding = self.model.encode(text, convert_to_tensor=True)
            
            # Encode intent patterns
            max_similarity = -1
            detected_intent = 'conversation'  # default
            
            for intent, keywords in self.intent_patterns.items():
                # Encode all keywords for this intent
                keyword_embeddings = self.model.encode(keywords, convert_to_tensor=True)
                
                # Calculate similarity
                similarities = util.cos_sim(text_embedding, keyword_embeddings)
                max_sim = similarities.max().item()
                
                if max_sim > max_similarity:
                    max_similarity = max_sim
                    detected_intent = intent
            
            return detected_intent if max_similarity > 0.3 else 'conversation'
            
        except Exception as e:
            logger.error(f"Error in semantic intent detection: {e}")
            return 'conversation'
    
    def analyze_document_intent(self, text: str) -> Dict[str, float]:
        """
        Analyze document and return intent scores for different categories
        
        Args:
            text: Document text
        
        Returns:
            Dictionary of intent categories and their scores
        """
        try:
            # Encode document
            doc_embedding = self.model.encode(text, convert_to_tensor=True)
            
            intent_scores = {}
            
            for intent, keywords in self.intent_patterns.items():
                # Encode keywords
                keyword_embeddings = self.model.encode(keywords, convert_to_tensor=True)
                
                # Calculate average similarity
                similarities = util.cos_sim(doc_embedding, keyword_embeddings)
                avg_similarity = similarities.mean().item()
                
                intent_scores[intent] = avg_similarity
            
            return intent_scores
            
        except Exception as e:
            logger.error(f"Error analyzing document intent: {e}")
            return {}
    
    def extract_entities(self, text: str, intent: str) -> Dict:
        """
        Extract relevant entities based on intent
        
        Args:
            text: Input text
            intent: Detected intent
        
        Returns:
            Dictionary of extracted entities
        """
        import re
        
        entities = {}
        text_lower = text.lower()
        
        if intent == 'schedule':
            # Extract day
            days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            for day in days:
                if day in text_lower:
                    entities['day'] = day.capitalize()
                    break
        
        elif intent == 'deadline':
            # Extract deadline type
            types = ['exam', 'fee', 'library', 'assignment']
            for dtype in types:
                if dtype in text_lower:
                    entities['type'] = dtype
                    break
        
        elif intent == 'calculate':
            # Extract mathematical expression
            # Remove common words
            expr = re.sub(r'\b(calculate|compute|what is|solve)\b', '', text_lower, flags=re.IGNORECASE)
            entities['expression'] = expr.strip()
        
        elif intent == 'weather':
            # Try to extract city name
            # Simple pattern: "weather in [city]" or "[city] weather"
            match = re.search(r'(?:weather (?:in|for) |in )([a-zA-Z ]+?)(?:\?|$| weather)', text_lower)
            if match:
                entities['city'] = match.group(1).strip().title()
        
        elif intent == 'youtube':
            # Extract search query
            match = re.search(r'(?:search|find|play|open) (?:youtube for |on youtube )?(.*?)(?:\?|$)', text_lower)
            if match:
                entities['query'] = match.group(1).strip()
        
        return entities
