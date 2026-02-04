import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    // optional later:
    // localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT LINKS */}
        <div className="nav-left">
          <Link to="/mainpage">
            <button onClick={() => scrollToSection("hero")}>Home</button>
          </Link>
          <Link to="/mainpage">
            <button onClick={() => scrollToSection("about")}>About Us</button>
          </Link>
          <Link to="/mainpage">
            <button onClick={() => scrollToSection("contact")}>Contact</button>
          </Link>
          <Link to="/clubs">Clubs</Link>
          <Link to="/announcements">Announcements</Link>
        </div>

        {/* RIGHT LOGOUT */}
        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      {/* CSS */}
      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background-color: #1e293b;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .nav-left {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .navbar button,
        .navbar a {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .navbar button:hover,
        .navbar a:hover {
          color: #22c55e;
          background-color: rgba(34, 197, 94, 0.12);
          transform: translateY(-2px);
        }

        .navbar button:focus,
        .navbar a:focus {
          outline: 2px solid #22c55e;
          outline-offset: 2px;
        }

        /* LOGOUT BUTTON */
        .logout-btn {
          background-color: #ef4444;
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 600;
        }

        .logout-btn:hover {
          background-color: #dc2626;
          color: #fff;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
