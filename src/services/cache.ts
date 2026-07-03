import localforage from 'localforage';
import { NormalizedTask } from '@/types/domain';

localforage.config({
  name: 'ActivityConsoleCache',
  storeName: 'tasks_cache',
});

const CACHE_VERSION = 1;
const TTL = 3600000; // 1 hour in ms

export interface CachePageData {
  tasks: NormalizedTask[];
  total: number;
  cachedAt: number;
  version: number;
}

export async function getCachedTasksPage(page: number): Promise<CachePageData | null> {
  try {
    const data = await localforage.getItem<CachePageData>(`tasks_page_${page}`);
    if (!data) return null;

    // 1. Verify schema version compatibility
    if (data.version !== CACHE_VERSION) {
      console.log(`[Cache] Schema version mismatch (stored: ${data.version}, current: ${CACHE_VERSION}). Clearing cache...`);
      await localforage.clear();
      return null;
    }

    // 2. Verify Time-to-Live (TTL) expiration
    if (Date.now() - data.cachedAt > TTL) {
      console.log(`[Cache] Cached tasks for page ${page} have expired (TTL exceeded).`);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`[Cache] Error reading tasks page ${page} from IndexedDB:`, err);
    return null;
  }
}

export async function setCachedTasksPage(page: number, data: { tasks: NormalizedTask[]; total: number }): Promise<void> {
  try {
    const cacheData: CachePageData = {
      tasks: data.tasks,
      total: data.total,
      cachedAt: Date.now(),
      version: CACHE_VERSION,
    };
    await localforage.setItem(`tasks_page_${page}`, cacheData);
  } catch (err) {
    console.error(`[Cache] Error writing tasks page ${page} to IndexedDB:`, err);
  }
}

export async function clearTasksCache(): Promise<void> {
  try {
    await localforage.clear();
    console.log('[Cache] IndexedDB cache cleared.');
  } catch (err) {
    console.error('[Cache] Error clearing IndexedDB cache:', err);
  }
}
