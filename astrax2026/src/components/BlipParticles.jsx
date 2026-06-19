import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────
 *  2D Value Noise — organic disintegration map
 * ────────────────────────────────────────────── */
function hash2D(ix, iy) {
  let h = (ix * 374761393 + iy * 668265263) | 0;
  h = Math.abs(((h ^ (h >> 13)) * 1274126177) | 0);
  return (h & 0x7fffffff) / 0x7fffffff;
}

function valueNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  return (
    (hash2D(ix, iy) * (1 - sx) + hash2D(ix + 1, iy) * sx) * (1 - sy) +
    (hash2D(ix, iy + 1) * (1 - sx) + hash2D(ix + 1, iy + 1) * sx) * sy
  );
}

function fbm(x, y, octaves = 4) {
  let v = 0, a = 1, f = 1, m = 0;
  for (let i = 0; i < octaves; i++) {
    v += valueNoise(x * f, y * f) * a;
    m += a; a *= 0.5; f *= 2;
  }
  return v / m;
}

/* ──────────────────────────────────────────────────────────
 *  BlipParticles — Thanos-snap disintegration
 *
 *  Props:
 *    snapshot    – HTMLCanvasElement from html2canvas
 *    captureRect – { x, y, w, h } element's screen position
 *    onFirstDraw – callback: hides DOM after canvas renders
 *
 *  The canvas draws the snapshot at the EXACT position the
 *  element occupied on screen (using captureRect).  Cells
 *  break in organic patches (fractal noise), turning into
 *  dust that drifts left & upward.
 * ────────────────────────────────────────────────────────── */
