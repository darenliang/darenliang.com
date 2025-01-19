---
title: "3D Shapes Using the 2D Canvas API"
description: "A simple JavaScript demo to draw 3D shapes using the 2D Canvas API"
date: "0003-01-01"
showthedate: false
---

This is a JavaScript reimplementation
of [pygame3Dtest](https://github.com/darenliang/pygame3Dtest),
which is a simple pygame demo I wrote to show how to draw 3D shapes using the
pygame API.

Press the arrow keys ⬆️ ⬇️ ⬅️ ➡️ or drag on mobile to rotate the shape!

<div class="controls">
  <button id="scrollToggleBtn">Disable Arrow Key Scroll</button>
  <button id="cubeBtn">Cube</button>
  <button id="tetraBtn">Tetrahedron</button>
  <button id="octaBtn">Octahedron</button>
  <button id="icosaBtn">Icosahedron</button>
</div>

<canvas id="canvas3D"></canvas>

<script>
  const article = document.querySelector('article');

  const shapes = {
    cube: {
      points: [
        [-2, -2, -2],
        [ 2, -2, -2],
        [ 2,  2, -2],
        [-2,  2, -2],
        [-2, -2,  2],
        [ 2, -2,  2],
        [ 2,  2,  2],
        [-2,  2,  2]
      ],
      edges: [
        [0,1], [1,2], [2,3], [3,0],
        [4,5], [5,6], [6,7], [7,4],
        [0,4], [1,5], [2,6], [3,7]
      ]
    },
    tetrahedron: {
      points: [
        [ 2,  2,  2],
        [ 2, -2, -2],
        [-2,  2, -2],
        [-2, -2,  2]
      ],
      edges: [
        [0,1], [1,2], [2,0],
        [0,3], [1,3], [2,3]
      ]
    },
    octahedron: {
      points: [
        [ 3,  0,  0],
        [-3,  0,  0],
        [ 0,  3,  0],
        [ 0, -3,  0],
        [ 0,  0,  3],
        [ 0,  0, -3]
      ],
      edges: [
        [0,2], [0,3], [0,4], [0,5],
        [1,2], [1,3], [1,4], [1,5],
        [2,4], [2,5], [3,4], [3,5]
      ]
    },
    icosahedron: {
      points: (function() {
        const t = (1 + Math.sqrt(5)) * 1.5 / 2;
        return [
          [-1.5,  t,  0], [ 1.5,  t,  0], [-1.5, -t,  0], [ 1.5, -t,  0],
          [ 0, -1.5,  t], [ 0,  1.5,  t], [ 0, -1.5, -t], [ 0,  1.5, -t],
          [ t,  0, -1.5], [ t,  0,  1.5], [-t,  0, -1.5], [-t,  0,  1.5]
        ];
      })(),
      edges: [
        [0,1], [0,5], [0,7], [0,10], [0,11],
        [1,5], [1,7], [1,8], [1,9],
        [2,3], [2,4], [2,6], [2,10], [2,11],
        [3,4], [3,6], [3,8], [3,9],
        [4,5], [4,9], [4,11],
        [5,9], [5,11],
        [6,7], [6,8], [6,10],
        [7,8], [7,10],
        [8,9],
        [10,11]
      ]
    }
  };

  const canvas = document.getElementById('canvas3D');
  const ctx = canvas.getContext('2d');

  let currentShape = shapes.cube;

  let angleX;
  let angleY;

  function resetAngles() {
    angleX = -Math.PI / 4;
    angleY = -Math.PI / 4;
  }
  resetAngles();

  const rotationSpeed = 1;

  const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  };

  const focalLength = 200;
  let scale = article.clientWidth / 8;

  let lastTimestamp = 0;

  let arrowScrollDisabled = false;

  document.addEventListener('keydown', (e) => {
    if (e.key in keysPressed) {
      keysPressed[e.key] = true;
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key in keysPressed) {
      keysPressed[e.key] = false;
    }
  });

  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  let lineColor = darkThemeMq.matches ? "#CCCCCC" : "#0D1117";
  darkThemeMq.addEventListener("change", (e) => {
    lineColor = e.matches ? "#CCCCCC" : "#0D1117";
  });

  function resizeCanvas() {
    canvas.width = article.clientWidth;
    canvas.height = article.clientWidth;
    scale = article.clientWidth / 8;
    draw(lastTimestamp);
  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  function rotateX([x, y, z], radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return [x, y * cos - z * sin, y * sin + z * cos];
  }

  function rotateY([x, y, z], radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return [x * cos + z * sin, y, -x * sin + z * cos];
  }

  function project([x, y, z]) {
    const factor = focalLength / (focalLength + z);
    const X2D = x * factor * scale + canvas.width / 2;
    const Y2D = -y * factor * scale + canvas.height / 2;
    return [X2D, Y2D];
  }

  function draw(timestamp) {
    const dt = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (keysPressed.ArrowUp) {
      angleX -= rotationSpeed * dt;
    }
    if (keysPressed.ArrowDown) {
      angleX += rotationSpeed * dt;
    }
    if (keysPressed.ArrowLeft) {
      angleY -= rotationSpeed * dt;
    }
    if (keysPressed.ArrowRight) {
      angleY += rotationSpeed * dt;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const transformedPoints = currentShape.points.map((p) => {
      const rx = rotateX(p, angleX);
      const ry = rotateY(rx, angleY);
      return project(ry);
    });

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    currentShape.edges.forEach(([start, end]) => {
      const [x1, y1] = transformedPoints[start];
      const [x2, y2] = transformedPoints[end];
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    });
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  const cubeBtn = document.getElementById('cubeBtn');
  const tetraBtn = document.getElementById('tetraBtn');
  const octaBtn = document.getElementById('octaBtn');
  const icosaBtn = document.getElementById('icosaBtn');
  const scrollToggleBtn = document.getElementById('scrollToggleBtn');

  cubeBtn.addEventListener('click', () => {
    currentShape = shapes.cube;
    resetAngles();
  });
  tetraBtn.addEventListener('click', () => {
    currentShape = shapes.tetrahedron;
    resetAngles();
  });
  octaBtn.addEventListener('click', () => {
    currentShape = shapes.octahedron;
    resetAngles();
  });
  icosaBtn.addEventListener('click', () => {
    currentShape = shapes.icosahedron;
    resetAngles();
  });

  scrollToggleBtn.addEventListener('click', () => {
    arrowScrollDisabled = !arrowScrollDisabled;
    scrollToggleBtn.textContent = arrowScrollDisabled
      ? 'Enable Arrow Key Scroll'
      : 'Disable Arrow Key Scroll';
  });

  window.addEventListener('keydown', (e) => {
    if (arrowScrollDisabled && (
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight'
    )) {
      e.preventDefault();
    }
  }, { passive: false });

  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    e.preventDefault();
  });

  canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    angleY += deltaX * 0.01;
    angleX += deltaY * 0.01;

    touchStartX = touchEndX;
    touchStartY = touchEndY;
    e.preventDefault();
  });
</script>