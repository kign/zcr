const board = require('../model/board');

board.registerOnMove('right', animateRight);
board.registerOnMove('left', animateLeft);
board.registerOnMove('up', animateUp);
board.registerOnMove('down', animateDown);

function rect (x, y) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', "1");
  rect.setAttribute('height', "1");
  rect.setAttribute('class', 'dark');
  return rect;
}

function text (x, y, str, style) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('class', style);
  text.appendChild(document.createTextNode(str));
  return text;
}

function image(x, y, piece) {
  const image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
  image.setAttribute('x', x);
  image.setAttribute('y', y);
  image.setAttribute('width', "1");
  image.setAttribute('height', "1");
  image.setAttribute('class', piece);
  image.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href', piece + '.png');
  return image;
}

function dot(x, y) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  circle.setAttribute('cx', x + 0.5);
  circle.setAttribute('cy', y + 0.5);
  circle.setAttribute('r', '0.1');
  circle.setAttribute('fill', 'red');
  return circle;
}

const rook_orig = {};
const svg = document.getElementById('board');

function init () {
  for (let x = 0; x < 8; x ++)
    for (let y = 0; y < 8; y ++)
      if ((x + y) % 2 === 1)
        svg.appendChild(rect(x, y));

  const textProp = {size: 0.2, margin: 0.05};

  for (let y = 1; y <= 8; y ++)
    svg.appendChild(text(textProp.margin, textProp.margin + textProp.size + (8 - y), y.toString(), y % 2 === 0? 'dark' : 'light'));
  for (let x = 1; x <= 8; x ++)
    svg.appendChild(text(1 - textProp.size + (x-1), 8 - textProp.margin, String.fromCharCode(96+x), x % 2 === 0? 'dark' : 'light'));

  svg.appendChild(image(board.bishop().x, 7 - board.bishop().y, "bishop"));
  svg.appendChild(image(board.rook().x, 7 - board.rook().y, "rook"));

  rook_orig.x = board.rook().x;
  rook_orig.y = board.rook().y;
}

function animate(start, path, capture) {
  if (!capture)
    clearCapture();

  if (navigator.userAgent.indexOf("Chrome") > -1)
    animatePathSVG2(path, capture? {x: board.rook().x, y: board.rook().y} : null);
  else
    animatePathSVG1(start, path, capture? {x: board.rook().x, y: board.rook().y} : null);

}

function animatePathSVG1(start, path, capture) {
  if (animateTranslateHandler) {
    window.clearTimeout(animateTranslateHandler);
    animateTranslateHandler = null;
  }

  const elm_rook = svg.querySelector('image.rook');

  const next = () => {
    if (path.length === 1) {
      displayCapture(capture);
      if (animationEndCallback)
        animateTranslateHandler = window.setTimeout(animationEndCallback, 200);
    }
    else
      animatePathSVG1(path[0], path.slice(1), capture);
  };

  if (!path[0].animate) {
    elm_rook.setAttribute("transform",
      `translate(${path[0].x - rook_orig.x} ${rook_orig.y - path[0].y})`);
    next();
  }
  else
    animateTranslate(elm_rook,
      {x: start.x - rook_orig.x, y: rook_orig.y - start.y},
      {x: path[0].x - rook_orig.x, y: rook_orig.y - path[0].y},
      780,
      next);
}

let animateTranslateHandler = null;

function animateTranslate(elm, trf0, trf1, delay, completion_cb) {
  const unit = 20; // ms
  const n = Math.ceil(delay / unit);
  const animate_idx = idx => {
    elm.setAttribute("transform",
      `translate(${trf0.x * (1 - idx/n) + trf1.x * idx/n} ${trf0.y * (1 - idx/n) + trf1.y * idx/n})`);
    if (idx === n) {
      if (completion_cb)
        completion_cb();
      animateTranslateHandler = null;
    }
    else
      animateTranslateHandler = window.setTimeout(animate_idx, delay/n, 1 + idx);
  };

  animateTranslateHandler = window.setTimeout(animate_idx, delay/n, 1);
}

function animatePathSVG2(path, capture) {
  const elm_rook = svg.querySelector('image.rook');
  elm_rook.setAttribute('class', path[0].animate? 'rook animate' : 'rook');
  elm_rook.setAttribute("transform",
      `translate(${path[0].x - rook_orig.x} ${rook_orig.y - path[0].y})`);

  if (path.length === 1)
    window.setTimeout(() => {
      displayCapture(capture);
      if (animationEndCallback)
        animationEndCallback ();
    }, 700);
  else
    window.setTimeout(() => animatePathSVG2(path.slice(1), capture), path[0].animate? 1000 : 10);
}

function displayCapture(capture) {
  if (capture) {
    const d = {x: capture.x < board.bishop().x ? 1 : -1, y: capture.y < board.bishop().y ? 1 : -1};
    const m = d.x * (board.bishop().x - capture.x);
    for (let p = 0; p <= m; p++)
      svg.appendChild(dot(capture.x + p * d.x, 7 - capture.y - p * d.y));
  }
  else
    clearCapture();
}

function clearCapture() {
  svg.querySelectorAll('circle').forEach(x => x.remove());
}

function animateUp (dst, capture) {
  const cur = {x: board.rook().x, y: board.rook().y};
  const prev = {x: cur.x, y: (cur.y - dst + 16) % 8};
  const p = {...prev};

  const path = [];
  while (prev.y + dst >= 8) {
    path.push({animate: true, x: cur.x, y: 8});
    path.push({animate: false, x: cur.x, y: -1});
    dst -= 7 - prev.y;
    prev.y = -1;
  }
  path.push({animate: true, x: cur.x, y: cur.y});
  animate(p, path, capture);
}

function animateDown (dst, capture) {
  const cur = {x: board.rook().x, y: board.rook().y};
  const prev = {x: cur.x, y: (cur.y + dst) % 8};
  const p = {...prev};

  const path = [];
  while (prev.y - dst < 0) {
    path.push({animate: true, x: cur.x, y: -1});
    path.push({animate: false, x: cur.x, y: 8});
    dst -= prev.y;
    prev.y = 8;
  }
  path.push({animate: true, x: cur.x, y: cur.y});
  animate(p, path, capture);
}

function animateRight (dst, capture) {
  const cur = {x: board.rook().x, y: board.rook().y};
  const prev = {x: (cur.x - dst + 16) % 8, y: cur.y};
  const p = {...prev};

  const path = [];
  while (prev.x + dst >= 8) {
    path.push({animate: true, x: 8, y: cur.y});
    path.push({animate: false, x: -1, y: cur.y});
    dst -= 7 - prev.x;
    prev.x = -1;
  }
  path.push({animate: true, x: cur.x, y: cur.y});
  animate(p, path, capture);
}

function animateLeft (dst, capture) {
  const cur = {x: board.rook().x, y: board.rook().y};
  const prev = {x: (cur.x + dst) % 8, y: cur.y};
  const p = {...prev};

  const path = [];
  while (prev.x - dst < 0) {
    path.push({animate: true, x: -1, y: cur.y});
    path.push({animate: false, x: 8, y: cur.y});
    dst -= prev.x;
    prev.x = 8;
  }
  path.push({animate: true, x: cur.x, y: cur.y});
  animate(p, path, capture);
}

function reset () {
  animate({x: board.rook().x, y: board.rook().y}, [{animate: true, x: rook_orig.x, y: rook_orig.y}], false);
}

let animationEndCallback = null;

function registerOnAnimationEnd(cb) {
  animationEndCallback = cb;
}

module.exports = {
  init: init,
  reset: reset,

  registerOnAnimationEnd : registerOnAnimationEnd
};