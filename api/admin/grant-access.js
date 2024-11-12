import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWVg2Axo6FIKLu9G7K8UcywdVnfmMLUIo",
  authDomain: "tron-app-339ef.firebaseapp.com",
  projectId: "tron-app-339ef",
  storageBucket: "tron-app-339ef.firebaseapp.com",
  messagingSenderId: "758724020681",
  appId: "1:758724020681:web:668c165ca464568c59c018"
};

// Token fixo para testes
const ADMIN_TOKEN = "tron-admin-token-123";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Verificar token de admin
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    console.log('Token recebido:', authHeader);
    console.log('Token esperado:', `Bearer ${ADMIN_TOKEN}`);
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const { email, duration, notes } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Calcular data de expiração se duration for fornecida (em dias)
    let expiresAt = undefined;
    if (duration) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + duration);
      expiresAt = expDate.toISOString();
    }

    // Criar documento de acesso manual
    await setDoc(doc(db, 'manual_access', email), {
      active: true,
      grantedAt: new Date().toISOString(),
      grantedBy: 'admin',
      expiresAt,
      notes
    });

    return res.status(200).json({
      success: true,
      message: 'Acesso manual concedido com sucesso',
      data: { email, expiresAt }
    });

  } catch (error) {
    console.error('Erro ao conceder acesso manual:', error);
    return res.status(500).json({
      error: 'Erro interno ao conceder acesso',
      message: error.message
    });
  }
}