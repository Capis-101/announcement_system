import { useState, useContext } from "react";
import { AnnouncementContext } from "../context/AnnouncementContext";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ role = "teacher" }) {
  const { addAnnouncement } = useContext(AnnouncementContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [club, setClub] = useState("");

  const clubs = [
    "SHS Sports Club",
    "Sigma",
    "SHS Science Club",
    "Barkada Kontra Bisyo",
    "Communication Arts Club",
  ];

  const submit = () => {
    if (role === "club" && !club) {
      alert("Please select a club!");
      return;
    }

    addAnnouncement({
      id: Date.now(),
      title,
      content,
      category: role === "teacher" ? "Teacher" : "Club",
      ...(role === "club" ? { club } : {}), // only add club if role is club
    });

    alert(
      role === "teacher"
        ? "Announcement posted!"
        : `Announcement posted to ${club}`
    );

    // Navigate based on role
    navigate(role === "teacher" ? "/announcements" : `/club/${encodeURIComponent(club)}`);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>{role === "teacher" ? "Create Announcement" : "Create Club Announcement"}</h1>

      {role === "club" && (
        <>
          <label>Club:</label>
          <select value={club} onChange={(e) => setClub(e.target.value)}>
            <option value="">Select a Club</option>
            {clubs.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
        </>
      )}

      <label>Title:</label>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Content:</label>
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={submit} style={{ marginTop: "10px" }}>
        Post
      </button>
    </div>
  );
}
