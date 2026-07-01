import "../styles/Hero.css";
import titleImg from "../assets/title.png";
import tesImg from "../assets/tes.png";
import aetImg from "../assets/aet.png";
import powImg from "../assets/pow.png";
import souImg from "../assets/sou.png";
import sepImg from "../assets/sep.png";
import eyeImg from "../assets/eye.png";
import Countdown from "./Countdown";
import { triggerRazorpayPayment } from "../utils/payment";

// src/components/Hero.jsx

function Hero({ onTabChange }) {
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

      {/* Spacer to align with background video logo */}
      <div className="hero-logo-spacer"></div>

      {/* Event tagline */}
      <p className="hero-tagline">
        THE ULTIMATE INNOVATION ASSEMBLY
      </p>

      {/* Infinity stone decorative strip */}
      <div className="hero-stones-strip">
        {[
          { color: "#a872ff", label: "Power", img: powImg },
          { color: "#3aff8f", label: "Time", img: eyeImg },
          { color: "#ff3e70", label: "Reality", img: aetImg },
          { color: "#ff8e3c", label: "Soul", img: souImg, size: 65, margin: -18 },
          { color: "#ffe14c", label: "Mind", img: sepImg },
          { color: "#3cb6ff", label: "Space", img: tesImg, size: 35, margin: -5 },
        ].map((stone, i) => (
          <div key={i} className="hero-stone" style={{ animationDelay: `${2.2 + i * 0.12}s` }}>
            {stone.img ? (
              <img 
                src={stone.img} 
                alt={stone.label} 
                className="stone-gem" 
                style={{ 
                  objectFit: "contain",
                  width: stone.size ? `${stone.size}px` : "55px",
                  height: stone.size ? `${stone.size}px` : "55px",
                  marginTop: stone.margin !== undefined ? `${stone.margin}px` : "-15px",
                  marginBottom: stone.margin !== undefined ? `${stone.margin}px` : "-15px"
                }} 
              />
            ) : (
              <div
                className="stone-gem"
                style={{
                  "--stone-color": stone.color,
                  "--stone-glow": `${stone.color}99`,
                }}
              >
                <div className="stone-core" style={{ background: stone.color }} />
                <div className="stone-facets" />
                <div className="stone-glint" />
              </div>
            )}
            <span className="stone-label" style={{ color: stone.color }}>{stone.label}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="hero-buttons">
        <button className="primary-btn" onClick={() => triggerRazorpayPayment({ amount: 50, description: "Astra X All Access Registration" })}>
          <span className="btn-glow" />
          Register Now
        </button>
        <button className="secondary-btn" onClick={() => onTabChange && onTabChange("Events")}>Explore Events</button>
      </div>


      {/* Countdown */}
      <Countdown />

    </section>
  );
}

export default Hero;