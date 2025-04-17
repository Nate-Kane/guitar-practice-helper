import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { app } from '../firebase';
import { Practice } from '../types/practice';

const db = getFirestore(app);
const practicesCollection = collection(db, 'practices');

// Get all practices
export const getPractices = async (): Promise<Practice[]> => {
  const snapshot = await getDocs(practicesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Practice
  }));
};

// Get practices for a specific skill level
export const getPracticesBySkillLevel = async (skillLevel: string): Promise<Practice[]> => {
  const q = query(
    practicesCollection, 
    where('skillLevels', 'array-contains', skillLevel)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Practice
  }));
};

// Get a single practice by ID
export const getPracticeById = async (id: string): Promise<Practice | null> => {
  const practiceDoc = doc(db, 'practices', id);
  const snapshot = await getDoc(practiceDoc);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return {
    id: snapshot.id,
    ...snapshot.data() as Practice
  };
};

// Add a new practice
export const addPractice = async (practice: Omit<Practice, 'id'>): Promise<string> => {
  const docRef = await addDoc(practicesCollection, {
    ...practice,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
};

// Update a practice
export const updatePractice = async (id: string, practice: Partial<Practice>): Promise<void> => {
  const practiceDoc = doc(db, 'practices', id);
  await updateDoc(practiceDoc, {
    ...practice,
    updatedAt: serverTimestamp()
  });
};

// Delete a practice
export const deletePractice = async (id: string): Promise<void> => {
  const practiceDoc = doc(db, 'practices', id);
  await deleteDoc(practiceDoc);
}; 