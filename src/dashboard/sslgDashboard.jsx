import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AnnouncementContext } from "../context/AnnouncementContext";

export default function SSLGDashboard() {
  const { announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement } =
    useContext(AnnouncementContext);

  const currentUser = "sslg"; // TODO: replace with auth UID later
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attachment, setAttachment] = useState(null);

  // ===== FILE HANDLER =====
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAttachment(reader.result);
    reader.readAsDataURL(file);
  };

  // ===== CREATE ANNOUNCEMENT =====
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in title and content.");
      return;
    }

    addAnnouncement({
      title,
      content,
      startDate,
      endDate,
      attachment,
      category: "sslg",
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    });

    setTitle("");
    setContent("");
    setStartDate("");
    setEndDate("");
    setAttachment(null);
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    if (window.confirm("Delete this announcement?")) {
      deleteAnnouncement(id);
    }
  };

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

  // ===== LOGOUT =====
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ===== FILTER & SORT =====
  const sslgPosts = announcements
    .filter((a) => a.category === "sslg")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={styles.container}>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>

      <header style={styles.header}>
        <h1>SSLG Dashboard</h1>
        <p>Quick Stats: {sslgPosts.length} Announcements</p>
      </header>

      {/* CREATE POST */}
      <section style={styles.card}>
        <h2>Create New Announcement</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={{ ...styles.input, height: "100px" }}
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input type="file" onChange={handleFileChange} />

          {attachment && (
            <img
              src={attachment}
              alt="Preview"
              style={{ maxWidth: "200px", marginBottom: "10px" }}
            />
          )}

          <div style={styles.dateContainer}>
            <input
              type="date"
              style={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              style={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button style={styles.button}>Submit</button>
        </form>
      </section>

      {/* POSTS */}
      <section>
        <h2 style={styles.sectionTitle}>Recent Announcements</h2>

        {sslgPosts.map((post) => {
          const alreadyLiked = post.likedBy?.includes(currentUser);

          return (
            <div key={post.id} style={styles.postCard}>
              <div style={{ flex: 1 }}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>

                {post.attachment && (
                  <img src={post.attachment} alt="" style={{ maxWidth: "200px" }} />
                )}

                <p>👍 {post.likes || 0}</p>

                <button
                  onClick={() => handleLike(post)}
                  disabled={alreadyLiked}
                  style={{
                    ...styles.button,
                    opacity: alreadyLiked ? 0.5 : 1,
                    cursor: alreadyLiked ? "not-allowed" : "pointer",
                  }}
                >
                  {alreadyLiked ? "Liked" : "Like"}
                </button>
              </div>

              <button onClick={() => handleDelete(post.id)} style={styles.deleteButton}>
                Delete
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}

// ===== STYLES =====
const styles = {
  container: { maxWidth: "800px", margin: "40px auto", padding: "20px" },
  header: { textAlign: "center", marginBottom: "30px" },
  card: { background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "30px" },
  input: { width: "100%", padding: "10px", marginBottom: "10px" },
  dateContainer: { display: "flex", gap: "10px" },
  button: { background: "#3b82f6", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer" },
  sectionTitle: { marginBottom: "15px" },
  postCard: { background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px", display: "flex", justifyContent: "space-between" },
  deleteButton: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", height: "fit-content" },
  logoutButton: { marginLeft: "1000px", background: "#ff0000", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
};
