import { useState } from "react";
import navLogo from "../assets/nav-logo.png";
import tImg from "../assets/t.png";
import pImg from "../assets/p.png";
import rImg from "../assets/r.png";
import sImg from "../assets/s.png";
import mImg from "../assets/m.png";
import spImg from "../assets/sp.png";
import "../styles/Navbar.css";

// src/components/Navbar.jsx

function Navbar({ activeTab, onTabChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabClick = (tabName) => {
    setIsMenuOpen(false);
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleTabClick("Home")}>
        <img src={navLogo} alt="Astrax Logo" className="logo-img" />
      </div>

      <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li className={`nav-item power ${activeTab === "Home" ? "active-stone" : ""}`} onClick={() => handleTabClick("Home")}>
          <img src={pImg} alt="Power" className="nav-stone-img" style={{ width: "16px", height: "16px" }} />
          Home
        </li>
        <li className={`nav-item time ${activeTab === "Events" ? "active-stone" : ""}`} onClick={() => handleTabClick("Events")}>
          <img src={tImg} alt="Time" className="nav-stone-img" />
          Events
        </li>
        <li className={`nav-item reality ${activeTab === "About Us" ? "active-stone" : ""}`} onClick={() => handleTabClick("About Us")}>
          <img src={rImg} alt="Reality" className="nav-stone-img" />
          About Us
        </li>
        <li className={`nav-item soul ${activeTab === "Workshops" ? "active-stone" : ""}`} onClick={() => handleTabClick("Workshops")}>
          <img src={sImg} alt="Soul" className="nav-stone-img" />
          Workshops
        </li>
        <li className={`nav-item mind ${activeTab === "Gallery" ? "active-stone" : ""}`} onClick={() => handleTabClick("Gallery")}>
          <img src={mImg} alt="Mind" className="nav-stone-img" style={{ width: "50px", height: "50px", margin: "0 -12px" }} />
          Gallery
        </li>
        <li className={`nav-item space ${activeTab === "Sponsors" ? "active-stone" : ""}`} onClick={() => handleTabClick("Sponsors")}>
          <img src={spImg} alt="Space" className="nav-stone-img" style={{ width: "50px", height: "50px", margin: "0 -12px" }} />
          Sponsors
        </li>
        <li className="nav-mobile-register">
          <button className="register-btn mobile-reg-btn">
            Register Now
          </button>
        </li>
      </ul>

      <button className="register-btn desktop-reg-btn">
        Register Now
      </button>
    </nav>
  );
}

export default Navbar;