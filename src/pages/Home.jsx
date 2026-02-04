import { useState, useContext } from "react";
import { AnnouncementContext } from "../context/AnnouncementContext";

export default function Home() {
  const { announcements, updateAnnouncement } =
    useContext(AnnouncementContext);

  const currentUser = "CurrentUser"; // replace later with auth UID

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // ===== SEARCH =====
  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.category === "Teacher" &&
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===== LIKE =====
  const handleLike = (post) => {
    if (post.likedBy?.includes(currentUser)) {
      alert("You already liked this post.");
      return;
    }

    updateAnnouncement(post.id, {
      likes: (post.likes || 0) + 1,
      likedBy: [...(post.likedBy || []), currentUser],
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Announcements</h1>

      <input
        type="text"
        placeholder="Search announcements by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      {filteredAnnouncements.length === 0 && (
        <p style={styles.noPosts}>No announcements found.</p>
      )}

      {filteredAnnouncements.map((post) => {
        const alreadyLiked = post.likedBy?.includes(currentUser);

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
              onClick={() => handleLike(post)}
              disabled={alreadyLiked}
              style={{
                ...styles.likeBtn,
                opacity: alreadyLiked ? 0.5 : 1,
                cursor: alreadyLiked ? "not-allowed" : "pointer",
              }}
            >
              👍 {alreadyLiked ? "Liked" : "Like"} ({post.likes || 0})
            </button>
          </div>
        );
      })}

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
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    marginTop: "10px",
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
