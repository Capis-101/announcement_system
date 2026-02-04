import React from "react";
import "./nav.css";

export default function LandingNav({ children }) {
  return (
    <nav className="landing-nav">
      {/* Left side links */}
      <div className="landing-links">
        <a href="#hero" className="landing-link">Home</a>
        <a href="#about" className="landing-link">About Us</a>
        <a href="#contact" className="landing-link">Contact</a>
      </div>

      {/* Right side */}
      <div>{children}</div>
    </nav>
  );
}
