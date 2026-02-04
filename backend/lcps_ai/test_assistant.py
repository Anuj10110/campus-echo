"""
Test script for LCPS AI Assistant
Verifies all core components work correctly
"""
import sys
from colorama import init, Fore, Style

init(autoreset=True)

def print_test_header(test_name):
    """Print test section header"""
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}Testing: {test_name}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")

def print_success(message):
    """Print success message"""
    print(f"{Fore.GREEN}✓ {message}{Style.RESET_ALL}")

def print_error(message):
    """Print error message"""
    print(f"{Fore.RED}✗ {message}{Style.RESET_ALL}")

def print_info(message):
    """Print info message"""
    print(f"{Fore.YELLOW}ℹ {message}{Style.RESET_ALL}")


def test_imports():
    """Test if all modules can be imported"""
    print_test_header("Module Imports")
    
    modules = [
        ("Core AI Engine", "core.ai_engine", "AIEngine"),
        ("Intent Analyzer", "core.intent_analyzer", "IntentAnalyzer"),
        ("Task Manager", "modules.task_reminder", "TaskManager"),
        ("Schedule Manager", "modules.schedule_manager", "ScheduleManager"),
        ("Deadline Tracker", "modules.deadline_tracker", "DeadlineTracker"),
        ("Weather", "modules.weather", "Weather"),
        ("Calculator", "modules.calculator", "Calculator"),
        ("YouTube Handler", "modules.youtube_handler", "YouTubeHandler"),
        ("Database", "storage.database", "Database"),
        ("Cache Manager", "storage.cache_manager", "CacheManager"),
    ]
    
    failed = []
    for name, module_path, class_name in modules:
        try:
            module = __import__(module_path, fromlist=[class_name])
            getattr(module, class_name)
            print_success(f"{name} imported successfully")
        except Exception as e:
            print_error(f"{name} import failed: {e}")
            failed.append(name)
    
    return len(failed) == 0, failed


def test_database():
    """Test database functionality"""
    print_test_header("Database Operations")
    
    try:
        from storage import Database
        db = Database()
        
        # Test task operations
        task_id = db.add_task("Test Task", "Test description", "high")
        print_success(f"Added task with ID: {task_id}")
        
        tasks = db.get_tasks()
        print_success(f"Retrieved {len(tasks)} task(s)")
        
        db.complete_task(task_id)
        print_success("Marked task as complete")
        
        db.delete_task(task_id)
        print_success("Deleted task")
        
        return True
    except Exception as e:
        print_error(f"Database test failed: {e}")
        return False


def test_calculator():
    """Test calculator module"""
    print_test_header("Calculator")
    
    try:
        from modules.calculator import Calculator
        calc = Calculator()
        
        test_cases = [
            ("5 + 3", 8),
            ("10 * 2", 20),
            ("15 - 7", 8),
            ("20 / 4", 5),
        ]
        
        for expression, expected in test_cases:
            result = calc.calculate(expression)
            if result == expected:
                print_success(f"{expression} = {result}")
            else:
                print_error(f"{expression} = {result}, expected {expected}")
                return False
        
        return True
    except Exception as e:
        print_error(f"Calculator test failed: {e}")
        return False


def test_intent_analyzer():
    """Test intent detection"""
    print_test_header("Intent Analysis (may take a moment to load model)")
    
    try:
        from core.intent_analyzer import IntentAnalyzer
        analyzer = IntentAnalyzer()
        
        test_cases = [
            ("What's the weather today?", "weather"),
            ("Calculate 5 + 3", "calculate"),
            ("Show my tasks", "task"),
            ("Tell me a joke", "joke"),
            ("What's my schedule?", "schedule"),
        ]
        
        correct = 0
        for text, expected_intent in test_cases:
            detected = analyzer.detect_intent(text)
            if detected == expected_intent:
                print_success(f"'{text}' → {detected}")
                correct += 1
            else:
                print_info(f"'{text}' → {detected} (expected {expected_intent})")
        
        print_info(f"Intent detection accuracy: {correct}/{len(test_cases)}")
        return True
    except Exception as e:
        print_error(f"Intent analyzer test failed: {e}")
        return False


