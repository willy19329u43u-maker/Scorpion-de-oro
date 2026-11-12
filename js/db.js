/* ==================== BASE DE DATOS LOCAL (IndexedDB) ==================== */
/* IndexedDB es una base de datos NoSQL que vive dentro del navegador.
   Guarda el estado del club (partidos, cronograma, puntuación, etc.)
   de forma persistente sin necesidad de servidor propio. */

const DB_NAME = 'escorpion_db';
const STORE_NAME = 'app_state';
const DB_VERSION = 1;
const FALLBACK_KEY = 'escorpion_app_v1'; // localStorage como respaldo

let dbPromise = null;

function estaDisponibleIndexedDB() {
  return typeof indexedDB !== 'undefined';
}

function abrirDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
  return dbPromise;
}

/* Guarda el estado completo de la app */
async function dbSave(estado) {
  if (!estaDisponibleIndexedDB()) {
    try {
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(estado));
      return;
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
    return;
  }

  try {
    const db = await abrirDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        id: 'estado_principal',
        data: estado,
        updatedAt: Date.now()
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB falló, usando localStorage:', e);
    try {
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(estado));
    } catch (err) {
      console.warn('No se pudo guardar en localStorage:', err);
    }
  }
}

/* Carga el estado guardado. Devuelve null si no hay nada previo. */
async function dbLoad() {
  if (!estaDisponibleIndexedDB()) {
    try {
      const raw = localStorage.getItem(FALLBACK_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  try {
    const db = await abrirDB();
    const resultado = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('estado_principal');
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => reject(req.error);
    });
    return resultado;
  } catch (e) {
    console.warn('IndexedDB falló al leer, intentando localStorage:', e);
    try {
      const raw = localStorage.getItem(FALLBACK_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }
}

/* Exportación simple para uso en el archivo principal */
window.escDb = { save: dbSave, load: dbLoad };
