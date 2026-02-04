// src/context/AnnouncementContext.js
import { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);

  // Real-time load announcements
  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  const addAnnouncement = async (announcement) => {
    const docRef = await addDoc(collection(db, "announcements"), announcement);
    setAnnouncements((prev) => [{ id: docRef.id, ...announcement }, ...prev]);
  };

  const updateAnnouncement = async (id, updatedFields) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
    await updateDoc(doc(db, "announcements", id), updatedFields);
  };

  const deleteAnnouncement = async (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    await deleteDoc(doc(db, "announcements", id));
  };

  return (
    <AnnouncementContext.Provider
      value={{ announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
