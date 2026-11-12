import { useEffect, useRef } from "react";
import { useTheme } from "styled-components";


// Several soft lobes trail the mouse at different speeds and orbit distances,
// so the halftone cloud is spread across the screen but still follows the cursor.
const LOBES = [
  { ease: 0.06, radius: 320, orbit: 0, phase: 0, speed: 0 },
  { ease: 0.03, radius: 260, orbit: 260, phase: 0, speed: 0.4 },
  { ease: 0.02, radius: 240, orbit: 420, phase: 2.1, speed: -0.3 },
  { ease: 0.012, radius: 280, orbit: 560, phase: 4.2, speed: 0.25 },
  { ease: 0.008, radius: 220, orbit: 340, phase: 5.3, speed: -0.5 },
];

function HalftoneBlob() {
  const canvasRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    // coarser grid on small screens keeps it light on phones
    const SPACING = window.innerWidth < 768 ? 13 : 9;
    const MAX_DOT = SPACING * 0.42;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lobes = LOBES.map((l) => ({ ...l, x: target.x, y: target.y }));
    let raf;
    let t = 0;

    const resize = () => {
      const dpr = 1; // the canvas is blurred anyway, so skip hi-dpi cost
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const draw = () => {
      t += 0.012;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = theme.accent;

      // move each lobe toward a point orbiting the mouse
      for (const l of lobes) {
        const a = l.phase + t * l.speed * 2;
        const tx = target.x + Math.cos(a) * l.orbit;
        const ty = target.y + Math.sin(a) * l.orbit;
        l.x += (tx - l.x) * l.ease;
        l.y += (ty - l.y) * l.ease;
      }

      const cols = Math.ceil(w / SPACING);
      const rows = Math.ceil(h / SPACING);
      for (let j = 0; j <= rows; j++) {
        const y = j * SPACING;
        for (let i = 0; i <= cols; i++) {
          const x = i * SPACING + (j % 2 ? SPACING / 2 : 0);
          let v = 0;
          for (const l of lobes) {
            const d = Math.hypot(x - l.x, y - l.y) / l.radius;
            if (d < 1) v += (1 - d * d) * (1 - d * d);
          }
          const size = MAX_DOT * Math.min(v, 1) * 0.9;
          if (size < 0.4) continue;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    const onTouch = (e) => {
      if (e.touches[0]) {
        target.x = e.touches[0].clientX;
        target.y = e.touches[0].clientY;
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [theme.accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0.3,
        filter: "blur(1.5px)",
      }}
    />
  );
}

export default HalftoneBlob;
