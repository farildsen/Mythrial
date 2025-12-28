document.querySelectorAll(".pan-zoom-svg").forEach(svg => {

  const vb = svg.viewBox.baseVal;
  const bounds = { x: vb.x, y: vb.y, w: vb.width, h: vb.height };
  let viewBox = { ...bounds };

  let isPanning = false;
  let start = { x: 0, y: 0 };

  function getSize() {
    const r = svg.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function clamp() {
    if (viewBox.w < bounds.w) {
      viewBox.x = Math.max(bounds.x, Math.min(viewBox.x, bounds.x + bounds.w - viewBox.w));
    } else {
      viewBox.x = bounds.x + (bounds.w - viewBox.w) / 2;
    }

    if (viewBox.h < bounds.h) {
      viewBox.y = Math.max(bounds.y, Math.min(viewBox.y, bounds.y + bounds.h - viewBox.h));
    } else {
      viewBox.y = bounds.y + (bounds.h - viewBox.h) / 2;
    }
  }

  window.addEventListener("mouseup", () => {
    isPanning = false;
    svg.style.cursor = "default";
  });

  svg.addEventListener("mousedown", e => {
    isPanning = true;
    start = { x: e.clientX, y: e.clientY };
    svg.style.cursor = "grabbing";
  });

  svg.addEventListener("mousemove", e => {
    if (!isPanning) return;

    const { w, h } = getSize();
    viewBox.x += (start.x - e.clientX) * (viewBox.w / w);
    viewBox.y += (start.y - e.clientY) * (viewBox.h / h);

    clamp();
    start = { x: e.clientX, y: e.clientY };
    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
  });

  svg.addEventListener("mouseup", () => svg.style.cursor = "default");
  svg.addEventListener("mouseleave", () => isPanning = false);

  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const { w, h } = getSize();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;

    const mx = e.offsetX / w;
    const my = e.offsetY / h;

    viewBox.x += viewBox.w * (mx - mx * scale);
    viewBox.y += viewBox.h * (my - my * scale);
    viewBox.w *= scale;
    viewBox.h *= scale;

    clamp();
    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
  }, { passive: false });
});
