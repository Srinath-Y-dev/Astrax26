import { useState, useEffect } from "react";
import "../styles/Countdown.css";

const EVENT_DATE = new Date("2026-07-20T09:00:00");

function Countdown() {

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {

    const timer = setInterval(() => {

      const now = new Date();

      const difference = EVENT_DATE - now;

      if (difference > 0) {

        const days = Math.floor(
          difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
          (difference / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
          (difference / 1000) % 60
        );

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
        });

      }

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  return (
    <div className="countdown">

      <div className="countdown-card">
        <h2>{timeLeft.days}</h2>
        <span>DAYS</span>
      </div>

      <h3 className="countdown-separator">:</h3>

      <div className="countdown-card">
        <h2>{String(timeLeft.hours).padStart(2, "0")}</h2>
        <span>HOURS</span>
      </div>

      <h3 className="countdown-separator">:</h3>

      <div className="countdown-card">
        <h2>{String(timeLeft.minutes).padStart(2, "0")}</h2>
        <span>MINUTES</span>
      </div>

      <h3 className="countdown-separator">:</h3>

      <div className="countdown-card">
        <h2>{String(timeLeft.seconds).padStart(2, "0")}</h2>
        <span>SECONDS</span>
      </div>

    </div>
  );
}

export default Countdown;