import { useState, useContext } from "react";
import { AnnouncementContext } from "../context/AnnouncementContext";

export default function Home() {
  const { announcements, updateAnnouncement } =
    useContext(AnnouncementContext);

  const currentUser = "CurrentUser"; // replace later with auth UID

  const [searchQuery, setSearchQuery] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  // ===== SEARCH =====
  const filteredAnnouncements = announcements.filter(
  (a) =>
    a.category === "Teacher" &&
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
);


  // ===== LIKE (SAFE) =====
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
              />
            )}

            {post.startDate && <p>🗓 Start: {post.startDate}</p>}
            {post.endDate && <p>🗓 End: {post.endDate}</p>}

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
  image: { maxWidth: "200px", borderRadius: "8px", marginBottom: "8px" },

  likeBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    marginTop: "10px",
  },
  commentInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    marginBottom: "8px",
  },
  commentBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
  },
  comment: {
    marginTop: "6px",
    fontSize: "0.9rem",
    color: "#4b5563",
  },
};
