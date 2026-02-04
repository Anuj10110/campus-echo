"""
Schedule/Timetable Manager
"""
from typing import List, Dict, Optional
from storage import Database
from utils.helpers import parse_time, get_day_of_week
from utils.logger import logger


class ScheduleManager:
    """Manage timetable and schedules"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def add_class(self, day: str, time: str, subject: str, location: str = "", notes: str = "") -> int:
        """Add a class to timetable"""
        try:
            # Parse time
            parsed_time = parse_time(time)
            day = day.capitalize()
            
            class_id = self.db.add_timetable_entry(day, parsed_time, subject, location, notes)
            logger.info(f"Added class: {subject} on {day} at {parsed_time}")
            return class_id
        except Exception as e:
            logger.error(f"Error adding class: {e}")
            return -1
    
    def get_today_schedule(self) -> List[Dict]:
        """Get today's schedule"""
        today = get_day_of_week()
        return self.db.get_timetable(day=today)
    
    def get_schedule(self, day: str = None) -> List[Dict]:
        """Get schedule for a specific day or all"""
        return self.db.get_timetable(day=day.capitalize() if day else None)
    
    def delete_class(self, class_id: int):
        """Delete a class from timetable"""
        try:
            self.db.delete_timetable_entry(class_id)
            logger.info(f"Deleted class with ID: {class_id}")
        except Exception as e:
            logger.error(f"Error deleting class: {e}")
    
    def format_schedule(self, schedule: List[Dict]) -> str:
        """Format schedule for display"""
        if not schedule:
            return "No classes scheduled."
        
        output = "📅 Schedule:\n" + "="*50 + "\n"
        
        current_day = None
        for entry in schedule:
            if entry['day'] != current_day:
                current_day = entry['day']
                output += f"\n{current_day}:\n"
            
            output += f"  {entry['time']} - {entry['subject']}"
            if entry['location']:
                output += f" @ {entry['location']}"
            if entry['notes']:
                output += f" ({entry['notes']})"
            output += "\n"
        
        return output
