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
  const field = document.querySelector<HTMLElement>("[data-ambient]");
  if (!field) return;
  if (field.dataset.ambient === "voronoi" && field instanceof HTMLCanvasElement) {
    stopCurrent = startVoronoi(field);
    return;
  }
  if (field.dataset.ambient === "birds") stopCurrent = startVantaBirds(field);
}

type VantaEffect = {
  destroy: () => void;
  setOptions: (options: Record<string, unknown>) => void;
};

function resolveBirds(mod: unknown) {
  let current = mod;
  for (let depth = 0; depth < 3; depth++) {
    if (typeof current === "function") {
      return current as (options: Record<string, unknown>) => VantaEffect;
    }
    if (current && typeof current === "object" && "default" in current) {
      current = (current as { default: unknown }).default;
      continue;
    }
    break;
  }
  return null;
}

function birdSettings() {
  const dark = document.documentElement.dataset.theme !== "light";
  return {
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200,
    minWidth: 200,
    scale: 1,
    scaleMobile: 1,
    backgroundColor: dark ? 0x07192f : 0xfdfdfd,
    backgroundAlpha: 1,
    color1: 0xff0000,
    color2: 0x00d1ff,
    colorMode: "varianceGradient",
    quantity: 3,
    birdSize: 1,
    wingSpan: 30,
    speedLimit: 2,
    separation: 8,
    alignment: 87,
    cohesion: 20,
  };
}

function startVantaBirds(el: HTMLElement) {
  if (prefersStill()) return () => {};
  let effect: VantaEffect | null = null;
  let observer: MutationObserver | null = null;
  let cancelled = false;

  void (async () => {
    const [THREE, birdsMod] = await Promise.all([
      import("three"),
      import("vanta/dist/vanta.birds.min"),
    ]);
    if (cancelled || !el.isConnected) return;
    const factory = resolveBirds(birdsMod);
    if (!factory) return;
    effect = factory({ el, THREE, ...birdSettings() });
    if (!effect?.destroy) return;
    const current = effect;
    observer = new MutationObserver(() => current.setOptions(birdSettings()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  })();

  return () => {
    cancelled = true;
    observer?.disconnect();
    effect?.destroy();
    effect = null;
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
