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
  serverTimestamp,
} from "firebase/firestore";

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);

  // ===== Real-time Firestore listener =====
  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  // ===== Add Announcement =====
  const addAnnouncement = async (announcement) => {
    await addDoc(collection(db, "announcements"), {
      ...announcement,
      createdAt: serverTimestamp(),
    });
  };

  // ===== Update Announcement =====
  const updateAnnouncement = async (id, updatedFields) => {
    await updateDoc(doc(db, "announcements", id), updatedFields);
  };

  // ===== Delete Announcement =====
  const deleteAnnouncement = async (id) => {
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
