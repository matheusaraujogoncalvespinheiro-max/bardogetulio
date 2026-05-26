import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Puxa as credenciais das variáveis de ambiente (.env) ou usa as oficiais como padrão
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBaesbfRxgIQxwKXgXwVvKHGfTMSTvrvUA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "baer-ff16a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "baer-ff16a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "baer-ff16a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "580267999492",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:580267999492:web:9be4cf783492a33d461051"
};

// Verifica se as chaves foram configuradas e se não são as chaves padrão
const isConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'SUA_API_KEY' && 
  firebaseConfig.apiKey.trim() !== '';

let app = null;
let db = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase inicializado com sucesso para o Bar do Getúlio!");
  } catch (error) {
    console.error("❌ Falha crítica ao inicializar o Firebase:", error);
  }
} else {
  console.warn("⚠️ Firebase não configurado. O sistema usará o armazenamento local (LocalStorage).");
}

export { db, isConfigured };
