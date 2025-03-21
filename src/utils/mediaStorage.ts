// src/utils/mediaStorage.ts
export const storeLocalMedia = async (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], {
        type: file.type,
      });
      const url = URL.createObjectURL(blob);

      // Store in IndexedDB for persistence
      saveToIndexedDB(file.name, blob).then(() => resolve(url));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const loadLocalMedia = async (fileName: string) => {
  const blob = await getFromIndexedDB(fileName);
  return blob ? URL.createObjectURL(blob) : null;
};

// IndexedDB operations
const DB_NAME = "FlowBuilderDB";
const STORE_NAME = "media";

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(STORE_NAME);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToIndexedDB = async (key: string, blob: Blob) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(blob, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
};

const getFromIndexedDB = async (key: string) => {
  const db = await openDB();
  return new Promise<Blob | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
};
