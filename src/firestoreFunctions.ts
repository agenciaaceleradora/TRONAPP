import { db } from './firebaseConfig'; // Firestore
import { auth } from './firebaseConfig'; // Firebase Auth
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Função para salvar dados do usuário
export const saveUserData = async (data: any) => {
  try {
    const user = auth.currentUser; // Usuário autenticado
    if (user) {
      await addDoc(collection(db, 'user_data'), {
        userId: user.uid,
        ...data,
        createdAt: new Date(),
      });
      console.log('Dados salvos com sucesso!');
    } else {
      console.error('Usuário não autenticado');
    }
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

// Função para buscar dados do usuário
export const fetchUserData = async () => {
  try {
    const user = auth.currentUser; // Obtém o usuário logado
    if (user) {
      const q = query(
        collection(db, 'user_data'),
        where('userId', '==', user.uid) // Filtra os dados pelo ID do usuário
      );

      const querySnapshot = await getDocs(q);
      const userData: any[] = [];
      querySnapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() }); // Coleta os dados de cada documento
      });

      return userData; // Retorna os dados do usuário
    } else {
      console.error('Usuário não autenticado');
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return [];
  }
};
