import { useEffect, useRef } from "react";

function BlipParticles({ color, pageRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const hexToRgb = (hex) => {
      const c = hex.replace("#", "");
      return {
        r: parseInt(c.slice(0, 2), 16),
        g: parseInt(c.slice(2, 4), 16),
        b: parseInt(c.slice(4, 6), 16),
      };
    };
    const rgb = hexToRgb(color);

    const variant = (alpha = 1) => {
      const v = () => Math.floor(Math.random() * 80 - 40);
      return `rgba(${Math.min(255, Math.max(0, rgb.r + v()))},${Math.min(255, Math.max(0, rgb.g + v()))},${Math.min(255, Math.max(0, rgb.b + v()))},${alpha})`;
    };

    class Particle {
      constructor(x, y) {
        // Organic position deviation around the front line
        this.x = x + (Math.random() - 0.5) * 15;
        this.y = y + (Math.random() - 0.5) * 10;

        this.shape = Math.floor(Math.random() * 3);
        this.size  = Math.random() * 4.2 + 0.6;

        // Upward float with gentle leftward drag/drift
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
        const speed = Math.random() * 2.8 + 0.8;
        this.vx = Math.cos(angle) * speed - (Math.random() * 0.8 + 0.3); // drag backwards
        this.vy = Math.sin(angle) * speed - 0.4; // upward boost

        this.turbX = (Math.random() - 0.5) * 0.08;
        this.turbY = (Math.random() - 0.5) * 0.05;

        this.rotation      = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.16;

        this.alpha = Math.random() * 0.6 + 0.4;
        
        // Balanced decay for smooth floating trail
        this.decay = Math.random() * 0.009 + 0.005;

        // 35% dark ash/charcoal particles, 65% glowing colored embers
        if (Math.random() < 0.35) {
          const ashVal = Math.floor(Math.random() * 40 + 35);
          this.color = `rgba(${ashVal},${ashVal},${ashVal},${this.alpha})`;
          this.isAsh = true;
        } else {
          this.color = variant(this.alpha);
          this.isAsh = false;
        }

        this.done = false;
      }

      update() {
        this.vx += this.turbX;
        this.vy += this.turbY;
        this.vx -= 0.015; // drag/drift to the left
        this.vy -= 0.018; // float upwards
        this.x  += this.vx;
        this.y  += this.vy;

        this.rotation += this.rotationSpeed;
        this.alpha    -= this.decay;
        this.size     *= 0.995;

        if (
          this.alpha <= 0 ||
          this.y < -50 || this.x < -50 ||
          this.x > width + 50 || this.y > height + 50
        ) this.done = true;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.isAsh) {
          ctx.shadowBlur  = 2;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.fillStyle   = this.color;
        } else {
          ctx.shadowBlur  = Math.random() * 6 + 4;
          ctx.shadowColor = color;
          ctx.fillStyle   = this.color;
        }

        if (this.shape === 0) {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 0.65);
          ctx.lineTo(this.size * 0.45, 0);
          ctx.lineTo(0, this.size * 0.65);
          ctx.lineTo(-this.size * 0.45, 0);
          ctx.closePath();
          ctx.fill();
        }

        if (!this.isAsh) {
          ctx.shadowBlur  = 0;
          ctx.globalAlpha = this.alpha * 0.25;
          ctx.fillStyle   = "#ffffff";
          ctx.beginPath();
          ctx.arc(-this.size * 0.1, -this.size * 0.1, this.size * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const WAVE_DURATION = 1100; // Smooth 1100ms duration
    const TRAIL_EXTRA   = 800;
    const startTime     = performance.now();
    const particles     = [];
    let animationId;
    const pageEl = pageRef?.current ?? null;

    const animate = (now) => {
      const elapsed   = now - startTime;
      const progress  = Math.min(1, elapsed / WAVE_DURATION);

      // Sweep coordinate (straight line)
      const waveFront = progress * (width + 120) - 60;

      // Update the CSS mask-image custom property on the page element
      if (pageEl && elapsed < WAVE_DURATION + 50) {
        const pct = Math.min(100, progress * 100);
        pageEl.style.setProperty("--dissolve-pct", `${pct.toFixed(1)}%`);
      }

      ctx.clearRect(0, 0, width, height);

      // Spawn particles along the straight vertical line sweep
      if (elapsed < WAVE_DURATION + 50) {
        const BAND    = 40;
        const DENSITY = 22; // dense fine dust
        for (let i = 0; i < DENSITY; i++) {
          const px = waveFront - Math.random() * BAND;
          const py = Math.random() * height;
          if (px >= 0 && px <= width) {
            particles.push(new Particle(px, py));
          }
        }

        // Sparse trailing dust behind the front
        for (let i = 0; i < 4; i++) {
          if (Math.random() < 0.5) {
            const tx = waveFront - 40 - Math.random() * 120;
            const ty = Math.random() * height;
            if (tx >= 0 && tx <= width) {
              const tp = new Particle(tx, ty);
              tp.decay *= 1.4;
              tp.size  *= 0.6;
              tp.alpha *= 0.6;
              particles.push(tp);
            }
          }
        }
      }

      // Update & draw active particles
      let anyAlive = false;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.done) particles.splice(i, 1);
        else anyAlive = true;
      }

      if (anyAlive || elapsed < WAVE_DURATION + TRAIL_EXTRA) {
        animationId = requestAnimationFrame(animate);
      } else if (pageEl) {
        pageEl.style.removeProperty("--dissolve-pct");
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (pageEl) pageEl.style.removeProperty("--dissolve-pct");
    };
  }, [color, pageRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

export default BlipParticles;
