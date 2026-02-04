"""
AI Engine using Transformers for conversational AI
Uses Microsoft's DialoGPT for natural, context-aware conversations
"""
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import config.settings as settings
from utils.logger import logger
from typing import List, Tuple


class AIEngine:
    """Conversational AI engine using DialoGPT"""
    
    def __init__(self):
        self.model_name = settings.CONVERSATIONAL_MODEL
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.tokenizer = None
        self.conversation_history = []
        self.max_history = settings.MAX_CONVERSATION_LENGTH
        
        logger.info(f"AI Engine initializing on {self.device}...")
        self._load_model()
    
    def _load_model(self):
        """Load DialoGPT model and tokenizer"""
        try:
            logger.info(f"Loading model: {self.model_name}")
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name,
                cache_dir=str(settings.MODELS_DIR)
            )
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                cache_dir=str(settings.MODELS_DIR)
            )
            self.model.to(self.device)
            self.model.eval()
            
            # Set padding token
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            logger.info("Model loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def generate_response(self, user_input: str, use_history: bool = True) -> str:
        """
        Generate a conversational response
        
        Args:
            user_input: User's message
            use_history: Whether to use conversation history for context
        
        Returns:
            Generated response
        """
        try:
            # Add user input to history
            if use_history:
                self.conversation_history.append(user_input)
                
                # Keep only recent history
                if len(self.conversation_history) > self.max_history * 2:
                    self.conversation_history = self.conversation_history[-(self.max_history * 2):]
                
                # Create conversation context
                conversation_text = " ".join(self.conversation_history)
            else:
                conversation_text = user_input
            
            # Tokenize input
            inputs = self.tokenizer.encode(
                conversation_text + self.tokenizer.eos_token,
                return_tensors='pt',
                truncation=True,
                max_length=512
            ).to(self.device)
            
            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    max_length=inputs.shape[1] + settings.MAX_GENERATION_LENGTH,
                    temperature=settings.TEMPERATURE,
                    top_p=settings.TOP_P,
                    do_sample=True,
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                    no_repeat_ngram_size=3
                )
            
            # Decode response
            response = self.tokenizer.decode(
                outputs[0][inputs.shape[1]:],
                skip_special_tokens=True
            ).strip()
            
            # Add response to history
            if use_history and response:
                self.conversation_history.append(response)
            
            return response if response else "I'm not sure how to respond to that. Can you rephrase?"
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "Sorry, I encountered an error while thinking about your message."
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
        logger.info("Conversation history cleared")
    
    def get_history(self) -> List[str]:
        """Get conversation history"""
        return self.conversation_history.copy()
    
    def set_history(self, history: List[str]):
        """Set conversation history"""
        self.conversation_history = history[-self.max_history * 2:]


class JokeGenerator:
    """Simple joke generator for entertainment"""
    
    jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why did the student eat their homework? Because the teacher said it was a piece of cake!",
        "What did the calculator say to the student? You can count on me!",
        "Why was the math book sad? It had too many problems.",
        "What's the best thing about Switzerland? The flag is a big plus!",
        "Why do Java developers wear glasses? Because they don't C#!",
        "How does a computer get drunk? It takes screenshots!",
        "Why did the PowerPoint presentation cross the road? To get to the other slide!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why don't scientists trust atoms? Because they make up everything!"
    ]
    
    def __init__(self):
        self.current_index = 0
    
    def get_joke(self) -> str:
        """Get a random joke"""
        import random
        return random.choice(self.jokes)
    
    def get_next_joke(self) -> str:
        """Get next joke in sequence"""
        joke = self.jokes[self.current_index % len(self.jokes)]
        self.current_index += 1
        return joke
