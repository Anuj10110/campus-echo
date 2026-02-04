"""
Task and Reminder Manager
"""
from typing import List, Dict
from storage import Database
from utils.helpers import parse_date, calculate_priority_score
from utils.logger import logger


class TaskManager:
    """Manage tasks and reminders"""
    
    def __init__(self, db: Database):
        self.db = db
    
    def add_task(self, title: str, description: str = "", priority: str = "medium", due_date: str = None) -> int:
        """
        Add a new task
        
        Args:
            title: Task title
            description: Task description
            priority: Priority (low, medium, high)
            due_date: Due date (optional)
        
        Returns:
            Task ID
        """
        try:
            # Parse date if provided
            if due_date:
                due_date = parse_date(due_date)
            
            task_id = self.db.add_task(title, description, priority.lower(), due_date)
            logger.info(f"Added task: {title} (priority: {priority})")
            return task_id
        except Exception as e:
            logger.error(f"Error adding task: {e}")
            return -1
    
    def get_tasks(self, completed: bool = False) -> List[Dict]:
        """Get tasks"""
        return self.db.get_tasks(completed=completed)
    
    def get_priority_tasks(self) -> List[Dict]:
        """Get tasks sorted by priority and due date"""
        tasks = self.db.get_tasks(completed=False)
        
        # Calculate priority scores and sort
        scored_tasks = []
        for task in tasks:
            score = calculate_priority_score(task['priority'], task['due_date'])
            scored_tasks.append((score, task))
        
        scored_tasks.sort(reverse=True, key=lambda x: x[0])
        return [task for score, task in scored_tasks]
    
    def complete_task(self, task_id: int):
        """Mark task as completed"""
        try:
            self.db.complete_task(task_id)
            logger.info(f"Completed task ID: {task_id}")
        except Exception as e:
            logger.error(f"Error completing task: {e}")
    
    def delete_task(self, task_id: int):
        """Delete a task"""
        try:
            self.db.delete_task(task_id)
            logger.info(f"Deleted task ID: {task_id}")
        except Exception as e:
            logger.error(f"Error deleting task: {e}")
    
    def format_tasks(self, tasks: List[Dict]) -> str:
        """Format tasks for display"""
        if not tasks:
            return "No tasks found."
        
        output = "📝 Tasks:\n" + "="*50 + "\n"
        
        for task in tasks:
            status = "✅" if task['completed'] else "⬜"
            priority_emoji = {
                'high': '🔴',
                'medium': '🟡',
                'low': '🟢'
            }.get(task['priority'], '⚪')
            
            output += f"{status} {priority_emoji} {task['title']}"
            if task['due_date']:
                output += f" - Due: {task['due_date']}"
            if task['description']:
                output += f"\n   {task['description']}"
            output += "\n"
        
        return output