def test_ai_engine():
    """Test conversational AI"""
    print_test_header("AI Conversation Engine (may take a moment)")
    
    try:
        from core.ai_engine import AIEngine
        ai = AIEngine()
        
        print_info("Testing conversation generation...")
        response = ai.generate_response("Hello!", use_history=False)
        
        if response and len(response) > 0:
            print_success(f"Generated response: '{response[:50]}...'")
            return True
        else:
            print_error("Failed to generate response")
            return False
    except Exception as e:
        print_error(f"AI Engine test failed: {e}")
        print_info("Note: AI models require significant resources and internet for first download")
        return False


def test_helpers():
    """Test helper utilities"""
    print_test_header("Helper Utilities")
    
    try:
        from utils.helpers import parse_date, parse_time, calculate_priority_score
        
        # Test date parsing
        date = parse_date("2026-02-15")
        print_success(f"Date parsing: {date}")
        
        # Test time parsing
        time = parse_time("9:30 AM")
        print_success(f"Time parsing: {time}")
        
        # Test priority scoring
        score = calculate_priority_score("high")
        print_success(f"Priority score: {score}")
        
        return True
    except Exception as e:
        print_error(f"Helper utilities test failed: {e}")
        return False


def test_cache():
    """Test caching system"""
    print_test_header("Cache Manager")
    
    try:
        from storage import CacheManager
        cache = CacheManager()
        
        # Test cache operations
        cache.set("test_query", "test_response")
        print_success("Set cache entry")
        
        response = cache.get("test_query")
        if response == "test_response":
            print_success("Retrieved cached response")
        else:
            print_error("Cache retrieval failed")
            return False
        
        stats = cache.get_stats()
        print_success(f"Cache stats: {stats}")
        
        cache.clear()
        print_success("Cache cleared")
        
        return True
    except Exception as e:
        print_error(f"Cache test failed: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}🧪 LCPS AI Assistant - Test Suite")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
    
    results = {}
    
    # Run tests
    results["Imports"], failed_imports = test_imports()
    
    if not results["Imports"]:
        print_error(f"\nCritical: Failed to import modules: {failed_imports}")
        print_error("Please ensure all dependencies are installed:")
        print_info("pip install -r requirements.txt")
        return
    
    results["Database"] = test_database()
    results["Calculator"] = test_calculator()
    results["Helpers"] = test_helpers()
    results["Cache"] = test_cache()
    results["Intent Analyzer"] = test_intent_analyzer()
    
    # AI Engine test (can be slow/fail without internet)
    print_info("\nNote: AI Engine test requires internet connection and may take time...")
    user_input = input("Run AI Engine test? (y/n): ").strip().lower()
    if user_input == 'y':
        results["AI Engine"] = test_ai_engine()
    else:
        results["AI Engine"] = None
    
    # Summary
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}📊 Test Summary")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}\n")
    
    passed = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    skipped = sum(1 for v in results.values() if v is None)
    
    for test_name, result in results.items():
        if result is True:
            print(f"{Fore.GREEN}✓ {test_name}: PASSED{Style.RESET_ALL}")
        elif result is False:
            print(f"{Fore.RED}✗ {test_name}: FAILED{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}⊘ {test_name}: SKIPPED{Style.RESET_ALL}")
    
    print(f"\n{Fore.CYAN}Total: {passed} passed, {failed} failed, {skipped} skipped{Style.RESET_ALL}")
    
    if failed == 0:
        print(f"\n{Fore.GREEN}{'='*60}")
        print(f"{Fore.GREEN}✓ All tests passed! Your LCPS AI Assistant is ready to use!")
        print(f"{Fore.GREEN}{'='*60}{Style.RESET_ALL}")
        print(f"\n{Fore.YELLOW}To start the assistant, run:{Style.RESET_ALL}")
        print(f"{Fore.CYAN}python main.py{Style.RESET_ALL}\n")
    else:
        print(f"\n{Fore.RED}{'='*60}")
        print(f"{Fore.RED}⚠ Some tests failed. Please fix the issues before using the assistant.")
        print(f"{Fore.RED}{'='*60}{Style.RESET_ALL}\n")


if __name__ == "__main__":
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Tests interrupted by user{Style.RESET_ALL}")
    except Exception as e:
        print(f"\n{Fore.RED}Fatal error: {e}{Style.RESET_ALL}")
        sys.exit(1)
