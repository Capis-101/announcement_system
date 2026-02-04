import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // make sure auth & db are exported
import { collection, query, where, getDocs } from "firebase/firestore";

import bertbg from "../assets/bertbg.jpg";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.jpg";
import bg3 from "../assets/bg3.jpg";
import bg4 from "../assets/bg4.jpg";
import Landingnav from "../components/landingnav";
import "./landing.css";

export default function MainPage() {
  const navigate = useNavigate();

  const [loginOpen, setLoginOpen] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");

  // Intersection Observer for animations
  useEffect(() => {
    const elements = document.querySelectorAll(".animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goToEnrollment = () => {
    navigate("/enrollment");
  };

  // ✅ Firebase login using student number
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // studentNumber is now the EMAIL
    await signInWithEmailAndPassword(auth, studentNumber, password);

    alert(`Login successful! Welcome ${studentNumber}`);
    setLoginOpen(false);
    setStudentNumber("");
    setPassword("");
    navigate("/mainpage");
  } catch (error) {
    console.error(error);

    if (error.code === "auth/user-not-found") {
      alert("No account found for this student email.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password.");
    } else {
      alert("Login failed. Please try again.");
    }
  }
};


  return (
    <div className="landing-root">
      <Landingnav>
        <button
          onClick={() => setLoginOpen(true)}
          style={{
            padding: "8px 16px",
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Log In
        </button>
      </Landingnav>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="hero"
        style={{ backgroundImage: `url(${bertbg})` }}
      >
        <div className="hero-overlay">
          <h1>Iluminada Roxas Mendoza Memorial Highschool</h1>
          <p>Excellence • Discipline • Service</p>
          <button className="hero-btn" onClick={goToEnrollment}>
            Enroll Now
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about animate fade-up">
        <h2>About Our School</h2>
        <p className="about-intro">
          Iluminada Roxas Mendoza Memorial Highschool is committed to providing
          quality education that nurtures academic excellence, character, and
          leadership.
        </p>

        <div className="about-content">
          <img src={bg3} alt="School" className="animate fade-left" />
          <div className="about-text animate fade-right">
            <h3>Why Choose Our School?</h3>
            <ul>
              <li>✔ Experienced and dedicated teachers</li>
              <li>✔ Modern learning facilities</li>
              <li>✔ Active clubs and organizations</li>
              <li>✔ Safe and inclusive environment</li>
            </ul>
          </div>
        </div>

        <div className="about-gallery">
          <img src={bg1} alt="Gallery 1" className="animate fade-in" />
          <img src={bg2} alt="Gallery 2" className="animate fade-in" />
          <img src={bg4} alt="Gallery 3" className="animate fade-in" />
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="contact animate fade-up">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <p>
            <strong>Address:</strong> Sulucan, Bocaue, Bulacan 3018
          </p>
          <p>
            <strong>Email:</strong>{" "}
            IluminadaRoxasMendozaMemorialHighschool@email.com
          </p>
          <p>
            <strong>Phone:</strong> +63 44 769 4436
          </p>
          <p>
            <strong>School Hours:</strong> Monday – Friday (7:00 AM – 4:00 PM)
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer animate fade-in">
        <p className="footer-copy">
          © {new Date().getFullYear()} Iluminada Roxas Mendoza Memorial
          Highschool. All rights reserved.
        </p>
      </footer>

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div
          className="login-overlay"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Student Login</h2>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Student Number"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Log In</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
