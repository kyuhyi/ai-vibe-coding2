import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";

// Collection references
export const collections = {
  users: "users",
  posts: "posts",
  comments: "comments"
};

// Create document
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

// Create document with custom ID
export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docId;
  } catch (error) {
    console.error("Error setting document:", error);
    throw error;
  }
};

// Get single document
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Get all documents from collection
export const getDocuments = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName);

    // Apply query conditions if provided
    if (conditions.length > 0) {
      q = query(q, ...conditions);
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

// Update document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    return docId;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Real-time listener
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

// Real-time collection listener
export const subscribeToCollection = (collectionName, callback, conditions = []) => {
  let q = collection(db, collectionName);

  if (conditions.length > 0) {
    q = query(q, ...conditions);
  }

  return onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(documents);
  });
};

// Query helpers
export const queryHelpers = {
  where: (field, operator, value) => where(field, operator, value),
  orderBy: (field, direction = "asc") => orderBy(field, direction),
  limit: (count) => limit(count)
};