import { useState, useCallback, useEffect } from 'react';

const DB_NAME = 'herbiverse-offline';
const DB_VERSION = 1;
const PLANTS_STORE = 'plants';
const RECIPES_STORE = 'recipes';
const TIPS_STORE = 'tips';
const META_STORE = 'metadata';

interface OfflineStatus {
  isOnline: boolean;
  lastSynced: Date | null;
  plantsCount: number;
  recipesCount: number;
  tipsCount: number;
  storageUsed: string;
}

export function useOfflineStorage() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    lastSynced: null,
    plantsCount: 0,
    recipesCount: 0,
    tipsCount: 0,
    storageUsed: '0 KB'
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Initialize IndexedDB
  useEffect(() => {
    const openDB = () => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => console.error('Failed to open offline database');

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        
        if (!database.objectStoreNames.contains(PLANTS_STORE)) {
          database.createObjectStore(PLANTS_STORE, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(RECIPES_STORE)) {
          database.createObjectStore(RECIPES_STORE, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(TIPS_STORE)) {
          database.createObjectStore(TIPS_STORE, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(META_STORE)) {
          database.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        setDb(database);
        updateStatus(database);
      };
    };

    openDB();

    // Listen for online/offline events
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateStatus = useCallback(async (database: IDBDatabase) => {
    const transaction = database.transaction([PLANTS_STORE, RECIPES_STORE, TIPS_STORE, META_STORE], 'readonly');
    
    const plantsCount = await new Promise<number>((resolve) => {
      const request = transaction.objectStore(PLANTS_STORE).count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(0);
    });

    const recipesCount = await new Promise<number>((resolve) => {
      const request = transaction.objectStore(RECIPES_STORE).count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(0);
    });

    const tipsCount = await new Promise<number>((resolve) => {
      const request = transaction.objectStore(TIPS_STORE).count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(0);
    });

    const lastSynced = await new Promise<Date | null>((resolve) => {
      const request = transaction.objectStore(META_STORE).get('lastSynced');
      request.onsuccess = () => resolve(request.result?.value ? new Date(request.result.value) : null);
      request.onerror = () => resolve(null);
    });

    // Estimate storage
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const usedFormatted = used < 1024 * 1024 
        ? `${(used / 1024).toFixed(1)} KB`
        : `${(used / (1024 * 1024)).toFixed(1)} MB`;
      
      setStatus(prev => ({
        ...prev,
        lastSynced,
        plantsCount,
        recipesCount,
        tipsCount,
        storageUsed: usedFormatted
      }));
    } else {
      setStatus(prev => ({
        ...prev,
        lastSynced,
        plantsCount,
        recipesCount,
        tipsCount
      }));
    }
  }, []);

  const downloadData = useCallback(async () => {
    if (!db) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Import data from local data files
      const { seasonalPlants } = await import('@/data/seasonalCalendarData');
      const { herbalRecipes } = await import('@/data/herbalRecipesData');
      const { wellnessTips } = await import('@/data/wellnessTipsData');
      const { dosageDatabase } = await import('@/data/dosageData');

      const totalItems = seasonalPlants.length + herbalRecipes.length + wellnessTips.length + dosageDatabase.length;
      let completed = 0;

      // Store plants
      const plantsTransaction = db.transaction(PLANTS_STORE, 'readwrite');
      const plantsStore = plantsTransaction.objectStore(PLANTS_STORE);
      
      for (const plant of seasonalPlants) {
        plantsStore.put(plant);
        completed++;
        setDownloadProgress(Math.round((completed / totalItems) * 100));
      }

      // Store dosage info with plants
      for (const dosage of dosageDatabase) {
        plantsStore.put({ id: `dosage-${dosage.herbId}`, ...dosage });
        completed++;
        setDownloadProgress(Math.round((completed / totalItems) * 100));
      }

      // Store recipes
      const recipesTransaction = db.transaction(RECIPES_STORE, 'readwrite');
      const recipesStore = recipesTransaction.objectStore(RECIPES_STORE);
      
      for (const recipe of herbalRecipes) {
        recipesStore.put(recipe);
        completed++;
        setDownloadProgress(Math.round((completed / totalItems) * 100));
      }

      // Store tips
      const tipsTransaction = db.transaction(TIPS_STORE, 'readwrite');
      const tipsStore = tipsTransaction.objectStore(TIPS_STORE);
      
      for (const tip of wellnessTips) {
        tipsStore.put(tip);
        completed++;
        setDownloadProgress(Math.round((completed / totalItems) * 100));
      }

      // Update last synced timestamp
      const metaTransaction = db.transaction(META_STORE, 'readwrite');
      metaTransaction.objectStore(META_STORE).put({ key: 'lastSynced', value: new Date().toISOString() });

      await updateStatus(db);
      setDownloadProgress(100);
    } catch (error) {
      console.error('Failed to download offline data:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [db, updateStatus]);

  const clearOfflineData = useCallback(async () => {
    if (!db) return;

    const transaction = db.transaction([PLANTS_STORE, RECIPES_STORE, TIPS_STORE, META_STORE], 'readwrite');
    transaction.objectStore(PLANTS_STORE).clear();
    transaction.objectStore(RECIPES_STORE).clear();
    transaction.objectStore(TIPS_STORE).clear();
    transaction.objectStore(META_STORE).clear();

    await updateStatus(db);
  }, [db, updateStatus]);

  const getOfflinePlants = useCallback(async () => {
    if (!db) return [];

    return new Promise<any[]>((resolve) => {
      const transaction = db.transaction(PLANTS_STORE, 'readonly');
      const request = transaction.objectStore(PLANTS_STORE).getAll();
      request.onsuccess = () => resolve(request.result.filter(item => !item.id.startsWith('dosage-')));
      request.onerror = () => resolve([]);
    });
  }, [db]);

  const getOfflineRecipes = useCallback(async () => {
    if (!db) return [];

    return new Promise<any[]>((resolve) => {
      const transaction = db.transaction(RECIPES_STORE, 'readonly');
      const request = transaction.objectStore(RECIPES_STORE).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  }, [db]);

  const getOfflineTips = useCallback(async () => {
    if (!db) return [];

    return new Promise<any[]>((resolve) => {
      const transaction = db.transaction(TIPS_STORE, 'readonly');
      const request = transaction.objectStore(TIPS_STORE).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  }, [db]);

  return {
    status,
    isDownloading,
    downloadProgress,
    downloadData,
    clearOfflineData,
    getOfflinePlants,
    getOfflineRecipes,
    getOfflineTips
  };
}
