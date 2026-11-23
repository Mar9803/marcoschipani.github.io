import { Delaunay } from "d3-delaunay";

type Ink = {
  dot: string;
  warm: string;
  leader: string;
  halo: string;
  line: string;
  cell: string;
};

type Site = {
  x: number;
  y: number;
  hx: number;
  hy: number;
  phase: number;
};

let stopCurrent = () => {};

function prefersStill() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ink(): Ink {
  const dark = document.documentElement.dataset.theme !== "light";
  if (dark) {
    return {
      dot: "rgba(214, 226, 238, 0.55)",
      warm: "rgba(214, 168, 92, 0.72)",
      leader: "rgba(236, 242, 248, 0.95)",
      halo: "rgba(186, 204, 224, 0.09)",
      line: "rgba(186, 204, 224, 0.32)",
      cell: "rgba(186, 204, 224, 0.16)",
    };
  }
  return {
    dot: "rgba(36, 44, 58, 0.38)",
    warm: "rgba(0, 108, 172, 0.5)",
    leader: "rgba(24, 32, 44, 0.85)",
    halo: "rgba(36, 44, 58, 0.06)",
    line: "rgba(36, 44, 58, 0.22)",
    cell: "rgba(0, 108, 172, 0.08)",
  };
}

function sizeOf(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = document.documentElement.clientWidth;
  const h = window.innerHeight;
  canvas.width = Math.max(1, Math.floor(w * dpr));
  canvas.height = Math.max(1, Math.floor(h * dpr));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, ctx };
}

function mount() {
  stopCurrent();
  stopCurrent = () => {};
  const canvas = document.querySelector<HTMLCanvasElement>("canvas[data-ambient]");
  if (!canvas) return;
  stopCurrent =
    canvas.dataset.ambient === "voronoi" ? startVoronoi(canvas) : startDrift(canvas);
}

function startDrift(canvas: HTMLCanvasElement) {
  const sized = sizeOf(canvas);
  if (!sized) return () => {};
  let { w, h, ctx } = sized;
  const count = w < 768 ? 32 : 64;
  const particles = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    warm: i > 0 && i % 7 === 0,
    r: i === 0 ? 2.5 : 0.8 + Math.random() * 0.9,
  }));
  let pointer: { x: number; y: number } | null = null;
  let frame = 0;
  let alive = true;
  let running = false;

  const draw = () => {
    const colors = ink();
    const still = prefersStill();
    const leader = particles[0];
    if (!leader) return;

    if (pointer) {
      leader.x += (pointer.x - leader.x) * 0.08;
      leader.y += (pointer.y - leader.y) * 0.08;
    } else if (!still) {
      leader.x += leader.vx;
      leader.y += leader.vy;
    }

    for (let i = still ? 1 : 0; i < particles.length; i++) {
      if (i === 0) continue;
      const p = particles[i];
      if (!p || still) continue;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      if (p.y < -4) p.y = h + 4;
      if (p.y > h + 4) p.y = -4;
    }
    if (!pointer && !still) {
      if (leader.x < -4) leader.x = w + 4;
      if (leader.x > w + 4) leader.x = -4;
      if (leader.y < -4) leader.y = h + 4;
      if (leader.y > h + 4) leader.y = -4;
    }

    ctx.clearRect(0, 0, w, h);
    if (pointer) {
      ctx.beginPath();
      ctx.fillStyle = colors.halo;
      ctx.arc(leader.x, leader.y, 26, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = p === leader ? colors.leader : p.warm ? colors.warm : colors.dot;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const loop = () => {
    if (!alive || !canvas.isConnected) {
      running = false;
      return;
    }
    if (document.hidden) {
      running = false;
      return;
    }
    draw();
    const leader = particles[0];
    const settled =
      prefersStill() &&
      (!pointer || !leader || Math.hypot(pointer.x - leader.x, pointer.y - leader.y) < 0.8);
    if (settled) {
      running = false;
      return;
    }
    frame = requestAnimationFrame(loop);
  };

  const kick = () => {
    if (!alive || running) return;
    running = true;
    frame = requestAnimationFrame(loop);
  };

  const onPointer = (event: PointerEvent) => {
    pointer = { x: event.clientX, y: event.clientY };
    kick();
  };
  const onLeave = () => {
    pointer = null;
    kick();
  };
  const onResize = () => {
    const next = sizeOf(canvas);
    if (!next) return;
    const sx = next.w / Math.max(w, 1);
    const sy = next.h / Math.max(h, 1);
    w = next.w;
    h = next.h;
    ctx = next.ctx;
    for (const p of particles) {
      p.x *= sx;
      p.y *= sy;
    }
    draw();
  };
  const onVis = () => {
    if (!document.hidden) kick();
  };

  window.addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVis);
  draw();
  if (!prefersStill()) kick();

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onPointer);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVis);
  };
}

