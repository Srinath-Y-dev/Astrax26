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
        this.y = y + (Math.random() - 0.5) * 15;

        // Dust particles are small, sharp, and fine
        this.shape = Math.floor(Math.random() * 3);
        this.size  = Math.random() * 2.5 + 0.5;

        // Initial velocity with a spread, floating upward and backward (left)
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
        const speed = Math.random() * 4.0 + 1.5; // Slightly faster to blow away like dust
        this.vx = Math.cos(angle) * speed - (Math.random() * 0.8 + 0.4); 
        this.vy = Math.sin(angle) * speed - 0.5; 

        // Random internal turbulence factor
        this.turbX = (Math.random() - 0.5) * 0.15;
        this.turbY = (Math.random() - 0.5) * 0.10;

        this.rotation      = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;

        this.alpha = Math.random() * 0.6 + 0.4;
        
        // Decay rate (lifespan) - fade slightly faster
        this.decay = Math.random() * 0.01 + 0.005;

        // 75% dark tinted dust, 25% glowing colored embers
        if (Math.random() < 0.75) {
          // Tinted dark dust based on the tab's stone color
          const tintR = Math.floor(rgb.r * 0.4 + Math.random() * 20 - 10);
          const tintG = Math.floor(rgb.g * 0.4 + Math.random() * 20 - 10);
          const tintB = Math.floor(rgb.b * 0.4 + Math.random() * 20 - 10);
          this.color = `rgba(${Math.max(0, Math.min(255, tintR))},${Math.max(0, Math.min(255, tintG))},${Math.max(0, Math.min(255, tintB))},${this.alpha})`;
          this.isAsh = true;
        } else {
          this.color = variant(this.alpha);
          this.isAsh = false;
        }

        this.done = false;
      }

      update(now) {
        // Wind vector field (turbulence)
        // Multi-frequency sine waves based on time and space to simulate swirling gusts
        const timeScale = now * 0.0015;
        const windScale = 0.004;
        const windX = Math.sin(this.y * windScale + timeScale + this.rotation) * 0.15;
        const windY = Math.cos(this.x * windScale - timeScale) * 0.10;

        this.vx += windX + this.turbX;
        this.vy += windY + this.turbY;

        // Damping/air resistance
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Apply a gentle leftward draft (since wave moves left-to-right, dust blows back)
        this.vx -= 0.02;
        // Upward float
        this.vy -= 0.02;

        this.x += this.vx;
        this.y += this.vy;

        this.rotation += this.rotationSpeed;
        this.alpha    -= this.decay;
        this.size     *= 0.98; // shrink slightly to look like vanishing dust

        if (
          this.alpha <= 0 ||
          this.size <= 0.1 ||
          this.y < -50 || this.x < -50 ||
          this.x > width + 50 || this.y > height + 50
        ) {
          this.done = true;
        }
      }

      draw() {
        if (this.alpha <= 0 || this.size <= 0.1) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.isAsh) {
          // Flat colored dark ash/dust particle
          ctx.fillStyle = this.color;
          if (this.shape === 0) {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          } else if (this.shape === 1) {
            // Draw a tiny triangle instead of a circle for sharper dust
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.fill();
          } else {
            // Diamond
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.65);
            ctx.lineTo(this.size * 0.45, 0);
            ctx.lineTo(0, this.size * 0.65);
            ctx.lineTo(-this.size * 0.45, 0);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          // Glowing embers: Draw sharp tiny embers instead of large soft bubbles
          ctx.globalCompositeOperation = "screen";

          // Just a single small solid core with slightly colored tint
          ctx.fillStyle = this.color;
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(-this.size * 0.3, -this.size * 0.3, this.size * 0.6, this.size * 0.6);
        }

        ctx.restore();
      }
    }

    const WAVE_DURATION = 1100; // 1100ms dissolve
    const TRAIL_EXTRA   = 800;  // Extra time for remaining dust to fade
    const startTime     = performance.now();
    const particles     = [];
    let animationId;
    const pageEl = pageRef?.current ?? null;

    // Define wavefront coordinate wiggling function
    const getWavefrontX = (y, elapsed) => {
      const baseProgress = Math.min(1, elapsed / WAVE_DURATION);
      const baseWaveFront = baseProgress * (width + 160) - 80;
      
      // Jagged wave offset based on Y-coordinate and time
      const wiggle = Math.sin(y * 0.005 + elapsed * 0.001) * 45 + 
                     Math.sin(y * 0.02) * 15;
      
      return baseWaveFront + wiggle;
    };

    const animate = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(1, elapsed / WAVE_DURATION);

      // Update the CSS mask-image custom property on the page element
      if (pageEl && elapsed < WAVE_DURATION + 50) {
        const pct = -15 + progress * 130;
        pageEl.style.setProperty("--dissolve-pct", `${pct.toFixed(1)}%`);
      }

      ctx.clearRect(0, 0, width, height);

      // Spawn particles along the jagged vertical wavefront
      if (elapsed < WAVE_DURATION + 50) {
        const BAND = 45;
        const DENSITY = 80; // INCREASED DENSITY for thicker dust cloud
        for (let i = 0; i < DENSITY; i++) {
          const py = Math.random() * height;
          const wX = getWavefrontX(py, elapsed);
          
          // Spawn slightly clustered around and behind the wiggling wavefront
          const px = wX - Math.pow(Math.random(), 1.5) * BAND;

          if (px >= 0 && px <= width) {
            particles.push(new Particle(px, py));
          }
        }

        // A cloud of extremely fine micro-dust trailing behind to give a powdery vanishing effect
        for (let i = 0; i < 60; i++) {
          if (Math.random() < 0.9) {
            const py = Math.random() * height;
            const wX = getWavefrontX(py, elapsed);
            const tx = wX - Math.random() * 300; // Wide trail
            if (tx >= 0 && tx <= width) {
              const tp = new Particle(tx, py);
              tp.decay *= 0.3; // linger much longer in the air (slower fade)
              tp.size  = Math.random() * 2.0 + 0.5; // Slightly larger for better visibility
              tp.alpha = Math.random() * 0.6 + 0.3; // Higher opacity to be more visible
              
              // Bright fine dust matching the tab's stone color
              const v = Math.floor(Math.random() * 60 - 30);
              const r = Math.min(255, Math.max(0, rgb.r + v + 20));
              const g = Math.min(255, Math.max(0, rgb.g + v + 20));
              const b = Math.min(255, Math.max(0, rgb.b + v + 20));
              tp.color = `rgba(${r},${g},${b},${tp.alpha})`;
              tp.isAsh = true;
              tp.shape = 0; // simple squares for tiny dust to render fast
              
              // More turbulent wind for fine dust
              tp.turbX *= 2.5;
              tp.turbY *= 2.5;
              
              particles.push(tp);
            }
          }
        }
      }

      // Update & draw active particles
      let anyAlive = false;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update(now);
        p.draw();
        if (p.done) {
          particles.splice(i, 1);
        } else {
          anyAlive = true;
        }
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
