import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./styles/Pages.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";
import AboutUs from "./components/AboutUs";
import Workshops from "./components/Workshops";
import Gallery from "./components/Gallery";
import Sponsors from "./components/Sponsors";

import bgVideo from "./assets/hero.mp4";
import introVideo from "./assets/intro.mp4";

function App() {
  const [lowPerf, setLowPerf] = useState(() => {
    const saved = localStorage.getItem("low-perf") === "true";
    window.lowPerfMode = saved;
    return saved;
  });

  const [showIntro, setShowIntro] = useState(() => {
    const savedLowPerf = localStorage.getItem("low-perf") === "true";
    return !savedLowPerf;
  });

  const [fadeIntro, setFadeIntro] = useState(false);
  const videoRef = useRef(null);

  const [activeTab, setActiveTab] = useState("Home");
  const [hideNavbarOverride, setHideNavbarOverride] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeTab === "Home") {
      document.documentElement.classList.add("home-active");
      document.body.classList.add("home-active");
    } else {
      document.documentElement.classList.remove("home-active");
      document.body.classList.remove("home-active");
    }
  }, [activeTab]);

  useEffect(() => {
    if (lowPerf) {
      document.body.classList.add("low-perf");
    } else {
      document.body.classList.remove("low-perf");
    }
  }, [lowPerf]);

  const toggleLowPerf = () => {
    const newVal = !lowPerf;
    setLowPerf(newVal);
    window.lowPerfMode = newVal;
    localStorage.setItem("low-perf", String(newVal));
    window.dispatchEvent(new Event("lowPerfChanged"));
  };

  const handleIntroEnd = () => {
    setFadeIntro(true);
    setTimeout(() => setShowIntro(false), 800);
  };

  const handleSkip = () => handleIntroEnd();

  const handleTabChange = (tabName) => {
    setHideNavbarOverride(false);
    if (tabName === activeTab) return;
    setActiveTab(tabName);
  };

  return (
    <div className="app">
      {showIntro && !lowPerf && (
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

      {activeTab === "Home" && !lowPerf && (
        <>
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
        </>
      )}

      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        lowPerf={lowPerf} 
        toggleLowPerf={toggleLowPerf} 
        forceHidden={hideNavbarOverride}
      />

      <div className="page-container">
        {activeTab === "Home"      && <Hero onTabChange={handleTabChange} />}
        {activeTab === "Events"    && <Events />}
        {activeTab === "About Us"  && <AboutUs />}
        {activeTab === "Workshops" && (
          <Workshops 
            setActivePage={(page) => handleTabChange(page)} 
            onToggleExpand={(isExpanded) => setHideNavbarOverride(isExpanded)}
          />
        )}
        {activeTab === "Gallery"   && <Gallery />}
        {activeTab === "Sponsors"  && <Sponsors />}
      </div>
    </div>
  );
}

export default App;