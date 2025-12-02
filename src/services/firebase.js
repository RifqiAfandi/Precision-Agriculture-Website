import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
let db;

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  }
  return { app, db };
}

export async function fetchPath(path) {
  if (!db) initFirebase();
  try {
    const snapshot = await get(ref(db, path));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (err) {
    console.error('fetchPath error', err);
    return null;
  }
}

export function subscribePath(path, callback) {
  if (!db) initFirebase();
  const r = ref(db, path);
  return onValue(r, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
}

export default {
  initFirebase,
  fetchPath,
  subscribePath,
};
