"""
YouTube Handler for opening and searching YouTube
"""
import os
import webbrowser
import urllib.parse
from utils.logger import logger


def _is_headless() -> bool:
    return os.environ.get('LCPS_AI_HEADLESS', '0') in ['1', 'true', 'True']


class YouTubeHandler:
    """Handle YouTube operations"""
    
    @staticmethod
    def open_youtube():
        """Open YouTube homepage.

        In headless mode, returns the URL without opening a browser.
        """
        url = "https://www.youtube.com"
        try:
            if not _is_headless():
                webbrowser.open(url)
                logger.info("Opened YouTube")
            return url
        except Exception as e:
            logger.error(f"Error opening YouTube: {e}")
            return url
    
    @staticmethod
    def search_youtube(query: str):
        """Search YouTube for a query.

        In headless mode, returns the URL without opening a browser.
        """
        # Encode query for URL
        encoded_query = urllib.parse.quote(query)
        url = f"https://www.youtube.com/results?search_query={encoded_query}"

        try:
            if not _is_headless():
                webbrowser.open(url)
                logger.info(f"Searching YouTube for: {query}")
            return url
        except Exception as e:
            logger.error(f"Error searching YouTube: {e}")
            return url
    
    @staticmethod
    def open_video(video_id: str):
        """Open a specific YouTube video.

        In headless mode, returns the URL without opening a browser.
        """
        url = f"https://www.youtube.com/watch?v={video_id}"
        try:
            if not _is_headless():
                webbrowser.open(url)
                logger.info(f"Opening YouTube video: {video_id}")
            return url
        except Exception as e:
            logger.error(f"Error opening YouTube video: {e}")
            return url
    
    @staticmethod
    def open_channel(channel_name: str):
        """Search for and open a YouTube channel.

        In headless mode, returns the URL without opening a browser.
        """
        # Search for the channel
        encoded_name = urllib.parse.quote(f"{channel_name} channel")
        url = f"https://www.youtube.com/results?search_query={encoded_name}"

        try:
            if not _is_headless():
                webbrowser.open(url)
                logger.info(f"Searching for YouTube channel: {channel_name}")
            return url
        except Exception as e:
            logger.error(f"Error opening YouTube channel: {e}")
            return url
