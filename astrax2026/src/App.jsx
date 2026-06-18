import { useState, useRef } from "react";
import "./App.css";
import "./styles/Pages.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";
import AboutUs from "./components/AboutUs";
import Workshops from "./components/Workshops";
import Gallery from "./components/Gallery";
import Sponsors from "./components/Sponsors";
import BlipParticles from "./components/BlipParticles";

import bgVideo from "./assets/hero-video.mp4";
import introVideo from "./assets/intro.mp4";

function App() {
  const [showIntro, setShowIntro]   = useState(true);
  const [fadeIntro, setFadeIntro]   = useState(false);
  const videoRef = useRef(null);
  const pageContainerRef = useRef(null);

  const [blipPhase, setBlipPhase]   = useState(null); // null | 'dissolve' | 'reform'
  const [activeTab, setActiveTab]   = useState("Home");
  const [displayTab, setDisplayTab] = useState("Home");
  const [stoneColor, setStoneColor] = useState("#a872ff");

  const handleIntroEnd = () => {
    setFadeIntro(true);
    setTimeout(() => setShowIntro(false), 800);
  };

  const handleSkip = () => handleIntroEnd();

  const stoneColors = {
    Home:       "#a872ff",
    Events:     "#3aff8f",
    "About Us": "#ff3e70",
    Workshops:  "#ff8e3c",
    Gallery:    "#ffe14c",
    Sponsors:   "#3cb6ff",
  };

  const handleTabChange = (tabName) => {
    if (tabName === activeTab || blipPhase !== null) return;

    setActiveTab(tabName);
    setStoneColor(stoneColors[tabName] || "#a872ff");

    // Phase 1 – 'dissolve': clip-path sweeps L→R, particles spawn at front
    setBlipPhase("dissolve");

    // Phase 2 – content fully gone (1100ms dissolve + 50ms buffer)
    // Swap page and start 'reform' fade-in
    setTimeout(() => {
      setDisplayTab(tabName);
      setBlipPhase("reform");
    }, 1150);

    // Phase 3 – reform animation done, cleanup everything
    setTimeout(() => {
      setBlipPhase(null);
    }, 1900);
  };

  return (
    <div className="app">
      {showIntro && (
        <div className={`intro-preloader ${fadeIntro ? "fade-out" : ""}`}>
          <video
            ref={videoRef}
            src={introVideo}
            autoPlay
            muted
            playsInline
            onEnded={handleIntroEnd}
            className="intro-video"
          />
          <div className="intro-controls">
            <button className="intro-btn skip-btn" onClick={handleSkip}>
              SKIP INTRO <span className="arrow">→</span>
            </button>
          </div>
        </div>
      )}

      <video
        autoPlay
        muted
        loop
        playsInline
        className="bg-video"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <div
        ref={pageContainerRef}
        className={`page-container${blipPhase === "dissolve" ? " dissolving" : ""}${blipPhase === "reform" ? " reforming" : ""}`}
      >
        {displayTab === "Home"       && <Hero />}
        {displayTab === "Events"     && <Events />}
        {displayTab === "About Us"   && <AboutUs />}
        {displayTab === "Workshops"  && <Workshops />}
        {displayTab === "Gallery"    && <Gallery />}
        {displayTab === "Sponsors"   && <Sponsors />}
      </div>

      {blipPhase !== null && <BlipParticles color={stoneColor} pageRef={pageContainerRef} />}
    </div>
  );
}

export default App;