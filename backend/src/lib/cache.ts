import NodeCache from "node-cache";

// TTL por defecto: 60s. checkperiod: limpieza cada 30s.
const cache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== undefined) {
    console.log(`[CACHE HIT] ${key}`);
    return cached;
  }
  console.log(`[CACHE MISS] ${key}`);
  const fresh = await fetcher();
  cache.set(key, fresh, ttlSeconds);
  return fresh;
}

export function invalidateCache(key: string) {
  cache.del(key);
  console.log(`[CACHE INVALIDADO] ${key}`);
}

export function invalidateCacheByPrefix(prefix: string) {
  const keys = cache.keys().filter((k) => k.startsWith(prefix));
  cache.del(keys);
}