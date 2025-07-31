// redisClient.js
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  // optional: tune retries/backoff if needed
  maxRetriesPerRequest: null,
  enableOfflineQueue: true,
});

redis.on('error', (e) => {
  console.error('Redis connection error:', e);
});
redis.on('connect', () => {
  console.log('Connected to Redis');
});

/**
 * Set a key with JSON value and optional TTL in seconds.
 */
export const setJSON = async (key, value, ttlSeconds = null) => {
  const str = JSON.stringify(value);
  if (ttlSeconds) {
    await redis.set(key, str, 'EX', ttlSeconds);
  } else {
    await redis.set(key, str);
  }
};

/**
 * Get and parse JSON value. Returns null if missing or parse fails.
 */
export const getJSON = async (key) => {
  const val = await redis.get(key);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch (e) {
    console.warn('Failed to parse JSON from redis for key', key, e);
    return null;
  }
};

export const del = async (key) => {
  await redis.del(key);
};

/**
 * Invalidate keys matching a pattern using SCAN (non-blocking).
 * Example pattern: 'products:list:*'
 */
export const invalidatePattern = async (pattern) => {
  const stream = redis.scanStream({
    match: pattern,
    count: 100,
  });
  const pipeline = redis.pipeline();
  let found = false;
  return new Promise((resolve, reject) => {
    stream.on('data', (keys = []) => {
      if (keys.length) {
        found = true;
        keys.forEach((k) => pipeline.del(k));
      }
    });
    stream.on('end', async () => {
      if (found) {
        await pipeline.exec();
      }
      resolve();
    });
    stream.on('error', (e) => {
      reject(e);
    });
  });
};

/**
 * Helper to generate a deterministic cache key for list queries,
 * sorting object keys so equivalent queries map to same key.
 */
export const makeListKey = (base, obj) => {
  const canonicalize = (o) => {
    if (o && typeof o === 'object' && !Array.isArray(o)) {
      return Object.keys(o)
        .sort()
        .reduce((acc, k) => {
          acc[k] = canonicalize(o[k]);
          return acc;
        }, {});
    } else if (Array.isArray(o)) {
      return o.map(canonicalize);
    } else {
      return o;
    }
  };
  const serialized = JSON.stringify(canonicalize(obj));
  return `${base}:${serialized}`;
};

export default redis;
