/* ==================== BASE DE DATOS LOCAL (IndexedDB) ==================== */
/* IndexedDB es una base de datos NoSQL que vive dentro del navegador.
   Guarda el estado del club, usuarios y sesiones de forma persistente. */

const DB_NAME = 'escorpion_db';
const STORE_STATE = 'app_state';
const STORE_USERS = 'users';
const STORE_SESSION = 'session';
const DB_VERSION = 2;
const FALLBACK_KEY = 'escorpion_app_v1';

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
      if (!db.objectStoreNames.contains(STORE_STATE)) {
        db.createObjectStore(STORE_STATE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_USERS)) {
        const store = db.createObjectStore(STORE_USERS, { keyPath: 'email' });
        store.createIndex('rol', 'rol', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_SESSION)) {
        db.createObjectStore(STORE_SESSION, { keyPath: 'id' });
      }
    };
  });
  return dbPromise;
}

/* ---------- Estado general de la app ---------- */
async function dbSave(estado) {
  if (!estaDisponibleIndexedDB()) {
    try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(estado)); } catch (e) { console.warn(e); }
    return;
  }
  try {
    const db = await abrirDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_STATE, 'readwrite');
      const store = tx.objectStore(STORE_STATE);
      const req = store.put({ id: 'estado_principal', data: estado, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB falló, usando localStorage:', e);
    try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(estado)); } catch (err) { console.warn(err); }
  }
}

async function dbLoad() {
  if (!estaDisponibleIndexedDB()) {
    try { const raw = localStorage.getItem(FALLBACK_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  try {
    const db = await abrirDB();
    const resultado = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_STATE, 'readonly');
      const store = tx.objectStore(STORE_STATE);
      const req = store.get('estado_principal');
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => reject(req.error);
    });
    return resultado;
  } catch (e) {
    console.warn('IndexedDB falló al leer:', e);
    try { const raw = localStorage.getItem(FALLBACK_KEY); return raw ? JSON.parse(raw) : null; } catch (err) { return null; }
  }
}

/* ---------- Usuarios ---------- */
async function dbGetUsers() {
  if (!estaDisponibleIndexedDB()) return [];
  try {
    const db = await abrirDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_USERS, 'readonly');
      const store = tx.objectStore(STORE_USERS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (e) { return []; }
}

async function dbSaveUser(usuario) {
  if (!estaDisponibleIndexedDB()) return;
  try {
    const db = await abrirDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_USERS, 'readwrite');
      const store = tx.objectStore(STORE_USERS);
      const req = store.put(usuario);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) { console.warn(e); }
}

async function dbGetUser(email) {
  if (!estaDisponibleIndexedDB()) return null;
  try {
    const db = await abrirDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_USERS, 'readonly');
      const store = tx.objectStore(STORE_USERS);
      const req = store.get(email);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) { return null; }
}

/* ---------- Sesión ---------- */
async function dbSetSession(usuario) {
  if (!estaDisponibleIndexedDB()) {
    try { localStorage.setItem('escorpion_session', JSON.stringify(usuario)); } catch (e) {}
    return;
  }
  try {
    const db = await abrirDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SESSION, 'readwrite');
      const store = tx.objectStore(STORE_SESSION);
      const req = store.put({ id: 'sesion_activa', usuario });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) { console.warn(e); }
}

async function dbGetSession() {
  if (!estaDisponibleIndexedDB()) {
    try { const raw = localStorage.getItem('escorpion_session'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  try {
    const db = await abrirDB();
    const resultado = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SESSION, 'readonly');
      const store = tx.objectStore(STORE_SESSION);
      const req = store.get('sesion_activa');
      req.onsuccess = () => resolve(req.result ? req.result.usuario : null);
      req.onerror = () => reject(req.error);
    });
    return resultado;
  } catch (e) { return null; }
}

async function dbClearSession() {
  if (!estaDisponibleIndexedDB()) { try { localStorage.removeItem('escorpion_session'); } catch (e) {} return; }
  try {
    const db = await abrirDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SESSION, 'readwrite');
      const store = tx.objectStore(STORE_SESSION);
      const req = store.delete('sesion_activa');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) { console.warn(e); }
}

/* ---------- Inicialización de usuarios por defecto ---------- */
async function dbInitDefaultUsers() {
  const existentes = await dbGetUsers();
  if (existentes.length > 0) return;

  const defaultUsers = [
    {
      username: 'coach',
      email: 'coach@escorpionoro.com',
      password: 'coach123',
      nombre: 'Mateo Rivas',
      rol: 'coach',
      foto: 'WhatsApp Image 2026-11-12 at 16.20.44 (3).jpeg',
      bio: 'Entrenador principal del club Escorpión de Oro.'
    },
    {
      username: 'miembro',
      email: 'jugador1@escorpionoro.com',
      password: 'miembro123',
      nombre: 'J. Navarro',
      rol: 'miembro',
      foto: 'WhatsApp Image 2026-11-12 at 16.20.43 (1).jpeg',
      bio: 'Base - Plantilla Escorpión de Oro'
    },
    {
      username: 'jugador2',
      email: 'jugador2@escorpionoro.com',
      password: 'miembro123',
      nombre: 'L. Méndez',
      rol: 'miembro',
      foto: 'WhatsApp Image 2026-11-12 at 16.20.43 (2).jpeg',
      bio: 'Escolta - Plantilla Escorpión de Oro'
    }
  ];

  for (const u of defaultUsers) await dbSaveUser(u);
}

/* Exportación */
window.escDb = {
  save: dbSave,
  load: dbLoad,
  getUsers: dbGetUsers,
  saveUser: dbSaveUser,
  getUser: dbGetUser,
  setSession: dbSetSession,
  getSession: dbGetSession,
  clearSession: dbClearSession,
  initDefaultUsers: dbInitDefaultUsers
};
