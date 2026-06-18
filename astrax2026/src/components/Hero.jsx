import "../styles/Hero.css";
import titleImg from "../assets/title.png";
import Countdown from "./Countdown";

// src/components/Hero.jsx

function Hero() {
  return (
    <section className="hero-content">

      {/* Floating ambient particles background */}
      <div className="hero-ambient">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="ambient-orb" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 6}s`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
          }} />
        ))}
      </div>

      {/* Main title with glow reveal */}
      <div className="marvel-logo-box">
        <h1 className="marvel-logo-heading">
          <img src={titleImg} alt="ASTRA X 2026" className="marvel-logo-image" />
        </h1>
      </div>

      {/* Event tagline */}
      <p className="hero-tagline">
        THE ULTIMATE INNOVATION ASSEMBLY
      </p>

      {/* Infinity stone decorative strip */}
      <div className="hero-stones-strip">
        {[
          { color: "#a872ff", label: "Power" },
          { color: "#3aff8f", label: "Time" },
          { color: "#ff3e70", label: "Reality" },
          { color: "#ff8e3c", label: "Soul" },
          { color: "#ffe14c", label: "Mind" },
          { color: "#3cb6ff", label: "Space" },
        ].map((stone, i) => (
          <div key={i} className="hero-stone" style={{ animationDelay: `${2.2 + i * 0.12}s` }}>
            <div
              className="stone-gem"
              style={{
                background: `radial-gradient(circle at 35% 35%, #fff 0%, ${stone.color} 45%, #000 100%)`,
                boxShadow: `0 0 12px ${stone.color}, 0 0 30px ${stone.color}55`,
              }}
            />
            <span className="stone-label" style={{ color: stone.color }}>{stone.label}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="hero-buttons">
        <button className="primary-btn">
          <span className="btn-glow" />
          Register Now
        </button>
        <button className="secondary-btn">Explore Events</button>
      </div>


      {/* Countdown */}
      <Countdown />

    </section>
  );
}

export default Hero;