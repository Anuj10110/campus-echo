"""
Calculator module for mathematical operations
"""
import re
from typing import Optional
from utils.logger import logger


class Calculator:
    """Perform mathematical calculations"""
    
    @staticmethod
    def calculate(expression: str) -> Optional[float]:
        """
        Evaluate a mathematical expression
        
        Args:
            expression: Mathematical expression as string
        
        Returns:
            Result as float or None if invalid
        """
        try:
            # Clean the expression
            expression = expression.lower().strip()
            
            # Remove common words
            expression = re.sub(r'\b(what is|calculate|compute|solve)\b', '', expression, flags=re.IGNORECASE)
            
            # Replace common operations
            replacements = {
                'plus': '+',
                'minus': '-',
                'times': '*',
                'multiply': '*',
                'multiplied by': '*',
                'divided by': '/',
                'divide': '/',
                'power': '**',
                'squared': '**2',
                'cubed': '**3'
            }
            
            for word, symbol in replacements.items():
                expression = expression.replace(word, symbol)
            
            # Remove extra spaces
            expression = re.sub(r'\s+', '', expression)
            
            # Validate expression (only allow safe characters)
            if not re.match(r'^[\d\+\-\*/\(\)\.\s\*]+$', expression):
                return None
            
            # Evaluate safely
            result = eval(expression)
            return float(result)
            
        except Exception as e:
            logger.error(f"Calculation error: {e}")
            return None
    
    @staticmethod
    def add(a: float, b: float) -> float:
        """Addition"""
        return a + b
    
    @staticmethod
    def subtract(a: float, b: float) -> float:
        """Subtraction"""
        return a - b
    
    @staticmethod
    def multiply(a: float, b: float) -> float:
        """Multiplication"""
        return a * b
    
    @staticmethod
    def divide(a: float, b: float) -> Optional[float]:
        """Division"""
        try:
            return a / b
        except ZeroDivisionError:
            logger.error("Division by zero")
            return None
    
    @staticmethod
    def average(numbers: list) -> Optional[float]:
        """Calculate average"""
        try:
            if not numbers:
                return None
            return sum(numbers) / len(numbers)
        except Exception as e:
            logger.error(f"Average calculation error: {e}")
            return None
    
    @staticmethod
    def percentage(value: float, total: float) -> Optional[float]:
        """Calculate percentage"""
        try:
            return (value / total) * 100
        except ZeroDivisionError:
            return None
    
    @staticmethod
    def power(base: float, exponent: float) -> float:
        """Calculate power"""
        return base ** exponent
