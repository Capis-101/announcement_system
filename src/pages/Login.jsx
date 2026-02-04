import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fixed credentials
  const credentials = {
    teacher: { email: "teacher@email.com", password: "teacher123" },
    club: { email: "clubpresident@email.com", password: "club123" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      email === credentials.teacher.email &&
      password === credentials.teacher.password
    ) {
      login({ email, role: "teacher" });
      navigate("/teacher");
    } else if (
      email === credentials.club.email &&
      password === credentials.club.password
    ) {
      login({ email, role: "club" });
      navigate("/create-club-post");
    } else {
      setError("Invalid email or password!");
    }
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f6fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    padding: "40px 30px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "320px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px 0",
    margin: "15px 0 0",
    borderRadius: "10px",
    border: "none",
    background: "#6c63ff",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const buttonHover = (e) => {
    e.target.style.background = "#5750d1";
    e.target.style.transform = "translateY(-2px)";
  };

  const buttonLeave = (e) => {
    e.target.style.background = "#6c63ff";
    e.target.style.transform = "translateY(0)";
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "30px", color: "#333" }}>Login</h1>

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={buttonHover}
            onMouseOut={buttonLeave}
          >
            Login
          </button>
        </form>

        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "15px" }}>
          Teacher: teacher@email.com / teacher123 <br />
          Club President: clubpresident@email.com / club123
        </p>
      </div>
    </div>
  );
}
