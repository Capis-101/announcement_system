import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return;

    try {
      // 1️⃣ Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        setError("Login failed. Try again.");
        return;
      }

      // 2️⃣ Fetch role from Firestore
      const userRef = doc(db, "user", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User data not found. Contact admin.");
        return;
      }

      let role = userSnap.data().role;

      // Normalize role to lowercase for case-insensitive matching
      if (role) {
        role = role.toLowerCase().trim(); // Also trim any extra spaces
      }

      console.log("Fetched role:", role); // Debugging: Check what role is fetched

      // 3️⃣ Navigate based on role
      if (role === "teacher") {
        navigate("/teacher", { replace: true });
      } else if (role === "clubpresident") {
        navigate("/create-club-post", { replace: true });
      } else if (role === "sslg") {
        navigate("/sslg-dashboard", { replace: true });
      } else {
        setError("Role not recognized. Contact admin.");
        return; // Prevent clearing form if navigation didn't happen
      }

      // ✅ Only clear form after successful login + redirect
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") setError("No account found for this email.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else setError("Login failed. Please try again.");
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        padding: "40px 30px", background: "#fff", borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "360px"
      }}>
        <h1 style={{ marginBottom: "30px", color: "#333" }}>Login</h1>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", margin: "8px 0 15px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", margin: "8px 0 15px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{
              width: "100%", padding: "12px 0", borderRadius: "10px",
              border: "none", background: "#6c63ff", color: "#fff", cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}