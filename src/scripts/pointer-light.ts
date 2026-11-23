const bound = new WeakSet<Element>();
const flag = "__pointerLight";

function bindLight(el: HTMLElement) {
  if (bound.has(el)) return;
  bound.add(el);

  el.addEventListener("pointermove", event => {
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--px", `${event.clientX - rect.left}px`);
    el.style.setProperty("--py", `${event.clientY - rect.top}px`);
  });
}

function mountPointerLight() {
  document.querySelectorAll<HTMLElement>(".glass-card, .lit-hit").forEach(bindLight);
}

const windowWithFlag = window as Window & { [flag]?: boolean };
if (!windowWithFlag[flag]) {
  windowWithFlag[flag] = true;
  mountPointerLight();
  document.addEventListener("astro:page-load", mountPointerLight);
}
