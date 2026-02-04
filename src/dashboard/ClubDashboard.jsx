import { useState, useContext } from "react";
import { AnnouncementContext } from "../context/AnnouncementContext";

export default function ClubDashboard() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useContext(AnnouncementContext);

  const [selectedClub, setSelectedClub] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attachment, setAttachment] = useState(null);

  const clubs = [
    "SHS Sports Club",
    "Sigma",
    "SHS Science Club",
    "Barkada Kontra Bisyo",
    "Communication Arts Club",
  ];

  const handleFileChange = (e) => setAttachment(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClub) {
      alert("Please select a club.");
      return;
    }
    if (!title || !content) {
      alert("Please fill in both title and content.");
      return;
    }

    addAnnouncement({
      title,
      content,
      category: "Club",
      club: selectedClub,
      startDate,
      endDate,
      attachment: attachment ? attachment.name : null,
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setContent("");
    setStartDate("");
    setEndDate("");
    setAttachment(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteAnnouncement(id);
    }
  };

  const clubPosts = announcements
    .filter((a) => a.category === "Club" && a.club === selectedClub)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Club Dashboard</h1>

      {/* Select Club */}
      <section style={styles.card}>
        <h2>Select Your Club</h2>
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select Club --</option>
          {clubs.map((c, idx) => (
            <option key={idx} value={c}>
              {c}
            </option>
          ))}
        </select>
      </section>

      {/* Create Club Announcement */}
      {selectedClub && (
        <section style={styles.card}>
          <h2>Create Announcement for {selectedClub}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ ...styles.input, height: "100px", resize: "vertical" }}
            />
            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
            <div style={styles.dateContainer}>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
            <button type="submit" style={styles.button}>
              Post
            </button>
          </form>
        </section>
      )}

      {/* Recent Club Posts */}
      {selectedClub && (
        <section>
          <h2 style={styles.sectionTitle}>Recent Posts for {selectedClub}</h2>
          {clubPosts.length === 0 && <p style={styles.emptyText}>No posts yet.</p>}
          <div style={styles.postsContainer}>
            {clubPosts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <div>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <p style={styles.postContent}>{post.content}</p>
                  {post.attachment && <small>Attachment: {post.attachment}</small>}
                  {post.startDate && <p>Start: {post.startDate}</p>}
                  {post.endDate && <p>End: {post.endDate}</p>}
                </div>
                <div style={styles.postActions}>
                  <button style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(post.id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "0 20px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    color: "#1f2937",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    marginBottom: "35px",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
  },
  fileInput: {
    marginBottom: "15px",
  },
  dateContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#3b82f6",
  },
  postsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  postCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  postTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  postContent: {
    fontSize: "1rem",
    color: "#374151",
    marginBottom: "5px",
  },
  postActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  editButton: {
    background: "#fbbf24",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
  },
  deleteButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
  },
  emptyText: {
    color: "#6b7280",
    fontStyle: "italic",
  },
};
