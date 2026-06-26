import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/Sponsors.css';

// Background Video
import sponsersBg from '../assets/sponsers.mp4';

// Demo Sponsor Icons
import { FaGoogle, FaMicrosoft, FaAws, FaReact } from 'react-icons/fa';
import { SiNvidia, SiOpenai, SiIntel, SiAmd, SiTesla, SiMeta, SiGooglecloud, SiCisco } from 'react-icons/si';

const demoSponsors = [
  { id: 1, name: 'Nvidia', Icon: SiNvidia, tier: 'AI & GRAPHICS PARTNER' },
  { id: 2, name: 'OpenAI', Icon: SiOpenai, tier: 'TITLE SPONSOR' },
  { id: 3, name: 'Microsoft', Icon: FaMicrosoft, tier: 'TITLE SPONSOR' },
  { id: 4, name: 'Intel', Icon: SiIntel, tier: 'POWER SPONSOR' },
  { id: 5, name: 'Google', Icon: FaGoogle, tier: 'POWER SPONSOR' },
  { id: 6, name: 'AWS', Icon: FaAws, tier: 'POWER SPONSOR' },
  { id: 7, name: 'AMD', Icon: SiAmd, tier: 'TECH PARTNER' },
  { id: 8, name: 'Tesla', Icon: SiTesla, tier: 'TECH PARTNER' },
  { id: 9, name: 'Meta', Icon: SiMeta, tier: 'INNOVATION PARTNER' },
  { id: 10, name: 'Google Cloud', Icon: SiGooglecloud, tier: 'CLOUD PARTNER' },
  { id: 11, name: 'Cisco', Icon: SiCisco, tier: 'NETWORKING PARTNER' },
  { id: 12, name: 'React', Icon: FaReact, tier: 'FRONTEND PARTNER' }
];

// Helper to avoid hook purity issues (deterministic pseudo-random generator)
const INITIAL_PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: `${(i * 3.7 + 5) % 100}%`,
  animationDelay: `${(i * 0.4) % 8}s`,
  animationDuration: `${8 + (i * 0.6) % 12}s`,
  maxOpacity: 0.2 + (i * 0.05) % 0.6,
  drift: (i * 0.1) % 1
}));

// Calculates the 3D position and properties for each card based on its relative distance from the center
const getCardStyle = (index, activeIndex, totalCards) => {
  let diff = index - activeIndex;
  
  // Wrap around for circular list
  if (diff > totalCards / 2) diff -= totalCards;
  if (diff < -totalCards / 2) diff += totalCards;

  const isVisible = Math.abs(diff) <= 2;
  
  let x = 0;
  let z = 0;
  let rotateY = 0;
  let scale = 1;
  let opacity = 0;
  let zIndex = 0;

  if (isVisible) {
    if (diff === 0) {
      x = 0; z = 120; rotateY = 0; scale = 1.1; opacity = 1; zIndex = 10;
    } else if (diff === 1) {
      x = 220; z = 20; rotateY = -35; scale = 0.85; opacity = 0.7; zIndex = 8;
    } else if (diff === -1) {
      x = -220; z = 20; rotateY = 35; scale = 0.85; opacity = 0.7; zIndex = 8;
    } else if (diff === 2) {
      x = 380; z = -80; rotateY = -50; scale = 0.7; opacity = 0.4; zIndex = 6;
    } else if (diff === -2) {
      x = -380; z = -80; rotateY = 50; scale = 0.7; opacity = 0.4; zIndex = 6;
    }
  } else {
    // Hidden cards slide in/out from the deep background
    x = diff > 0 ? 550 : -550;
    z = -200; rotateY = diff > 0 ? -60 : 60; scale = 0.6; opacity = 0; zIndex = 0;
  }

  return { x, z, rotateY, scale, opacity, zIndex, isVisible, diff };
};

const Sponsors = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const N = demoSponsors.length;
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(err => console.log("Video autoPlay prevented:", err));
    };

    playVideo();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const rotateRight = () => setActiveIndex((prev) => (prev + 1) % N);
  const rotateLeft = () => setActiveIndex((prev) => (prev - 1 + N) % N);

  const handleCardClick = (diff, index) => {
    // Bring clicked card to center
    if (diff !== 0) setActiveIndex(index);
  };

  const handleDragEnd = (event, info) => {
    // Threshold for swipe to trigger rotation
    if (info.offset.x < -50) rotateRight();
    else if (info.offset.x > 50) rotateLeft();
  };

  return (
    <div className="sponsors-page">
      {/* Background Video */}
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto" 
        className="sponsors-bg-video"
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.log("Video manual loop failed:", err));
          }
        }}
      >
        <source src={sponsersBg} type="video/mp4" />
      </video>

      {/* Centered Sponsors Header */}
      <header className="sponsors-header">
        <div className="sponsors-tagline">TOGETHER, WE BUILD THE EXTRAORDINARY</div>
        <h1 className="sponsors-title">OUR SPONSORS</h1>
        <h2 className="sponsors-subtitle">OUR POWER. THEIR VISION.</h2>
        <div className="status-indicator">
          <span>PARTNERSHIP STATUS</span>
          <div className="status-value">
            <span className="status-dot"></span> ACTIVE
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="sponsors-main-content">
        {/* Carousel Panel */}
        <section className="sponsors-carousel-panel">
          <div className="carousel-viewport">
            {/* Left Nav Arrow */}
            <div className="nav-arrow left" onClick={rotateLeft}>
              &lt;
            </div>

            {/* 3D Cards Container */}
            <motion.div 
              className="carousel-container"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
            >
              {demoSponsors.map((sponsor, index) => {
                const { x, z, rotateY, scale, opacity, zIndex, isVisible, diff } = getCardStyle(index, activeIndex, N);
                
                return (
                  <motion.div
                    key={sponsor.id}
                    className={`sponsor-3d-card ${diff === 0 ? 'active-card' : 'inactive-card'}`}
                    animate={{ x, z, rotateY, scale, opacity }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ zIndex, pointerEvents: isVisible ? 'auto' : 'none' }}
                    onClick={() => handleCardClick(diff, index)}
                  >
                    
                    <div className="card-body-tech">
                      <div className="card-icon-container">
                        <sponsor.Icon />
                      </div>
                      <h3 className="card-name">{sponsor.name}</h3>
                      <div className="card-tier">{sponsor.tier}</div>
                    </div>

                    <div className="card-footer-tech">
                      <span className="card-status-dot"></span>
                      <span>SYSTEM ACTIVE</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Right Nav Arrow */}
            <div className="nav-arrow right" onClick={rotateRight}>
              &gt;
            </div>
          </div>

          {/* Hologram Pedestal Base */}
          <div className="pedestal-container">
            <div className="volumetric-beam"></div>
            <div className="pedestal-base">
              <div className="pedestal-ring-1"></div>
              <div className="pedestal-ring-2"></div>
              <div className="pedestal-core"></div>
            </div>
          </div>
        </section>
      </main>



    </div>
  );
};

export default Sponsors;