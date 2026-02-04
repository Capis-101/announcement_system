import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { 
  collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ClubAnnouncement() {
  const { clubName } = useParams();
  const auth = getAuth();
  const currentUser = auth.currentUser; // Logged-in user

  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [commentInputs, setCommentInputs] = useState({}); // track input per post

  // Fetch announcements
  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const postData = doc.data();
        if (!Array.isArray(postData.likes)) postData.likes = [];
        if (!Array.isArray(postData.comments)) postData.comments = [];
        return { id: doc.id, ...postData };
      });
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, []);

  // Toggle Like
  const handleLike = async (postId, postLikes) => {
    if (!currentUser) return; // prevent if no user logged in

    const postRef = doc(db, "announcements", postId);

    if (postLikes.includes(currentUser.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
    }
  };

  // Handle comment input
  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  // Submit comment
  const handleCommentSubmit = async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText || !currentUser) return;

    const postRef = doc(db, "announcements", postId);

    // Save email along with comment
    await updateDoc(postRef, {
      comments: arrayUnion({ email: currentUser.email, text: commentText })
    });

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  // Filter announcements by club and search
  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.category === "Club" &&
      a.club === clubName &&
      a.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{clubName}</h1>

      <input
        type="text"
        placeholder="Search announcements..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {filteredAnnouncements.length === 0 ? (
        <p style={styles.empty}>No announcements yet.</p>
      ) : (
        filteredAnnouncements.map((post) => {
          const postLikes = Array.isArray(post.likes) ? post.likes : [];
          const liked = currentUser ? postLikes.includes(currentUser.uid) : false;

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

              {post.startDate && <p style={styles.date}>📅 Start: {post.startDate}</p>}
              {post.endDate && <p style={styles.date}>📅 End: {post.endDate}</p>}

              {/* Like Button */}
              <button
                onClick={() => handleLike(post.id, postLikes)}
                style={{
                  ...styles.likeButton,
                  backgroundColor: liked ? "#ef4444" : "#3b82f6"
                }}
              >
                {liked ? "❤️ Liked" : "👍 Like"} ({postLikes.length})
              </button>

              {/* Comments */}
              <div style={styles.commentSection}>
                {Array.isArray(post.comments) && post.comments.length > 0 && (
                  <div style={styles.commentList}>
                    {post.comments.map((c, idx) => (
                      <p key={idx} style={styles.commentItem}>
                        <strong>{c.email}:</strong> {c.text}
                      </p>
                    ))}
                  </div>
                )}

                <div style={styles.commentInputContainer}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    style={styles.commentInput}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    style={styles.commentButton}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "40px auto", padding: "0 20px", fontFamily: "'Inter', sans-serif" },
  header: { fontSize: "2rem", marginBottom: "20px", color: "#1f2937" },
  search: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", marginBottom: "25px", fontSize: "1rem" },
  card: { background: "#ffffff", padding: "20px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" },
  title: { fontSize: "1.3rem", fontWeight: "600", marginBottom: "10px" },
  content: { fontSize: "1rem", color: "#374151", marginBottom: "10px" },
  image: { maxWidth: "100%", borderRadius: "10px", marginTop: "10px", marginBottom: "10px" },
  date: { fontSize: "0.9rem", color: "#6b7280" },
  empty: { color: "#6b7280", fontStyle: "italic" },
  likeButton: { marginTop: "10px", marginBottom: "15px", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" },
  commentSection: { marginTop: "10px" },
  commentList: { marginBottom: "10px" },
  commentItem: { background: "#f3f4f6", padding: "8px", borderRadius: "6px", marginBottom: "5px" },
  commentInputContainer: { display: "flex", gap: "10px" },
  commentInput: { flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" },
  commentButton: { background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" },
};
