const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let drawMode = false;
let updateCanvas = false;
const points = [];
const brushSize = 10;

function initCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.fill();
  points.length = 0;
}

function draw(event) {
  if (drawMode) {
    const point = {
      coords: [event.offsetX, event.offsetY],
      brushSize: brushSize
    };
    points.push(point);
    updateCanvas = true;
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.fill();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  let prevPoint = points[0];
  ctx.moveTo(...prevPoint.coords);
  for (const point of points) {
    if (prevPoint.lineEnd) {
      ctx.moveTo(...point.coords);
    } else {
      ctx.beginPath();
      ctx.lineWidth = point.brushSize;
      ctx.strokeStyle = `hsl(50, 100%, 50%)`;
      ctx.quadraticCurveTo(...prevPoint.coords, ...point.coords);
      ctx.stroke();
    }
    prevPoint = point;
  }
}

function tick() {
  if (updateCanvas) {
    update();
    updateCanvas = false;
  }
  window.requestAnimationFrame(tick);
}

function toggle() {
  drawMode = (event.type === 'mousedown');
  if (event.type === 'mouseup') {
    points[points.length - 1].lineEnd = true;
  }
}

initCanvas();

canvas.addEventListener('dblclick', initCanvas);
window.addEventListener('resize', initCanvas);

canvas.addEventListener('mousedown', toggle);
canvas.addEventListener('mouseup', toggle);
canvas.addEventListener('mouseleave', () => drawMode = false);


canvas.addEventListener('mousemove', draw);

tick();