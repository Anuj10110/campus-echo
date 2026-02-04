"""
Cache management for fast access to repeated actions
"""
import hashlib
from diskcache import Cache
import config.settings as settings


class CacheManager:
    """Disk cache manager for responses and repeated actions"""
    
    def __init__(self):
        self.cache = Cache(
            str(settings.CACHE_DIR),
            size_limit=settings.CACHE_SIZE_LIMIT
        )
    
    def generate_key(self, query: str) -> str:
        """Generate a hash key for a query"""
        return hashlib.md5(query.lower().strip().encode()).hexdigest()
    
    def get(self, query: str):
        """Get cached response for a query"""
        key = self.generate_key(query)
        return self.cache.get(key)
    
    def set(self, query: str, response: str, ttl: int = None):
        """Cache a response"""
        key = self.generate_key(query)
        expire = ttl or settings.CACHE_TTL
        self.cache.set(key, response, expire=expire)
    
    def delete(self, query: str):
        """Delete a cached response"""
        key = self.generate_key(query)
        self.cache.delete(key)
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()
    
    def get_stats(self):
        """Get cache statistics"""
        return {
            'size': self.cache.volume(),
            'count': len(self.cache)
        }
