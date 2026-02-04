export default function AnnouncementCard({ data }) {
  return (
    <div style={cardStyles.card}>
      <h3 style={cardStyles.title}>{data.title}</h3>
      <p style={cardStyles.content}>{data.content}</p>

      {data.attachment && (
        <img
          src={data.attachment} // Base64 string or URL
          alt="Attachment"
          style={{ maxWidth: "200px", marginTop: "10px", borderRadius: "8px" }}
        />
      )}
    </div>
  );
}

const cardStyles = {
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    marginBottom: "15px",
  },
  title: { fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px" },
  content: { fontSize: "1rem", color: "#374151" },
};
