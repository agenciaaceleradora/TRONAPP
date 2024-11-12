import { db } from '../firebaseConfig';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

interface ManualAccess {
  email: string;
  active: boolean;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  notes?: string;
}

export async function grantManualAccess(accessData: ManualAccess) {
  try {
    const docRef = doc(db, 'manual_access', accessData.email);
    await setDoc(docRef, {
      ...accessData,
      grantedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Erro ao conceder acesso manual:', error);
    throw error;
  }
}

export async function revokeManualAccess(email: string) {
  try {
    const docRef = doc(db, 'manual_access', email);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Erro ao revogar acesso manual:', error);
    throw error;
  }
}

export async function listManualAccess() {
  try {
    const querySnapshot = await getDocs(collection(db, 'manual_access'));
    const accessList: ManualAccess[] = [];
    querySnapshot.forEach((doc) => {
      accessList.push({ email: doc.id, ...doc.data() } as ManualAccess);
    });
    return accessList;
  } catch (error) {
    console.error('Erro ao listar acessos manuais:', error);
    throw error;
  }
}