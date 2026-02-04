"""
Database management for the AI Assistant
"""
import sqlite3
from datetime import datetime
from contextlib import contextmanager
from typing import List, Dict, Optional, Tuple
import config.settings as settings


class Database:
    """SQLite database manager"""
    
    def __init__(self, db_path=None):
        self.db_path = db_path or settings.DATABASE_PATH
        self._initialize_database()
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def _initialize_database(self):
        """Create all necessary tables"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Deadlines table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS deadlines (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    title TEXT NOT NULL,
                    due_date TEXT NOT NULL,
                    description TEXT,
                    completed INTEGER DEFAULT 0,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Timetable table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS timetable (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    day TEXT NOT NULL,
                    time TEXT NOT NULL,
                    subject TEXT NOT NULL,
                    location TEXT,
                    notes TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Tasks table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    priority TEXT DEFAULT 'medium',
                    due_date TEXT,
                    completed INTEGER DEFAULT 0,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Conversation history table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS conversation_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_input TEXT NOT NULL,
                    bot_response TEXT NOT NULL,
                    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Cache responses table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cache_responses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    query_hash TEXT UNIQUE NOT NULL,
                    response TEXT NOT NULL,
                    access_count INTEGER DEFAULT 1,
                    last_accessed TEXT DEFAULT CURRENT_TIMESTAMP,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
    
    # Deadline methods
    def add_deadline(self, type: str, title: str, due_date: str, description: str = "") -> int:
        """Add a new deadline"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO deadlines (type, title, due_date, description) VALUES (?, ?, ?, ?)",
                (type, title, due_date, description)
            )
            return cursor.lastrowid
    
    def get_deadlines(self, completed: bool = False) -> List[Dict]:
        """Get all deadlines"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM deadlines WHERE completed = ? ORDER BY due_date",
                (1 if completed else 0,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def complete_deadline(self, deadline_id: int):
        """Mark a deadline as completed"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE deadlines SET completed = 1 WHERE id = ?", (deadline_id,))
    
    def delete_deadline(self, deadline_id: int):
        """Delete a deadline"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM deadlines WHERE id = ?", (deadline_id,))
    
    # Timetable methods
    def add_timetable_entry(self, day: str, time: str, subject: str, location: str = "", notes: str = "") -> int:
        """Add a timetable entry"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO timetable (day, time, subject, location, notes) VALUES (?, ?, ?, ?, ?)",
                (day, time, subject, location, notes)
            )
            return cursor.lastrowid
    
    def get_timetable(self, day: Optional[str] = None) -> List[Dict]:
        """Get timetable entries"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if day:
                cursor.execute("SELECT * FROM timetable WHERE day = ? ORDER BY time", (day,))
            else:
                cursor.execute("SELECT * FROM timetable ORDER BY day, time")
            return [dict(row) for row in cursor.fetchall()]
    
    def delete_timetable_entry(self, entry_id: int):
        """Delete a timetable entry"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM timetable WHERE id = ?", (entry_id,))
    
    # Task methods
    def add_task(self, title: str, description: str = "", priority: str = "medium", due_date: str = None) -> int:
        """Add a new task"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)",
                (title, description, priority, due_date)
            )
            return cursor.lastrowid
    
    def get_tasks(self, completed: bool = False) -> List[Dict]:
        """Get all tasks"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM tasks WHERE completed = ? ORDER BY priority DESC, due_date",
                (1 if completed else 0,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def complete_task(self, task_id: int):
        """Mark a task as completed"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE tasks SET completed = 1 WHERE id = ?", (task_id,))
    
    def delete_task(self, task_id: int):
        """Delete a task"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    
    # Conversation history methods
    def add_conversation(self, user_input: str, bot_response: str):
        """Add conversation to history"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO conversation_history (user_input, bot_response) VALUES (?, ?)",
                (user_input, bot_response)
            )
    
    def get_recent_conversations(self, limit: int = 10) -> List[Dict]:
        """Get recent conversations"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM conversation_history ORDER BY timestamp DESC LIMIT ?",
                (limit,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    # Cache methods
    def get_cached_response(self, query_hash: str) -> Optional[str]:
        """Get cached response for a query"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT response FROM cache_responses WHERE query_hash = ?",
                (query_hash,)
            )
            row = cursor.fetchone()
            if row:
                # Update access count and last accessed time
                cursor.execute(
                    "UPDATE cache_responses SET access_count = access_count + 1, last_accessed = ? WHERE query_hash = ?",
                    (datetime.now().isoformat(), query_hash)
                )
                return row['response']
            return None
    
    def cache_response(self, query_hash: str, response: str):
        """Cache a response"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO cache_responses (query_hash, response) VALUES (?, ?)",
                (query_hash, response)
            )
