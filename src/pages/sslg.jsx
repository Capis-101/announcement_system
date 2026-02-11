import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function SSLGAnnouncements() {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // ===== FETCH ANNOUNCEMENTS =====
  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const postData = doc.data();
        if (!Array.isArray(postData.likes)) postData.likes = [];
        if (!Array.isArray(postData.comments)) postData.comments = [];
        return { id: doc.id, ...postData };
      });
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, []);

  // ===== LIKE / UNLIKE =====
  const handleLike = async (postId, postLikes) => {
    if (!currentUser) return;

    const postRef = doc(db, "announcements", postId);

    if (postLikes.includes(currentUser.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid),
      });
    }
  };

  // ===== FILTER ANNOUNCEMENTS =====
  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.category === "sslg" && // <-- Only show SSLG announcements
      a.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>SSLG Announcements</h1>

      <input
        type="text"
        placeholder="Search announcements by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {filteredAnnouncements.length === 0 ? (
        <p style={styles.noPosts}>No announcements found.</p>
      ) : (
        filteredAnnouncements.map((post) => {
          const postLikes = post.likes || [];
          const liked = currentUser && postLikes.includes(currentUser.uid);

          return (
            <div key={post.id} style={styles.card}>
              <h3 style={styles.title}>{post.title}</h3>
              <p style={styles.content}>{post.content}</p>

              {post.attachment && (
                <img
                  src={post.attachment}
                  alt="Attachment"
                  style={styles.image}
                  onClick={() => setSelectedImage(post.attachment)}
                />
              )}

              {post.startDate && <p>📅 Start: {post.startDate}</p>}
              {post.endDate && <p>📅 End: {post.endDate}</p>}

              <button
                onClick={() => handleLike(post.id, postLikes)}
                style={{
                  ...styles.likeBtn,
                  backgroundColor: liked ? "#ef4444" : "#3b82f6",
                }}
              >
                {liked ? "❤️ Liked" : "👍 Like"} ({postLikes.length})
              </button>
            </div>
          );
        })
      )}

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <div style={styles.modalContent}>
            <img
              src={selectedImage}
              alt="Full View"
              style={styles.modalImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ===== STYLES =====
const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "0 20px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#1f2937",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "25px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  },
  noPosts: { color: "#6b7280", fontStyle: "italic" },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  title: { fontSize: "1.3rem", fontWeight: "600", marginBottom: "8px" },
  content: { marginBottom: "8px", color: "#374151" },
  image: {
    maxWidth: "200px",
    borderRadius: "8px",
    marginBottom: "8px",
    cursor: "zoom-in",
  },
  likeBtn: {
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer",
  },

  // MODAL
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    maxWidth: "90%",
    maxHeight: "90%",
  },
  modalImage: {
    width: "88%",
    height: "auto",
    borderRadius: "10px",
  },
};
