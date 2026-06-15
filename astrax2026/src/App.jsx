import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

import bgVideo from "./assets/hero-video.mp4";

function App() {
  return (
    <div className="app">

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

      <Navbar />

      <Hero />

    </div>
  );
}

export default App;