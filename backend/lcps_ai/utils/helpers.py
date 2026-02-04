"""
Helper utilities for the AI Assistant
"""
from datetime import datetime, timedelta
from typing import Dict, List
import re


def parse_date(date_str: str) -> str:
    """Parse various date formats to ISO format"""
    # Common date patterns
    patterns = {
        r'(\d{1,2})/(\d{1,2})/(\d{4})': '%m/%d/%Y',
        r'(\d{4})-(\d{1,2})-(\d{1,2})': '%Y-%m-%d',
        r'(\d{1,2})-(\d{1,2})-(\d{4})': '%d-%m-%Y',
    }
    
    for pattern, date_format in patterns.items():
        if re.match(pattern, date_str):
            try:
                dt = datetime.strptime(date_str, date_format)
                return dt.strftime('%Y-%m-%d')
            except ValueError:
                continue
    
    return date_str


def parse_time(time_str: str) -> str:
    """Parse various time formats to HH:MM format"""
    # Remove spaces and convert to lowercase
    time_str = time_str.lower().strip()
    
    # Pattern for 12-hour format
    match = re.match(r'(\d{1,2}):?(\d{2})?\s*(am|pm)?', time_str)
    if match:
        hour, minute, period = match.groups()
        hour = int(hour)
        minute = int(minute) if minute else 0
        
        if period == 'pm' and hour != 12:
            hour += 12
        elif period == 'am' and hour == 12:
            hour = 0
        
        return f"{hour:02d}:{minute:02d}"
    
    return time_str


def get_day_of_week(date_str: str = None) -> str:
    """Get day of week from date string or current date"""
    if date_str:
        try:
            dt = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            dt = datetime.now()
    else:
        dt = datetime.now()
    
    return dt.strftime('%A')


def is_date_approaching(date_str: str, days: int = 7) -> bool:
    """Check if a date is within specified days"""
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d')
        today = datetime.now()
        diff = (target_date - today).days
        return 0 <= diff <= days
    except ValueError:
        return False


def format_duration(seconds: int) -> str:
    """Format seconds to human readable duration"""
    if seconds < 60:
        return f"{seconds}s"
    elif seconds < 3600:
        minutes = seconds // 60
        return f"{minutes}m"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        return f"{hours}h {minutes}m"


def clean_text(text: str) -> str:
    """Clean and normalize text"""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()


def extract_number(text: str) -> float:
    """Extract first number from text"""
    match = re.search(r'-?\d+\.?\d*', text)
    if match:
        return float(match.group())
    return 0.0


def calculate_priority_score(priority: str, due_date: str = None) -> int:
    """Calculate priority score for sorting"""
    priority_scores = {'high': 3, 'medium': 2, 'low': 1}
    score = priority_scores.get(priority.lower(), 2)
    
    if due_date:
        try:
            dt = datetime.strptime(due_date, '%Y-%m-%d')
            days_until = (dt - datetime.now()).days
            if days_until < 0:
                score += 10  # Overdue
            elif days_until <= 1:
                score += 5  # Due today or tomorrow
            elif days_until <= 7:
                score += 2  # Due this week
        except ValueError:
            pass
    
    return score
