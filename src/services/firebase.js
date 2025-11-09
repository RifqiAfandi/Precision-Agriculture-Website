import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBGxaG0HTcpgrzLb5pdYXrZC4XbQJ9tgTs",
  authDomain: "skyveragh.firebaseapp.com",
  databaseURL: "https://skyveragh-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skyveragh",
  storageBucket: "skyveragh.firebasestorage.app",
  messagingSenderId: "601370452969",
  appId: "1:601370452969:web:6893b6c6e351b0fdcc6178",
  measurementId: "G-2XHWFS2KBC"
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
