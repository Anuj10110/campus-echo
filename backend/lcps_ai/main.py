"""
LCPS AI Assistant - Main Application
A conversational AI assistant for students with NLP, task management, and more.
"""
import sys
import os
from colorama import init, Fore, Style

# Initialize colorama for Windows
init(autoreset=True)

# Import core components
from core.ai_engine import AIEngine, JokeGenerator
from core.intent_analyzer import IntentAnalyzer

# Import modules
from modules.task_reminder import TaskManager
from modules.schedule_manager import ScheduleManager
from modules.deadline_tracker import DeadlineTracker
from modules.weather import Weather
from modules.calculator import Calculator
from modules.summarizer import Summarizer
from modules.youtube_handler import YouTubeHandler
from modules.stt_handler import STTHandler
from modules.tts_handler import TTSHandler

# Import storage
from storage import Database, CacheManager

# Import utilities
from utils.logger import logger
from utils.helpers import get_day_of_week


class LCPSAssistant:
    """Main LCPS AI Assistant class"""
    
    def __init__(self, use_voice=False):
        """Initialize the AI Assistant"""
        logger.info("=" * 60)
        logger.info("Initializing LCPS AI Assistant...")
        logger.info("=" * 60)
        
        self.use_voice = use_voice
        self.running = False
        
        # Initialize storage
        logger.info("Setting up storage...")
        self.db = Database()
        self.cache = CacheManager()
        
        # Initialize core AI components
        logger.info("Loading AI models (this may take a moment)...")
        try:
            self.ai_engine = AIEngine()
            self.intent_analyzer = IntentAnalyzer()
        except Exception as e:
            logger.error(f"Failed to load AI models: {e}")
            logger.error("Please ensure you have installed all dependencies and have internet connection for first-time model downloads.")
            sys.exit(1)
        
        # Initialize modules
        logger.info("Initializing modules...")
        self.task_manager = TaskManager(self.db)
        self.schedule_manager = ScheduleManager(self.db)
        self.deadline_tracker = DeadlineTracker(self.db)
        self.weather = Weather()
        self.calculator = Calculator()
        self.youtube = YouTubeHandler()
        self.joke_generator = JokeGenerator()
        
        # Initialize voice handlers (optional)
        self.stt = None
        self.tts = None
        self.tts_enabled = False  # Separate TTS control
        
        if use_voice:
            try:
                logger.info("Initializing voice handlers...")
                self.stt = STTHandler()
                self.tts = TTSHandler()
                self.tts_enabled = True  # Auto-enable TTS if voice mode
            except Exception as e:
                logger.warning(f"Voice features unavailable: {e}")
                self.use_voice = False
        else:
            # Initialize TTS even without voice input for talkback feature
            try:
                self.tts = TTSHandler()
                logger.info("Text-to-speech available (use 'tts on' to enable)")
            except Exception as e:
                logger.debug(f"TTS unavailable: {e}")
        
        # Load summarizer lazily (heavy model)
        self._summarizer = None
        
        logger.info(Fore.GREEN + "✓ LCPS AI Assistant ready!")
        logger.info("=" * 60)
    
    @property
    def summarizer(self):
        """Lazy load summarizer"""
        if self._summarizer is None:
            logger.info("Loading summarization model...")
            try:
                self._summarizer = Summarizer()
            except Exception as e:
                logger.error(f"Failed to load summarizer: {e}")
                return None
        return self._summarizer
    
    def print_welcome(self):
        """Print welcome message"""
        print(f"\n{Fore.CYAN}{'=' * 60}")
        print(f"{Fore.CYAN}🎓 Welcome to LCPS AI Assistant!")
        print(f"{Fore.CYAN}{'=' * 60}")
        print(f"{Fore.YELLOW}Your intelligent study companion")
        print(f"\n{Fore.GREEN}What I can help you with:")
        print(f"  • Natural conversation and questions")
        print(f"  • Task and deadline tracking")
        print(f"  • Class schedule management")
        print(f"  • Math calculations")
        print(f"  • Weather information")
        print(f"  • Document summarization")
        print(f"  • YouTube search")
        print(f"  • Jokes and entertainment")
        print(f"\n{Fore.CYAN}Type 'help' for commands or 'quit' to exit")
        print(f"{Fore.CYAN}{'=' * 60}\n")
    
    def print_help(self):
        """Print help information"""
        help_text = f"""
{Fore.CYAN}{'=' * 60}
📚 LCPS AI Assistant - Command Reference
{'=' * 60}{Style.RESET_ALL}

{Fore.YELLOW}General Commands:{Style.RESET_ALL}
  help              - Show this help message
  quit/exit         - Exit the assistant
  clear             - Clear conversation history
  voice on/off      - Enable/disable voice input (STT)
  tts on/off        - Enable/disable text-to-speech (talkback)
  
{Fore.YELLOW}Task Management:{Style.RESET_ALL}
  "Add task: [task name]"
  "Show tasks" / "List tasks"
  "Complete task [id]"
  
{Fore.YELLOW}Schedule:{Style.RESET_ALL}
  "What's my schedule?" / "Today's schedule"
  "Add class: [subject] on [day] at [time]"
  
{Fore.YELLOW}Deadlines:{Style.RESET_ALL}
  "Show deadlines"
  "Add deadline: [type] - [title] on [date]"
  
{Fore.YELLOW}Calculations:{Style.RESET_ALL}
  "Calculate 25 + 17"
  "What is 15% of 200?"
  
{Fore.YELLOW}Weather:{Style.RESET_ALL}
  "What's the weather in London?"
  "Weather forecast"
  
{Fore.YELLOW}Other Features:{Style.RESET_ALL}
  "Summarize document: [path]"
  "Tell me a joke"
  "Search YouTube for [query]"
  "Open YouTube"
  
{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}
"""
        print(help_text)
    
    def get_input(self) -> str:
        """Get user input (text or voice)"""
        if self.use_voice and self.stt and self.stt.is_available():
            print(f"{Fore.YELLOW}🎤 Say something (or type 'text' to switch to text input):{Style.RESET_ALL}")
            user_input = self.stt.listen()
            if user_input.lower() == 'text':
                self.use_voice = False
                return self.get_input()
            return user_input
        else:
            return input(f"{Fore.GREEN}You: {Style.RESET_ALL}")
    
    def speak_response(self, text: str):
        """Speak response if TTS is enabled"""
        if self.tts_enabled and self.tts and self.tts.is_available():
            self.tts.speak(text)
    
    def process_input(self, user_input: str) -> str:
        """Process user input and generate response"""
        if not user_input.strip():
            return ""
        
        # Check for commands
        user_input_lower = user_input.lower().strip()
        
        if user_input_lower in ['quit', 'exit', 'bye']:
            self.running = False
            return "Goodbye! Have a great day! 👋"
        
        if user_input_lower == 'help':
            self.print_help()
            return ""
        
        if user_input_lower == 'clear':
            self.ai_engine.clear_history()
            return "Conversation history cleared! 🧹"
        
        if user_input_lower.startswith('voice'):
            if 'on' in user_input_lower:
                if self.stt and self.stt.is_available():
                    self.use_voice = True
                    return "Voice input enabled! 🎤"
                else:
                    return "Voice input not available. Please check your microphone."
            elif 'off' in user_input_lower:
                self.use_voice = False
                return "Voice input disabled. Using text input. ⌨️"
        
        # Separate TTS control
        if user_input_lower in ['tts on', 'speak on', 'talkback on']:
            if self.tts and self.tts.is_available():
                # Enable TTS without requiring voice input
                if not hasattr(self, 'tts_enabled'):
                    self.tts_enabled = False
                self.tts_enabled = True
                return "Text-to-speech enabled! 🔊 I'll speak my responses."
            else:
                return "Text-to-speech not available. Please install pyttsx3."
        
        if user_input_lower in ['tts off', 'speak off', 'talkback off']:
            self.tts_enabled = False
            return "Text-to-speech disabled. 🔇"
        
        # Check cache first
        cached_response = self.cache.get(user_input)
        if cached_response:
            logger.info("Retrieved response from cache")
            return cached_response
        
        # Detect intent
        intent = self.intent_analyzer.detect_intent(user_input)
        entities = self.intent_analyzer.extract_entities(user_input, intent)
        
        logger.info(f"Detected intent: {intent}")
        if entities:
            logger.info(f"Extracted entities: {entities}")
        
        # Route to appropriate handler
        response = self._route_intent(intent, entities, user_input)
        
        # Cache the response if appropriate
        if intent in ['weather', 'calculate', 'joke']:
            self.cache.set(user_input, response, ttl=3600)
        
        # Save conversation to database
        self.db.add_conversation(user_input, response)
        
        return response
    
    def _route_intent(self, intent: str, entities: dict, user_input: str) -> str:
        """Route intent to appropriate handler"""
        
        try:
            if intent == 'schedule':
                return self._handle_schedule(entities, user_input)
            
            elif intent == 'deadline':
                return self._handle_deadline(entities, user_input)
            
            elif intent == 'task':
                return self._handle_task(entities, user_input)
            
            elif intent == 'weather':
                return self._handle_weather(entities, user_input)
            
            elif intent == 'calculate':
                return self._handle_calculate(entities, user_input)
            
            elif intent == 'summarize':
                return self._handle_summarize(entities, user_input)
            
            elif intent == 'youtube':
                return self._handle_youtube(entities, user_input)
            
            elif intent == 'joke':
                return self.joke_generator.get_joke()
            
            else:  # conversation
                return self._handle_conversation(user_input)
        
        except Exception as e:
            logger.error(f"Error handling intent '{intent}': {e}")
            return "I encountered an error processing your request. Could you try rephrasing?"
    
    def _handle_schedule(self, entities: dict, user_input: str) -> str:
        """Handle schedule-related queries"""
        if 'add' in user_input.lower():
            return "To add a class, please use format: 'Add class: [subject] on [day] at [time]'"
        
        # Show schedule
        day = entities.get('day')
        if not day:
            day = get_day_of_week()
        
        schedule = self.schedule_manager.get_schedule(day)
        if schedule:
            return self.schedule_manager.format_schedule(schedule)
        else:
            return f"No classes scheduled for {day}."
    
    def _handle_deadline(self, entities: dict, user_input: str) -> str:
        """Handle deadline-related queries"""
        if 'add' in user_input.lower():
            return "To add a deadline, use: 'Add deadline: [type] - [title] on [date]'"
        
        # Show deadlines
        deadline_type = entities.get('type')
        deadlines = self.deadline_tracker.get_deadlines(deadline_type=deadline_type)
        
        if deadlines:
            return self.deadline_tracker.format_deadlines(deadlines)
        else:
            return "No deadlines found."
    
    def _handle_task(self, entities: dict, user_input: str) -> str:
        """Handle task-related queries"""
        user_lower = user_input.lower()
        
        if 'add' in user_lower or 'create' in user_lower:
            return "To add a task, use: 'Add task: [task name] - priority: [high/medium/low]'"
        
        elif 'complete' in user_lower or 'done' in user_lower:
            return "To complete a task, use: 'Complete task [id]'"
        
        else:
            # Show tasks
            tasks = self.task_manager.get_priority_tasks()
            if tasks:
                return self.task_manager.format_tasks(tasks)
            else:
                return "No pending tasks. You're all caught up! ✅"
    
    def _handle_weather(self, entities: dict, user_input: str) -> str:
        """Handle weather queries"""
        city = entities.get('city', 'London')  # Default city
        
        weather_info = self.weather.get_weather(city)
        return self.weather.format_weather_response(weather_info)
    
    def _handle_calculate(self, entities: dict, user_input: str) -> str:
        """Handle calculation requests"""
        expression = entities.get('expression', user_input)
        
        result = self.calculator.calculate(expression)
        if result is not None:
            return f"📊 Result: {result}"
        else:
            return "I couldn't calculate that. Please check your expression."
    
    def _handle_summarize(self, entities: dict, user_input: str) -> str:
        """Handle document summarization"""
        if not self.summarizer:
            return "Summarization feature is unavailable at the moment."
        
        # Extract file path from input
        import re
        match = re.search(r'summarize\s+(?:document|file)?:?\s*(.+)', user_input, re.IGNORECASE)
        if match:
            file_path = match.group(1).strip().strip('"\'')
            if os.path.exists(file_path):
                return self.summarizer.summarize_document(file_path)
            else:
                return f"File not found: {file_path}"
        else:
            return "Please specify a document path to summarize."
    
    def _handle_youtube(self, entities: dict, user_input: str) -> str:
        """Handle YouTube operations"""
        query = entities.get('query')
        headless = os.environ.get('LCPS_AI_HEADLESS', '0') in ['1', 'true', 'True']
        
        if query:
            url = self.youtube.search_youtube(query)
            if headless:
                return f"🎥 YouTube search link: {url}"
            return f"🎥 Opening YouTube search for: {query}"
        else:
            url = self.youtube.open_youtube()
            if headless:
                return f"🎥 YouTube link: {url}"
            return "🎥 Opening YouTube..."
    
    def _handle_conversation(self, user_input: str) -> str:
        """Handle general conversation"""
        response = self.ai_engine.generate_response(user_input)
        return response
    
    def run(self):
        """Main run loop"""
        self.running = True
        self.print_welcome()
        
        while self.running:
            try:
                # Get user input
                user_input = self.get_input()
                
                if not user_input:
                    continue
                
                # Process input
                response = self.process_input(user_input)
                
                if response:
                    print(f"{Fore.BLUE}Assistant: {Style.RESET_ALL}{response}\n")
                    self.speak_response(response)
                
            except KeyboardInterrupt:
                print(f"\n{Fore.YELLOW}Interrupted. Type 'quit' to exit.{Style.RESET_ALL}")
            except Exception as e:
                logger.error(f"Error in main loop: {e}")
                print(f"{Fore.RED}An error occurred. Please try again.{Style.RESET_ALL}")
        
        print(f"\n{Fore.CYAN}Thank you for using LCPS AI Assistant! 🎓{Style.RESET_ALL}\n")


def main():
    """Entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='LCPS AI Assistant')
    parser.add_argument('--voice', action='store_true', help='Enable voice input/output')
    parser.add_argument('--no-models', action='store_true', help='Skip loading heavy AI models (limited functionality)')
    
    args = parser.parse_args()
    
    try:
        # Create and run assistant
        assistant = LCPSAssistant(use_voice=args.voice)
        assistant.run()
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        print(f"{Fore.RED}Failed to start assistant. Please check the logs.{Style.RESET_ALL}")
        sys.exit(1)


if __name__ == "__main__":
    main()
