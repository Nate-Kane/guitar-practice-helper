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
import { slugify } from '../utils/slug';

const db = getFirestore(app);
const practicesCollection = collection(db, 'practices');

const mapPracticeDoc = (snapshot: { id: string; data: () => Record<string, unknown> }): Practice => ({
  id: snapshot.id,
  ...(snapshot.data() as Omit<Practice, 'id'>),
});

// Get all practices
export const getPractices = async (): Promise<Practice[]> => {
  const snapshot = await getDocs(practicesCollection);
  return snapshot.docs.map((d) => mapPracticeDoc(d));
};

// Get practices for a specific skill level
export const getPracticesBySkillLevel = async (skillLevel: string): Promise<Practice[]> => {
  const q = query(
    practicesCollection, 
    where('skillLevels', 'array-contains', skillLevel)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapPracticeDoc(d));
};

// Get a single practice by Firestore document ID
export const getPracticeById = async (id: string): Promise<Practice | null> => {
  const practiceDoc = doc(db, 'practices', id);
  const snapshot = await getDoc(practiceDoc);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return mapPracticeDoc(snapshot);
};

/** Resolve /practice/:param by slug first, then by document id (legacy links). */
export const getPracticeBySlugOrId = async (slugOrId: string): Promise<Practice | null> => {
  const normalized = slugify(slugOrId) || slugOrId;

  const bySlug = query(practicesCollection, where('slug', '==', normalized));
  const slugSnapshot = await getDocs(bySlug);
  if (!slugSnapshot.empty) {
    return mapPracticeDoc(slugSnapshot.docs[0]);
  }

  // Also try the raw param in case someone stored a non-slugified value
  if (normalized !== slugOrId) {
    const byRawSlug = query(practicesCollection, where('slug', '==', slugOrId));
    const rawSnapshot = await getDocs(byRawSlug);
    if (!rawSnapshot.empty) {
      return mapPracticeDoc(rawSnapshot.docs[0]);
    }
  }

  return getPracticeById(slugOrId);
};

/** True if another practice already uses this slug. */
export const isSlugTaken = async (slug: string, excludeId?: string): Promise<boolean> => {
  const normalized = slugify(slug);
  if (!normalized) return false;

  const q = query(practicesCollection, where('slug', '==', normalized));
  const snapshot = await getDocs(q);
  return snapshot.docs.some((d) => d.id !== excludeId);
};

// Add a new practice
export const addPractice = async (
  practice: Omit<Practice, 'id'>
): Promise<string> => {
  const slug = practice.slug ? slugify(practice.slug) : undefined;
  if (slug && (await isSlugTaken(slug))) {
    throw new Error(`Slug "${slug}" is already in use`);
  }

  const docRef = await addDoc(practicesCollection, {
    ...practice,
    ...(slug ? { slug } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
};

// Update a practice
export const updatePractice = async (id: string, practice: Partial<Practice>): Promise<void> => {
  const payload: Partial<Practice> = { ...practice };
  if (practice.slug !== undefined) {
    const slug = slugify(practice.slug);
    if (slug && (await isSlugTaken(slug, id))) {
      throw new Error(`Slug "${slug}" is already in use`);
    }
    payload.slug = slug || undefined;
  }

  const practiceDoc = doc(db, 'practices', id);
  await updateDoc(practiceDoc, {
    ...payload,
    updatedAt: serverTimestamp()
  });
};

// Delete a practice
export const deletePractice = async (id: string): Promise<void> => {
  const practiceDoc = doc(db, 'practices', id);
  await deleteDoc(practiceDoc);
};
