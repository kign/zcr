const {Rook, Bishop} = require('./pieces');
const moves = require('./moves');

let rook = null;
let bishop = null;
let original_rook = null;

function positionPiece(piece) {
  if (piece instanceof Rook) {
    rook = piece;
    original_rook = {x: rook.x, y: rook.y};
  }
  else if (piece instanceof Bishop)
    bishop = piece;
}

function oneGameStep(moveCounter) {
  const coin = Math.ceil(2*Math.random());
  const dice = [Math.ceil(6*Math.random()), Math.ceil(6*Math.random())];

  // const [coin, dice] = moveCounter === 1? [1, [2,1]] : [2, [5,5]];
  // const [coin, dice] = moveCounter === 1? [1, [1,4]] : [2, [5,5]];
  console.log("board#oneGameStep: coin =", coin, "; dice =", dice);

  const captured = move(coin, dice, false);
  const end = captured? -1 : moveCounter >= 15? 1 : 0;
  moves.record(coin, dice, [rook.x, rook.y], end);
}

function move(coin, dice, reverse) {
  if (coin === 2) { // "heads"
    if (reverse) {
      rook.y = (rook.y + 16 - dice[0] - dice[1]) % 8;
      const captured = bishop.canTake(rook);
      animationCallbacks.down(dice[0] + dice[1], captured);
      return captured;
    }
    else {
      rook.y = (rook.y + dice[0] + dice[1]) % 8;
      const captured = bishop.canTake(rook);
      animationCallbacks.up(dice[0] + dice[1], captured);
      return captured;
    }
  }
  else { // "tail"
    if (reverse) {
      rook.x = (rook.x + 16 - dice[0] - dice[1]) % 8;
      const captured = bishop.canTake(rook);
      animationCallbacks.left(dice[0] + dice[1], captured);
      return captured;
    }
    else {
      rook.x = (rook.x + dice[0] + dice[1]) % 8;
      const captured = bishop.canTake(rook);
      animationCallbacks.right(dice[0] + dice[1], captured);
      return captured;
    }
  }
}

function reset () {
  rook.x = original_rook.x;
  rook.y = original_rook.y;
}

const animationCallbacks = {};

function registerOnMove(name, func_cb) {
  animationCallbacks[name] = func_cb;
}

module.exports = {
  positionPiece : positionPiece,
  oneGameStep : oneGameStep,
  move : move,
  registerOnMove : registerOnMove,
  reset: reset,

  rook : () => rook,
  bishop : () => bishop
};
