import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
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

  const snapshotRef = useRef(null);
  const captureRectRef = useRef(null);
  const busy = useRef(false);

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

  /* Called by BlipParticles after its FIRST canvas draw.
     Only NOW do we hide the DOM — so the switch is seamless. */
  const handleFirstDraw = useCallback(() => {
    if (pageContainerRef.current) {
      pageContainerRef.current.style.opacity = "0";
      pageContainerRef.current.style.transition = "none";
    }
  }, []);

  const handleTabChange = async (tabName) => {
    if (tabName === activeTab || blipPhase !== null || busy.current) return;
    busy.current = true;

    /* ── 1. Record the element's EXACT screen position ── */
    const rect = pageContainerRef.current.getBoundingClientRect();
    captureRectRef.current = {
      x: rect.left,
      y: rect.top,
      w: rect.width,
      h: rect.height,
    };

    /* ── 2. Capture current content BEFORE any state changes ── */
    /* Inject a temp style to disable backdrop-filters and shadows —
       html2canvas notoriously renders backdrop-filters as solid white boxes. */
    const tempStyle = document.createElement("style");
    tempStyle.textContent =
      ".page-container, .page-container * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; }";
    document.head.appendChild(tempStyle);

    try {
      snapshotRef.current = await html2canvas(pageContainerRef.current, {
        backgroundColor: null,
        scale: 0.5,
        logging: false,
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
      });
    } catch {
      tempStyle.remove();
      busy.current = false;
      setActiveTab(tabName);
      setDisplayTab(tabName);
      setStoneColor(stoneColors[tabName] || "#a872ff");
      return;
    }
    tempStyle.remove();

    /* ── 3. Update state — BlipParticles mounts, draws first frame,
            THEN calls handleFirstDraw to hide the DOM. ── */
    setActiveTab(tabName);
    setStoneColor(stoneColors[tabName] || "#a872ff");
    setBlipPhase("dissolve");

    /* ── 4. After dissolve → swap content + reform ── */
    setTimeout(() => {
      if (pageContainerRef.current) {
        pageContainerRef.current.style.opacity = "";
        pageContainerRef.current.style.transition = "";
      }
      setDisplayTab(tabName);
      setBlipPhase("reform");
    }, 2200);

    /* ── 5. Cleanup ── */
    setTimeout(() => {
      setBlipPhase(null);
      snapshotRef.current = null;
      captureRectRef.current = null;
      busy.current = false;
    }, 3100);
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

      {blipPhase === "dissolve" && snapshotRef.current && (
        <BlipParticles
          key={"dissolve-" + activeTab}
          phase="dissolve"
          snapshot={snapshotRef.current}
          captureRect={captureRectRef.current}
          onFirstDraw={handleFirstDraw}
        />
      )}
    </div>
  );
}

export default App;