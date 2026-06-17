import "../styles/Hero.css";

import Countdown from "./Countdown";

// src/components/Hero.jsx

function Hero() {
  return (
    <section className="hero-content">

      <div className="marvel-logo-box">
        <h1 className="marvel-logo">
          ASTRA <span>X</span> 2026
        </h1>
      </div>

      <p className="hero-tagline">
        THE ULTIMATE INNOVATION ASSEMBLY
      </p>

      <div className="hero-buttons">
        <button className="primary-btn">Register Now</button>
        <button className="secondary-btn">Explore Events</button>
      </div>

      <Countdown />

    </section>
  );
}

export default Hero;