function BlipParticles({ phase, snapshot, captureRect, onFirstDraw }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (phase !== "dissolve" || !snapshot || !captureRect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    /* ── Snapshot data ── */
    const sw = snapshot.width, sh = snapshot.height;
    const snapCtx = snapshot.getContext("2d");
    const imgData = snapCtx.getImageData(0, 0, sw, sh);
    const px = imgData.data;

    /* ── Scale: snapshot pixels → screen pixels ──
     *  captureRect.w / sw = how many screen-px per snapshot-px
     *  captureRect.x,y    = element's screen offset              */
    const scX = captureRect.w / sw;
    const scY = captureRect.h / sh;
    const offX = captureRect.x;
    const offY = captureRect.y;

    /* ── Config ── */
    const CELL = 5;
    const DURATION = 1700;
    const TRAIL = 1400;
    const seed = Math.random() * 100;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    /* ── Build cell grid ── */
    const cells = [];
    const particles = [];

    for (let cy = 0; cy < sh; cy += CELL) {
      for (let cx = 0; cx < sw; cx += CELL) {
        const cellW = Math.min(CELL, sw - cx);
        const cellH = Math.min(CELL, sh - cy);

        // Sample average colour + alpha
        let rS = 0, gS = 0, bS = 0, aSum = 0, cnt = 0;
        for (let dy = 0; dy < cellH; dy++) {
          for (let dx = 0; dx < cellW; dx++) {
            const i = ((cy + dy) * sw + (cx + dx)) * 4;
            rS += px[i]; gS += px[i + 1]; bS += px[i + 2];
            aSum += px[i + 3];
            cnt++;
          }
        }

        const avgA = aSum / cnt;
        const avgR = rS / cnt;
        const avgG = gS / cnt;
        const avgB = bS / cnt;

        // Skip transparent cells
        if (avgA < 8) continue;

        // Skip white/bright background artifact cells
        if (avgR > 230 && avgG > 230 && avgB > 230 && avgA > 180) continue;

        // Screen position — mapped through captureRect
        const screenX = offX + cx * scX;
        const screenY = offY + cy * scY;
        const screenW = cellW * scX;
        const screenH = cellH * scY;

        // Skip cells entirely off-screen
        if (screenY + screenH < -10 || screenY > H + 10) continue;
        if (screenX + screenW < -10 || screenX > W + 10) continue;

        const nx = cx / sw, ny = cy / sh;

        // Organic break time via fractal noise
        const n1 = fbm(nx * 4.5 + seed, ny * 4.5 + seed, 4);
        const n2 = fbm(nx * 10 + seed + 3.7, ny * 10 + seed + 3.7, 3);
        const n3 = fbm(nx * 20 + seed + 7.1, ny * 20 + seed + 7.1, 2);

        const breakTime = DURATION * (
          0.28 * n1 +
          0.22 * n2 +
          0.12 * n3 +
          0.18 * Math.random() +
          0.05
        );

        // Sample pixel colours
        const colors = [];
        for (let s = 0; s < 5; s++) {
          const dx = Math.floor(Math.random() * cellW);
          const dy = Math.floor(Math.random() * cellH);
          const i = ((cy + dy) * sw + (cx + dx)) * 4;
          if (px[i + 3] > 8) {
            colors.push({ r: px[i], g: px[i + 1], b: px[i + 2], a: px[i + 3] / 255 });
          }
        }
        if (!colors.length) {
          const i = (cy * sw + cx) * 4;
          colors.push({ r: px[i], g: px[i + 1], b: px[i + 2], a: Math.max(0.1, px[i + 3] / 255) });
        }

        cells.push({
          sx: cx, sy: cy, sw: cellW, sh: cellH,
          x: screenX, y: screenY, w: screenW, h: screenH,
          colors, breakTime, broken: false,
        });
      }
    }

    /* ══════════════ ANIMATION LOOP ══════════════ */
    const t0 = performance.now();
    let animId;
    let firstDrawDone = false;

    const animate = (now) => {
      const elapsed = now - t0;
      ctx.clearRect(0, 0, W, H);

      /* ── Process cells ── */
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];

        // Break cell → spawn dust
        if (!c.broken && elapsed >= c.breakTime) {
          c.broken = true;

          // Mix of chunk and fine-dust particles
          const numP = 4 + Math.floor(Math.random() * 4);
          for (let p = 0; p < numP; p++) {
            const col = c.colors[Math.floor(Math.random() * c.colors.length)];
            const isChunk = p < 2;

            const size = isChunk
              ? c.w * (0.35 + Math.random() * 0.5)
              : c.w * (0.1 + Math.random() * 0.3);

            const angle = Math.PI * 0.82 + (Math.random() - 0.5) * Math.PI * 0.7;
            const speed = isChunk
              ? Math.random() * 2.0 + 1.0
              : Math.random() * 3.5 + 1.5;

            particles.push({
              x: c.x + Math.random() * c.w,
              y: c.y + Math.random() * c.h,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - (Math.random() * 1.0 + 0.3),
              r: col.r, g: col.g, b: col.b,
              size,
              alpha: col.a * (0.55 + Math.random() * 0.45),
              decay: isChunk
                ? 0.002 + Math.random() * 0.003
                : 0.001 + Math.random() * 0.003,
              rotation: Math.random() * Math.PI * 2,
              rotSpd: (Math.random() - 0.5) * 0.18,
              shape: Math.floor(Math.random() * 4),
              turbX: (Math.random() - 0.5) * 0.1,
              turbY: (Math.random() - 0.5) * 0.07,
            });
          }

          // Lingering haze — tiny, long-lasting
          if (Math.random() < 0.35) {
            const col = c.colors[0];
            particles.push({
              x: c.x + c.w * 0.5,
              y: c.y + c.h * 0.5,
              vx: (Math.random() - 0.6) * 0.8,
              vy: -(Math.random() * 0.5 + 0.2),
              r: col.r, g: col.g, b: col.b,
              size: c.w * 0.06,
              alpha: 0.12 + Math.random() * 0.12,
              decay: 0.0004 + Math.random() * 0.0008,
              rotation: 0, rotSpd: 0,
              shape: 0,
              turbX: (Math.random() - 0.5) * 0.04,
              turbY: (Math.random() - 0.5) * 0.03,
            });
          }
        }

        /* ── Draw unbroken cells at their correct screen position ── */
        if (!c.broken) {
          const untilBreak = c.breakTime - elapsed;

          if (untilBreak < 300 && untilBreak > 0) {
            // Crumbling edge — jitter + fade before shattering
            const t = 1 - untilBreak / 300;
            ctx.globalAlpha = 1 - t * 0.5;
            const jx = Math.sin(now * 0.012 + c.sx * 0.7) * t * 2.5;
            const jy = Math.cos(now * 0.014 + c.sy * 0.7) * t * 2.5;
            // Pad width/height slightly to avoid sub-pixel grid seams
            ctx.drawImage(snapshot, c.sx, c.sy, c.sw, c.sh, c.x + jx, c.y + jy, c.w + 0.5, c.h + 0.5);
            ctx.globalAlpha = 1;
          } else {
            // Pad width/height slightly to avoid sub-pixel grid seams
            ctx.drawImage(snapshot, c.sx, c.sy, c.sw, c.sh, c.x, c.y, c.w + 0.5, c.h + 0.5);
          }
        }
      }

      /* ── First frame drawn → tell App.jsx to hide DOM ── */
      if (!firstDrawDone) {
        firstDrawDone = true;
        if (onFirstDraw) onFirstDraw();
      }

      /* ── Update & draw particles ── */
      let anyAlive = false;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const t = now * 0.001;

        // Wind turbulence
        p.vx += Math.sin(p.y * 0.005 + t * 1.1) * 0.055 + p.turbX;
        p.vy += Math.cos(p.x * 0.004 - t * 0.8) * 0.04 + p.turbY;

        // Air resistance
        p.vx *= 0.983;
        p.vy *= 0.983;

        // Wind: leftward + upward
        p.vx -= 0.016;
        p.vy -= 0.01;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpd;
        p.alpha -= p.decay;
        p.size *= 0.994;

        if (p.alpha <= 0 || p.size < 0.1 ||
            p.x < -200 || p.x > W + 200 ||
            p.y < -200 || p.y > H + 200) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;

        const s = p.size;
        switch (p.shape) {
          case 0:
            ctx.fillRect(-s / 2, -s / 2, s, s);
            break;
          case 1:
            ctx.beginPath();
            ctx.moveTo(0, -s / 2);
            ctx.lineTo(s / 2, s / 2);
            ctx.lineTo(-s / 2, s / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case 2:
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.6);
            ctx.lineTo(s * 0.4, 0);
            ctx.lineTo(0, s * 0.6);
            ctx.lineTo(-s * 0.4, 0);
            ctx.closePath();
            ctx.fill();
            break;
          default:
            ctx.beginPath();
            ctx.moveTo(-s * 0.3, -s * 0.5);
            ctx.lineTo(s * 0.45, -s * 0.2);
            ctx.lineTo(s * 0.25, s * 0.45);
            ctx.lineTo(-s * 0.4, s * 0.25);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
        anyAlive = true;
      }

      const anySolid = cells.some((c) => !c.broken);
      if (anyAlive || anySolid || elapsed < DURATION + TRAIL) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [phase, snapshot, captureRect, onFirstDraw]);

  if (phase !== "dissolve") return null;

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
