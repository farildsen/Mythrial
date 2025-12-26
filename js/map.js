const svg = document.getElementById('map');
let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let startX, startY;

svg.addEventListener('wheel', e => {
  e.preventDefault();
  const zoomAmount = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= zoomAmount;
  svg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
});

svg.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX - originX;
  startY = e.clientY - originY;
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  originX = e.clientX - startX;
  originY = e.clientY - startY;
  svg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});