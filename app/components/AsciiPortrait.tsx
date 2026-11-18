"use client";

import { useEffect, useRef } from "react";
import { portrait, portraitCols, portraitRamp, portraitRows } from "../data/portrait";

// ---- Tuning -----------------------------------------------------------------
const INTRO_MS = 1400; // scrambled glyphs resolve top to bottom over this time
const RADIUS = 13; // cursor influence radius, in character widths
const PUSH = 2.4; // how hard the cursor shoves glyphs away
const SPRING = 0.06; // pull back to the original spot (higher = stiffer)
const DAMPING = 0.82; // velocity kept per frame (lower = settles faster)
const COLOR = "237, 237, 237"; // --foreground

// Denser glyphs are brighter, so the face reads by tone as well as by shape.
const LEVELS = portraitRamp.length - 1;
const alphaOf = (level: number) => 0.12 + 0.88 * (level / LEVELS) ** 1.6;

type Glyph = {
  col: number;
  row: number;
  level: number; // index into portraitRamp
  settleAt: number; // ms into the intro when it shows its real glyph
  dx: number; // displacement from home, in CSS px
  dy: number;
  vx: number;
  vy: number;
};

function parse(): Glyph[] {
  const glyphs: Glyph[] = [];
  portrait.split("\n").forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      const level = portraitRamp.indexOf(line[col]);
      if (level <= 0) continue;
      glyphs.push({
        col,
        row,
        level,
        settleAt: (row / portraitRows) * INTRO_MS * 0.7 + Math.random() * INTRO_MS * 0.3,
        dx: 0,
        dy: 0,
        vx: 0,
        vy: 0,
      });
    }
  });
  return glyphs;
}

// The portrait from app/data/portrait.ts drawn on a canvas, one glyph at a time.
// Glyphs scramble in on load, scatter away from the cursor and spring back.
export default function AsciiPortrait({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glyphs = parse();
    const font = getComputedStyle(canvas).fontFamily;

    let cw = 0; // character cell width / height in CSS px
    let ch = 0;
    let dpr = 1;
    // Pre-rendered glyphs (one per ramp level, alpha baked in): drawImage is
    // far cheaper than thousands of fillText calls per frame.
    let atlas: HTMLCanvasElement[] = [];

    const layout = () => {
      const width = canvas.clientWidth;
      // Not laid out yet (e.g. first paint on mobile): wait for the ResizeObserver.
      if (width === 0) {
        atlas = [];
        return;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = width / portraitCols;
      ch = cw * 2;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(ch * portraitRows * dpr);

      const w = Math.ceil(cw * dpr * 1.6);
      const h = Math.ceil(ch * dpr);
      atlas = Array.from(portraitRamp, (c, level) => {
        const g = document.createElement("canvas");
        g.width = w;
        g.height = h;
        const gx = g.getContext("2d")!;
        gx.font = `${(cw / 0.6) * dpr}px ${font}`;
        gx.textAlign = "center";
        gx.textBaseline = "middle";
        gx.fillStyle = `rgba(${COLOR}, ${level === 0 ? 0 : alphaOf(level)})`;
        gx.fillText(c, w / 2, h / 2);
        return g;
      });
    };

    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let running = false;
    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      // Nothing to draw with until the canvas has a size; layout() + wake() retry.
      if (atlas.length === 0) {
        running = false;
        return;
      }
      const t = now - start;
      const step = Math.min((now - last) / 16.67, 3); // normalise to 60 fps
      last = now;
      const intro = !reduced && t < INTRO_MS;
      const r = RADIUS * cw;
      let moving = false;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const aw = atlas[1].width;
      const ah = atlas[1].height;

      for (const g of glyphs) {
        const hx = (g.col + 0.5) * cw;
        const hy = (g.row + 0.5) * ch;

        if (pointer.active) {
          const px = hx + g.dx - pointer.x;
          const py = hy + g.dy - pointer.y;
          const d2 = px * px + py * py;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / r) ** 2 * PUSH * step;
            g.vx += (px / d) * f;
            g.vy += (py / d) * f;
          }
        }

        g.vx = (g.vx - g.dx * SPRING * step) * DAMPING ** step;
        g.vy = (g.vy - g.dy * SPRING * step) * DAMPING ** step;
        g.dx += g.vx * step;
        g.dy += g.vy * step;
        if (Math.abs(g.dx) + Math.abs(g.dy) + Math.abs(g.vx) + Math.abs(g.vy) > 0.05) {
          moving = true;
        } else {
          g.dx = g.dy = g.vx = g.vy = 0;
        }

        const level =
          intro && t < g.settleAt ? 1 + ((Math.random() * LEVELS) | 0) : g.level;
        ctx.drawImage(
          atlas[level],
          ((hx + g.dx) * dpr - aw / 2) | 0,
          ((hy + g.dy) * dpr - ah / 2) | 0,
        );
      }

      // Sleep once everything is home and the cursor is gone.
      if (intro || moving || pointer.active) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      wake();
    };
    const onLeave = () => {
      pointer.active = false;
    };
    // Touch has no hover: let go when the finger lifts.
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave();
    };

    layout();
    wake();

    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(canvas);

    if (!reduced) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onMove);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointercancel", onLeave);
      canvas.addEventListener("pointerup", onUp);
    }

    // Repaint once the mono font has loaded, so glyph widths are right.
    document.fonts?.ready.then(() => {
      layout();
      wake();
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="portrait block w-full touch-pan-y font-mono"
      // Each cell is twice as tall as it is wide.
      style={{ aspectRatio: `${portraitCols} / ${portraitRows * 2}` }}
    />
  );
}
