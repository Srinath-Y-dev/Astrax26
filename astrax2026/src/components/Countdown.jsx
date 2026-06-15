import { useState, useEffect } from "react";
import "../styles/Countdown.css";

function Countdown() {

  const eventDate = new Date("2026-07-20T09:00:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {

    const timer = setInterval(() => {

      const now = new Date();

      const difference = eventDate - now;

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

      <div>
        <h2>{timeLeft.days}</h2>
        <span>DAYS</span>
      </div>

      <h3>:</h3>

      <div>
        <h2>{String(timeLeft.hours).padStart(2, "0")}</h2>
        <span>HOURS</span>
      </div>

      <h3>:</h3>

      <div>
        <h2>{String(timeLeft.minutes).padStart(2, "0")}</h2>
        <span>MINUTES</span>
      </div>

      <h3>:</h3>

      <div>
        <h2>{String(timeLeft.seconds).padStart(2, "0")}</h2>
        <span>SECONDS</span>
      </div>

    </div>
  );
}

export default Countdown;