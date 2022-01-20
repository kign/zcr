const assert = require("assert");

const moves = [];
let pointer = 0;

function record(coin, dice, rookPos, end) {
  assert (pointer === moves.length);
  moves.push({coin: coin, dice: dice, pos: rookPos, end: end});
  pointer ++;
}

function moveBack() {
  assert(pointer > 0);
  pointer --;
  return moves[pointer];
}

function moveForward() {
  assert(pointer < moves.length);
  pointer ++;
  return moves[pointer - 1];
}

function reset() {
  moves.length = 0;
  pointer = 0;
}

module.exports = {
  record : record,
  moveBack: moveBack,
  moveForward: moveForward,
  reset: reset,

  count: () => moves.length,
  access: idx => moves[idx],
  pointer: () => pointer,
  gameEnded: () => moves.length > 0 && moves[moves.length - 1].end !== 0
};