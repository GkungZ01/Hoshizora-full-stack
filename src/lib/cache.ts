type CacheOptions = {
  maxAge?: number; // Time in seconds
  staleWhileRevalidate?: boolean;
};

const defaultCacheOptions: CacheOptions = {
  maxAge: 60, // 1 minute
  staleWhileRevalidate: true,
};

/**
 * Simple in-memory cache implementation
 */
class MemoryCache {
  private cache: Map<string, { data: any; timestamp: number }>;
  
  constructor() {
    this.cache = new Map();
  }
  
  /**
   * Set a value in the cache
   */
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
  
  /**
   * Get a value from the cache
   */
  get<T>(key: string, options: CacheOptions = defaultCacheOptions): T | null {
    const cachedItem = this.cache.get(key);
    
    if (!cachedItem) {
      return null;
    }
    
    const { maxAge = defaultCacheOptions.maxAge } = options;
    const ageInSeconds = (Date.now() - cachedItem.timestamp) / 1000;
    
    // If the cache item is expired and we're not allowing stale data
    if (maxAge && ageInSeconds > maxAge && !options.staleWhileRevalidate) {
      return null;
    }
    
    return cachedItem.data as T;
  }
  
  /**
   * Check if a value in the cache is stale
   */
  isStale(key: string, maxAge: number = defaultCacheOptions.maxAge || 0): boolean {
    const cachedItem = this.cache.get(key);
    
    if (!cachedItem) {
      return true;
    }
    
    const ageInSeconds = (Date.now() - cachedItem.timestamp) / 1000;
    return ageInSeconds > maxAge;
  }
  
  /**
   * Delete a value from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const memoryCache = new MemoryCache();

/**
 * Helper function to wrap a function with cache
 */
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = defaultCacheOptions
): Promise<T> {
  // Try to get from cache first
  const cachedData = memoryCache.get<T>(key, options);
  
  // If we have data and it's not stale, or we allow stale data, return it
  if (cachedData && (!options.staleWhileRevalidate || !memoryCache.isStale(key, options.maxAge))) {
    return cachedData;
  }
  
  // If we have stale data and staleWhileRevalidate is true, 
  // trigger a revalidation but still return the stale data
  if (cachedData && options.staleWhileRevalidate) {
    // Revalidate in the background
    fetchFn().then(freshData => {
      memoryCache.set(key, freshData);
    }).catch(err => {
      console.error('Error revalidating cache:', err);
    });
    
    return cachedData;
  }
  
  // Otherwise, fetch fresh data
  const freshData = await fetchFn();
  memoryCache.set(key, freshData);
  return freshData;
}