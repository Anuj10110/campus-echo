# 🎓 LCPS AI Assistant

An intelligent conversational AI assistant for students with Natural Language Processing (NLP), task management, schedule tracking, and more.

## ✨ Features

### 🤖 Core AI Capabilities
- **Conversational AI**: Natural conversations powered by Microsoft's DialoGPT
- **Intent Recognition**: Semantic understanding using sentence transformers
- **Context-Aware**: Maintains conversation history for better interactions

### 📚 Student Features
- **Task Management**: Create, track, and prioritize tasks with deadlines
- **Schedule Manager**: Keep track of your class timetable
- **Deadline Tracker**: Never miss exams, assignments, or fee payments
- **Calculator**: Solve mathematical expressions with natural language
- **Document Summarization**: Summarize PDFs and Word documents using BART model

### 🌐 Additional Features
- **Weather Information**: Get current weather for any city
- **YouTube Integration**: Search and open YouTube videos
- **Voice Input/Output**: Optional speech recognition and text-to-speech
- **Caching System**: Fast responses for repeated queries
- **Database Storage**: Persistent storage for all your data

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Internet connection (for first-time model downloads)

### Installation

1. **Navigate to the assistant folder (from the repo root):**
```powershell
cd backend\lcps_ai
```

2. **Create a virtual environment (recommended):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. **Install dependencies:**
```powershell
pip install -r requirements.txt
```

4. **Configure API Keys (optional):**
Set environment variables (recommended):
```powershell
$env:OPENWEATHER_API_KEY = "your_api_key_here"
# optional
$env:HUGGINGFACE_API_TOKEN = "your_token_here"
```

### Running the Assistant

**Basic usage:**
```powershell
python main.py
```

**With voice input/output:**
```powershell
python main.py --voice
```

## 📖 Usage Guide

### Basic Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `quit` or `exit` | Exit the assistant |
| `clear` | Clear conversation history |
| `voice on/off` | Toggle voice input |

### Task Management

```
You: Show tasks
You: Add task: Complete assignment - priority: high
You: Complete task 1
```

### Schedule Management

```
You: What's my schedule?
You: Today's schedule
You: Add class: Mathematics on Monday at 9:00 AM
```

### Deadline Tracking

```
You: Show deadlines
You: Add deadline: exam - Final Math Exam on 2026-02-15
You: Show exam deadlines
```

### Calculations

```
You: Calculate 25 + 17 * 3
You: What is 15% of 200?
You: Solve 2^8
```

### Weather

```
You: What's the weather in London?
You: Weather in New York
```

### Document Summarization

```
You: Summarize document: C:\path\to\document.pdf
You: Summarize: paper.docx
```

### YouTube

```
You: Search YouTube for Python tutorials
You: Open YouTube
```

### General Conversation

```
You: Hello! How are you?
You: Tell me a joke
You: What's 2+2?
```

## 🏗️ Architecture

### Project Structure

```
backend/lcps_ai/
├── main.py                 # Main application entry point
├── requirements.txt        # Python dependencies
├── README.md               # This file
│
├── config/                # Configuration files
│   ├── __init__.py
│   ├── settings.py       # Global settings
│   └── api_keys.py       # API keys (configure this!)
│
├── core/                  # Core AI components
│   ├── ai_engine.py      # Conversational AI (DialoGPT)
│   └── intent_analyzer.py # Intent detection (Sentence Transformers)
│
├── modules/               # Feature modules
│   ├── task_reminder.py  # Task management
│   ├── schedule_manager.py # Schedule tracking
│   ├── deadline_tracker.py # Deadline management
│   ├── calculator.py     # Mathematical calculations
│   ├── weather.py        # Weather information
│   ├── summarizer.py     # Document summarization (BART)
│   ├── youtube_handler.py # YouTube integration
│   ├── stt_handler.py    # Speech-to-text
│   └── tts_handler.py    # Text-to-speech
│
├── storage/              # Data persistence
│   ├── database.py       # SQLite database
│   └── cache_manager.py  # Response caching
│
├── utils/                # Utility functions
│   ├── helpers.py        # Helper functions
│   ├── logger.py         # Logging setup
│   └── document_parser.py # PDF/Word parsing
│
└── models/               # Downloaded AI models (auto-created)
    └── cache/
```

### AI Models Used

1. **DialoGPT-medium** (Microsoft): Conversational AI
   - Natural conversation generation
   - Context-aware responses

2. **all-MiniLM-L6-v2**: Intent analysis
   - Semantic similarity matching
   - Entity extraction

3. **BART-large-CNN** (Facebook): Document summarization
   - Extractive and abstractive summarization
   - Loaded lazily to save memory

## 🧪 Testing the MVP

### Test Script
A test script is included to verify all components work:

```powershell
python test_assistant.py
```

### Manual Testing Checklist

1. **AI Engine Test:**
   - Start the assistant
   - Type: "Hello, how are you?"
   - Verify conversational response

2. **Intent Detection Test:**
   - Type: "What's the weather?"
   - Should detect 'weather' intent
   - Type: "Calculate 5 + 3"
   - Should detect 'calculate' intent

3. **Task Management:**
   - Add a task
   - List tasks
   - Verify database persistence

4. **Calculator:**
   - Try: "Calculate 15 * 3 + 7"
   - Verify correct result

5. **Conversation History:**
   - Have a multi-turn conversation
   - Verify context is maintained

## 🛠️ Troubleshooting

### Common Issues

**1. Model download fails:**
```
Solution: Check internet connection. Models are downloaded on first run (~1-2 GB total)
```

**2. PyAudio installation error (Windows):**
```powershell
# Install PyAudio from precompiled wheel
pip install pipwin
pipwin install pyaudio
```

**3. No voice input/output:**
```
Solution: Voice features are optional. Run without --voice flag or install additional audio dependencies
```

**4. Import errors:**
```
Solution: Ensure you're in the correct directory and virtual environment is activated
```

**5. Slow first responses:**
```
Solution: First run downloads models. Subsequent runs are faster. Use caching for repeated queries.
```

## 📊 Performance Notes

- **First Run**: 2-5 minutes (model downloads)
- **Startup Time**: 30-60 seconds (loading models)
- **Response Time**: 
  - Intent detection: <100ms
  - Calculations: <10ms
  - Weather: <1s (API call)
  - Conversation: 1-3s
  - Summarization: 3-10s (depending on document size)

## 🔒 Privacy & Security

- All data stored locally in SQLite database
- No data sent to external services except:
  - Weather API (OpenWeatherMap)
  - Model downloads (Hugging Face)
  - Speech recognition (Google Speech API, optional)
- API keys stored locally in `config/api_keys.py`

## 🤝 Contributing

To extend the assistant:

1. Add new intent patterns in `core/intent_analyzer.py`
2. Create new module in `modules/` directory
3. Add handler method in `main.py`
4. Update help text and README

## 📝 License

This project is for educational purposes.

## 🎯 Future Enhancements

- [ ] Web interface (Flask/FastAPI)
- [ ] Multi-user support
- [ ] Cloud synchronization
- [ ] Mobile app integration
- [ ] Custom wake word
- [ ] Integration with learning management systems
- [ ] Study session timer
- [ ] Note-taking capabilities
- [ ] Flashcard generation

## 📧 Support

For issues or questions, please check:
1. This README
2. Code comments in individual modules
3. Python logs in console output

---

**Made with ❤️ for LCPS Students**

*Version 1.0.0 - MVP Release*
