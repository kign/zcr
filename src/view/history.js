const moves = require('../model/moves');

const elm_history = document.querySelector('#history > table > tbody');

/*
 * Auxiliary methods to insert SVG images
 * We insert them by reference with IMG tag, though it could be possible to simply insert SVG
 * This way we save time & memory on repeated images, at the cost of small initial delay
 */
function img_coin(coin) {
  const elm_img = document.createElement('img');
  elm_img.setAttribute('src', coin === 2? "coin-head.svg" : "coin-tail.svg");
  return elm_img;
}

function img_dice(dice) {
  const elm_img = document.createElement('img');
  elm_img.setAttribute('src', `dice-${dice}.svg`);
  return elm_img;
}

function img_winner(end) {
  const elm_img = document.createElement('img');
  elm_img.setAttribute('src', end === 1? 'rook-black.svg' : 'bishop-white.svg');
  return elm_img;
}

/*
 * A clean design would have just one "update" method which would sync view with current list of "moves"
 * This would be somewhat cumbersome, so instead we provide 4 update methods, since there are
 * only 4 possible update events: (1) new move (2) end game (3) history replay (4) reset
 */
function addRow() {
  const cnt = moves.count();
  const {coin, dice, pos, end} = moves.access(cnt - 1);

  const elm_td1 = document.createElement('td');
  elm_td1.appendChild(document.createTextNode(cnt.toString()));

  const elm_td2 = document.createElement('td');
  elm_td2.appendChild(img_coin(coin));
  elm_td2.appendChild(img_dice(dice[0]));
  elm_td2.appendChild(img_dice(dice[1]));

  const elm_td3 = document.createElement('td');
  elm_td3.appendChild(document.createTextNode(String.fromCharCode(97+pos[0]) + (1 + pos[1])));

  const elm_tr = document.createElement('tr');
  elm_tr.appendChild(elm_td1);
  elm_tr.appendChild(elm_td2);
  elm_tr.appendChild(elm_td3);

  elm_history.appendChild(elm_tr);
  if (end)
    addEndRow(end);
}

function addEndRow(end) {
  const elm_td = document.createElement('td');
  elm_td.setAttribute('colspan', "3");
  elm_td.appendChild(img_winner(end));

  const elm_span = document.createElement('span');
  elm_span.appendChild(document.createTextNode("WIN"));
  elm_td.appendChild(elm_span);

  const elm_tr = document.createElement('tr');
  elm_tr.setAttribute('class', 'win');
  elm_tr.appendChild(elm_td);
  elm_history.appendChild(elm_tr);
}

function updatePointer() {
  const cnt = moves.count();
  const ptr = moves.pointer();

  const tr_hr = elm_history.querySelector('hr').parentElement.parentElement;
  const rows = elm_history.querySelectorAll("tr");

  let tr_next = null;
  let idx = 0;
  for (const tr of rows)
    if (tr !== tr_hr && tr.getAttribute('class') !== 'win') {
      idx ++;
      if (idx > ptr) {
        if (!tr_next) tr_next = tr;
        tr.setAttribute('class', 'inactive');
      }
      else
        tr.removeAttribute('class');
    }

  if (ptr === cnt)
    tr_hr.style.display = 'none';
  else {
    tr_hr.parentElement.insertBefore(tr_hr, tr_next);
    tr_hr.style.display = '';
  }
}

function reset() {
  const tr_hr = elm_history.querySelector('hr').parentElement.parentElement;
  const rows = elm_history.querySelectorAll("tr");
  for (const tr of rows)
    if (tr !== tr_hr)
      tr.remove();
  tr_hr.style.display = 'none';
}

module.exports = {
  addRow : addRow,
  updatePointer : updatePointer,
  reset: reset
};