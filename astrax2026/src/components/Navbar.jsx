// src/components/Navbar.jsx

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        ASTRA <span>X</span> 2026
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Events</li>
        <li>About Us</li>
        <li>Workshops</li>
        <li>Gallery</li>
        <li>Sponsors</li>
      </ul>

      <button className="register-btn">
        Register Now
      </button>
    </nav>
  );
}

export default Navbar;