function startVoronoi(canvas: HTMLCanvasElement) {
  const sized = sizeOf(canvas);
  if (!sized) return () => {};
  let { w, h, ctx } = sized;
  const count = w < 768 ? 16 : 32;

  const place = (width: number, height: number): Site[] =>
    Array.from({ length: count }, () => {
      const x = (0.06 + Math.random() * 0.88) * width;
      const y = (0.08 + Math.random() * 0.84) * height;
      return { x, y, hx: x, hy: y, phase: Math.random() * Math.PI * 2 };
    });

  let sites = place(w, h);
  let pointer: { x: number; y: number } | null = null;
  let frame = 0;
  let alive = true;
  let running = false;

  const draw = (time: number) => {
    const colors = ink();
    const still = prefersStill();
    const t = time / 1000;
    const leader = sites[0];
    if (!leader) return;

    if (pointer) {
      leader.x += (pointer.x - leader.x) * 0.12;
      leader.y += (pointer.y - leader.y) * 0.12;
    } else if (!still) {
      leader.x = leader.hx + Math.sin(t * 0.15 + leader.phase) * 16;
      leader.y = leader.hy + Math.cos(t * 0.12 + leader.phase) * 12;
    }

    if (!still) {
      for (let i = 1; i < sites.length; i++) {
        const site = sites[i];
        if (!site) continue;
        site.x = site.hx + Math.sin(t * 0.15 + site.phase) * 16;
        site.y = site.hy + Math.cos(t * 0.12 + site.phase) * 12;
      }
    }

    const delaunay = Delaunay.from(sites.map(site => [site.x, site.y]));
    const voronoi = delaunay.voronoi([0, 0, w, h]);
    ctx.clearRect(0, 0, w, h);

    if (pointer) {
      const cell = delaunay.find(pointer.x, pointer.y);
      if (cell >= 0) {
        ctx.beginPath();
        voronoi.renderCell(cell, ctx);
        ctx.fillStyle = colors.cell;
        ctx.fill();
      }
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.line;
    voronoi.render(ctx);
    ctx.stroke();

    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];
      if (!site) continue;
      ctx.beginPath();
      ctx.fillStyle = i === 0 ? colors.leader : colors.dot;
      ctx.arc(site.x, site.y, i === 0 ? 2.6 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const loop = (time: number) => {
    if (!alive || !canvas.isConnected) {
      running = false;
      return;
    }
    if (document.hidden) {
      running = false;
      return;
    }
    draw(time);
    const leader = sites[0];
    const settled =
      prefersStill() &&
      (!pointer || !leader || Math.hypot(pointer.x - leader.x, pointer.y - leader.y) < 0.8);
    if (settled) {
      running = false;
      return;
    }
    frame = requestAnimationFrame(loop);
  };

  const kick = () => {
    if (!alive || running) return;
    running = true;
    frame = requestAnimationFrame(loop);
  };

  const onPointer = (event: PointerEvent) => {
    pointer = { x: event.clientX, y: event.clientY };
    kick();
  };
  const onLeave = () => {
    pointer = null;
    kick();
  };
  const onResize = () => {
    const next = sizeOf(canvas);
    if (!next) return;
    w = next.w;
    h = next.h;
    ctx = next.ctx;
    sites = place(w, h);
    draw(performance.now());
  };
  const onVis = () => {
    if (!document.hidden) kick();
  };

  window.addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVis);
  draw(performance.now());
  if (!prefersStill()) kick();

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onPointer);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVis);
  };
}

mount();

const windowWithFlag = window as Window & { __ambientField?: boolean };
if (!windowWithFlag.__ambientField) {
  windowWithFlag.__ambientField = true;
  document.addEventListener("astro:page-load", mount);
  document.addEventListener("astro:before-swap", () => {
    stopCurrent();
    stopCurrent = () => {};
  });
}
