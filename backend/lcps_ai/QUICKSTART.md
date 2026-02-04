# 🚀 Quick Start Guide

Get started with LCPS AI Assistant in 5 minutes!

## Step 1: Installation

Run the setup script:
```powershell
.\setup.ps1
```

Or manually:
```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Test the System

Run the test suite to verify everything works:
```powershell
python test_assistant.py
```

This will test:
- ✓ Module imports
- ✓ Database operations
- ✓ Calculator functionality
- ✓ Intent detection (NLP)
- ✓ Cache system
- ✓ AI conversation engine

## Step 3: Start the Assistant

```powershell
python main.py
```

## Step 4: Try These Commands

Once the assistant starts, try:

### 1. Test Conversation (AI Engine)
```
You: Hello! How are you today?
```
Should get a natural conversational response from DialoGPT.

### 2. Test Intent Detection
```
You: Calculate 25 + 17
```
Should detect 'calculate' intent and return: 📊 Result: 42

### 3. Test Calculator
```
You: What is 15 * 3 + 7?
You: Calculate 2^8
You: What is 20% of 500?
```

### 4. Test Task Management
```
You: Show tasks
You: Add task: Complete Python project
```

### 5. Test Schedule
```
You: What's my schedule?
You: Today's schedule
```

### 6. Test Deadlines
```
You: Show deadlines
```

### 7. Test Weather (needs API key)
```
You: What's the weather in London?
```

### 8. Test YouTube
```
You: Search YouTube for AI tutorials
You: Open YouTube
```

### 9. Test Joke Generator
```
You: Tell me a joke
```

### 10. Test Help
```
You: help
```

## Verifying AI Components

### ✅ AI Engine (DialoGPT)
When you type "Hello!", the response should be conversational and contextual, not robotic. Example:
```
You: Hello!
Assistant: Hello! I'm doing great, thanks for asking. How can I help you today?
```

### ✅ Intent Analyzer (Sentence Transformers)
The system should correctly identify what you want:
- "What's the weather?" → Detects 'weather' intent
- "Calculate 5+3" → Detects 'calculate' intent
- "Show my tasks" → Detects 'task' intent

Check the console logs to see detected intents.

### ✅ Context Awareness
Try a multi-turn conversation:
```
You: Hello!
Assistant: [greeting response]
You: What's 5 plus 3?
Assistant: [calculation result]
You: Now multiply that by 2
Assistant: [should remember previous result]
```

## Performance Expectations

### First Run
- **Model Downloads**: 2-5 minutes (1-2 GB)
- **Startup**: 60 seconds
- **First Response**: 3-5 seconds

### Subsequent Runs
- **Startup**: 30 seconds
- **Response**: 1-2 seconds
- **Calculations**: <100ms
- **Cached Queries**: <50ms

## Common Issues & Solutions

### Issue: Models Not Downloading
**Solution**: Check internet connection. Models are downloaded from Hugging Face.

### Issue: Slow Responses
**Solution**: First run downloads models. Subsequent runs are faster.

### Issue: "Module not found"
**Solution**: Make sure virtual environment is activated:
```powershell
.\venv\Scripts\Activate.ps1
```

### Issue: PyAudio Error
**Solution**: Voice features are optional. Run without `--voice` flag:
```powershell
python main.py
```

## Testing MVP Features

### Core Features Checklist
- [ ] Conversational AI responds naturally
- [ ] Intent detection works accurately
- [ ] Calculator performs math correctly
- [ ] Tasks can be added and listed
- [ ] Database persists data
- [ ] Cache speeds up repeated queries
- [ ] Help command shows all features

### Advanced Features (Optional)
- [ ] Weather API works (requires API key)
- [ ] Document summarization (requires PDF/DOCX files)
- [ ] Voice input/output (requires PyAudio)

## Next Steps

1. **Configure API Keys** (optional):
   - Set `OPENWEATHER_API_KEY` environment variable for weather

2. **Explore Features**:
   - Try different intents
   - Test conversation context
   - Add tasks and schedules

3. **Check Logs**:
   - Look for "Detected intent:" in console
   - Verify models loaded correctly

4. **Test Edge Cases**:
   - Try ambiguous queries
   - Test very long conversations
   - Try complex calculations

## Demo Script

For a quick demo, copy-paste these one by one:

```
Hello! How are you?
Calculate 25 * 4 + 10
Tell me a joke
What's my schedule?
Show tasks
help
quit
```

## Verification Complete ✓

Your LCPS AI Assistant is ready when:
- ✓ Test suite passes
- ✓ AI Engine loads (DialoGPT-medium)
- ✓ Intent analyzer loads (all-MiniLM-L6-v2)
- ✓ Conversation responses are natural
- ✓ Intent detection is accurate
- ✓ All features respond correctly

---

**Need Help?** Check `README.md` for full documentation.
