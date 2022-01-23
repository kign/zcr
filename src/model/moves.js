const assert = require("assert");

/*
 * We record history of moves and current `pointer` for playback
 */

const moves = [];
let pointer = 0;

function record(coin, dice, rookPos, end) {
  // can only add new move when pointer points to the end
  assert (pointer === moves.length);
  moves.push({coin: coin, dice: dice, pos: rookPos, end: end});
  pointer ++;
}

/*
 * Two playback methods
 */
function moveBack() {
  // when moving pointer back from "A B <ptr> C" to "A <ptr> B C", return B
  assert(pointer > 0);
  pointer --;
  return moves[pointer];
}

function moveForward() {
  // when moving pointer forward from "A <ptr> B C" to "A B <ptr> C", return B
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