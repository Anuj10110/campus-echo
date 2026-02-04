"""
Deadline Tracker for exams, fees, library returns, etc.
"""
from typing import List, Dict
from storage import Database
from utils.helpers import parse_date, is_date_approaching
from utils.logger import logger


class DeadlineTracker:
    """Track important deadlines"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def add_deadline(self, deadline_type: str, title: str, due_date: str, description: str = "") -> int:
        """
        Add a new deadline
        
        Args:
            deadline_type: Type (exam, fee, library, assignment, etc.)
            title: Deadline title
            due_date: Due date (YYYY-MM-DD or other formats)
            description: Additional description
        
        Returns:
            Deadline ID
        """
        try:
            # Parse date
            parsed_date = parse_date(due_date)
            
            deadline_id = self.db.add_deadline(deadline_type, title, parsed_date, description)
            logger.info(f"Added deadline: {title} ({deadline_type}) on {parsed_date}")
            return deadline_id
        except Exception as e:
            logger.error(f"Error adding deadline: {e}")
            return -1
    
    def get_deadlines(self, completed: bool = False, deadline_type: str = None) -> List[Dict]:
        """Get deadlines"""
        deadlines = self.db.get_deadlines(completed=completed)
        
        if deadline_type:
            deadlines = [d for d in deadlines if d['type'].lower() == deadline_type.lower()]
        
        return deadlines
    
    def get_upcoming_deadlines(self, days: int = 7) -> List[Dict]:
        """Get deadlines approaching within specified days"""
        deadlines = self.db.get_deadlines(completed=False)
        upcoming = [d for d in deadlines if is_date_approaching(d['due_date'], days)]
        return upcoming
    
    def complete_deadline(self, deadline_id: int):
        """Mark deadline as completed"""
        try:
            self.db.complete_deadline(deadline_id)
            logger.info(f"Completed deadline ID: {deadline_id}")
        except Exception as e:
            logger.error(f"Error completing deadline: {e}")
    
    def delete_deadline(self, deadline_id: int):
        """Delete a deadline"""
        try:
            self.db.delete_deadline(deadline_id)
            logger.info(f"Deleted deadline ID: {deadline_id}")
        except Exception as e:
            logger.error(f"Error deleting deadline: {e}")
    
    def format_deadlines(self, deadlines: List[Dict]) -> str:
        """Format deadlines for display"""
        if not deadlines:
            return "No deadlines found."
        
        output = "⏰ Deadlines:\n" + "="*50 + "\n"
        
        # Group by type
        by_type = {}
        for deadline in deadlines:
            dtype = deadline['type']
            if dtype not in by_type:
                by_type[dtype] = []
            by_type[dtype].append(deadline)
        
        for dtype, items in by_type.items():
            output += f"\n{dtype.upper()}:\n"
            for item in items:
                status = "✅" if item['completed'] else "⏳"
                output += f"  {status} {item['title']} - Due: {item['due_date']}"
                if item['description']:
                    output += f" ({item['description']})"
                output += "\n"
        
        return output
