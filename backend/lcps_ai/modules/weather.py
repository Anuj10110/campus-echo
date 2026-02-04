"""
Weather module for fetching weather information
"""
import requests
from typing import Optional, Dict
import config.settings as settings
from config import api_keys
from utils.logger import logger


class Weather:
    """Fetch weather information"""
    
    def __init__(self):
        self.api_key = api_keys.OPENWEATHER_API_KEY
        self.base_url = settings.WEATHER_API_BASE_URL
    
    def get_weather(self, city: str) -> Optional[Dict]:
        """
        Get current weather for a city
        
        Args:
            city: City name
        
        Returns:
            Weather information dictionary or None if failed
        """
        if not self.api_key:
            logger.error("Weather API key not configured")
            return None
        
        try:
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'  # Celsius
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Parse weather data
            weather_info = {
                'city': data['name'],
                'country': data['sys']['country'],
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'],
                'wind_speed': data['wind']['speed'],
                'icon': data['weather'][0]['icon']
            }
            
            return weather_info
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Weather API request failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Error parsing weather data: {e}")
            return None
    
    def format_weather_response(self, weather_info: Dict) -> str:
        """Format weather information as a readable string"""
        if not weather_info:
            return "Unable to fetch weather information. Please check your API key and internet connection."
        
        return f"""Weather in {weather_info['city']}, {weather_info['country']}:
🌡️  Temperature: {weather_info['temperature']}°C (feels like {weather_info['feels_like']}°C)
🌤️  Conditions: {weather_info['description'].capitalize()}
💧 Humidity: {weather_info['humidity']}%
🌬️  Wind Speed: {weather_info['wind_speed']} m/s
🔽 Pressure: {weather_info['pressure']} hPa"""
