import { useNavigate } from "react-router-dom";

export default function Clubs() {
  const navigate = useNavigate();

  const clubs = [
    "SHS Sports Club",
    "Sigma",
    "SHS Science Club",
    "Barkada Kontra Bisyo",
    "Boy Scouts",
    "Communication Arts Club",
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        Student Club
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "30px",
        }}
      >
        {clubs.map(club => (
          <div
            key={club}
            onClick={() => navigate(`/clubs/${club}`)}
            style={{
              height: "140px",
              background: "#e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "1.1rem",
            }}
          >
            {club}
          </div>
        ))}
      </div>
    </div>
  );
}
