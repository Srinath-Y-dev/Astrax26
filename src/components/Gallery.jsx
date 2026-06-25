import React, { useState, useRef } from 'react';
import '../styles/Gallery.css';

// Background image
import galleryBg from '../assets/gallery-bg.png';
// Portals image
import portalsImg from '../assets/new_portals.png';
// Title image
import galleryTitleImg from '../assets/gallery-title.png';

// Frame Images
import ironman1 from '../assets/ironman1.png';
import ironman2 from '../assets/ironman2.png';
import ironman3 from '../assets/ironman3.png';
import ironman4 from '../assets/ironman4.png';

import thor1 from '../assets/thor1.png';
import thor2 from '../assets/thor2.png';
import thor3 from '../assets/thor3.png';
import thor4 from '../assets/thor4.png';

import captain1 from '../assets/captain1.png';
import captain2 from '../assets/captain2.png';
import captain3 from '../assets/captain3.png';
import captain4 from '../assets/captain4.png';

// Buttons
import b1 from '../assets/b1.png';
import b2 from '../assets/b2.png';
import b3 from '../assets/b3.png';

/* ── Gallery Page ── */
const Gallery = () => {
  const bgRef = useRef(null);

  const [leftIndex, setLeftIndex] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);

  const leftImages = [ironman1, ironman2, ironman3, ironman4];
  const centerImages = [thor1, thor2, thor3, thor4];
  const rightImages = [captain1, captain2, captain3, captain4];

  const nextLeft = () => setLeftIndex((prev) => (prev + 1) % leftImages.length);
  const nextCenter = () => setCenterIndex((prev) => (prev + 1) % centerImages.length);
  const nextRight = () => setRightIndex((prev) => (prev + 1) % rightImages.length);

  return (
    <div className="gallery-page">
      {/* Background image layer (parallax) */}
      <div className="gallery-bg" ref={bgRef} style={{ backgroundImage: `url(${galleryBg})` }}></div>
      <div className="gallery-overlay"></div>

      {/* Floating embers (optional, kept for vibe) */}
      <div className="embers-layer" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="ember" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 15}s`,
            '--max-opacity': 0.1 + Math.random() * 0.3,
            '--drift': Math.random()
          }}></span>
        ))}
      </div>

      {/* Center Portals with Random Images Inside */}
      <div className="center-portals-container">
        <img src={galleryTitleImg} alt="Gallery" className="gallery-main-title-img" />
        <div className="portals-wrapper">
          
          {/* Images inside the windows */}
          <div className="portal-content portal-left">
            {leftImages.map((img, idx) => (
              <img 
                key={`left-${idx}`} 
                src={img} 
                alt={`Ironman ${idx + 1}`} 
                className={leftIndex === idx ? 'active-image' : 'inactive-image'}
              />
            ))}
          </div>
          <div className="portal-content portal-center">
            {centerImages.map((img, idx) => (
              <img 
                key={`center-${idx}`} 
                src={img} 
                alt={`Thor ${idx + 1}`} 
                className={centerIndex === idx ? 'active-image' : 'inactive-image'}
              />
            ))}
          </div>
          <div className="portal-content portal-right">
            {rightImages.map((img, idx) => (
              <img 
                key={`right-${idx}`} 
                src={img} 
                alt={`Captain America ${idx + 1}`} 
                className={rightIndex === idx ? 'active-image' : 'inactive-image'}
              />
            ))}
          </div>
          
          {/* The main portals frame overlay */}
          <img src={portalsImg} alt="Portals Frame" className="portals-frame" />
          
          {/* Buttons */}
          <div className="gallery-controls">
             <div className="gallery-control-item" style={{ left: '19.14%' }}>
               <img src={b1} alt="Left Control" className="rune-btn" style={{ width: '55.5px' }} onClick={nextLeft} />
             </div>
             <div className="gallery-control-item" style={{ left: '50%' }}>
               <img src={b2} alt="Center Control" className="rune-btn" onClick={nextCenter} />
             </div>
             <div className="gallery-control-item" style={{ left: '80.85%' }}>
               <img src={b3} alt="Right Control" className="rune-btn" style={{ width: '42.8px' }} onClick={nextRight} />
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Gallery;