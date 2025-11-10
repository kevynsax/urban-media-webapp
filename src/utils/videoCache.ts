const DB_NAME = 'VideoKioskDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

interface CachedVideo {
  url: string;
  blob: Blob;
  timestamp: number;
}

class VideoCache {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        }
      };
    });
  }

  async getVideo(url: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as CachedVideo | undefined;
        resolve(result ? result.blob : null);
      };
    });
  }

  async saveVideo(url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const video: CachedVideo = {
        url,
        blob,
        timestamp: Date.now(),
      };

      const request = store.put(video);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async hasVideo(url: string): Promise<boolean> {
    const video = await this.getVideo(url);
    return video !== null;
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const videoCache = new VideoCache();

