class Rook {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  canTake(piece) {
    return piece.x === this.x || piece.y === this.y;
  }

  toString() {
    return "Rook";
  }
}

class Bishop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  canTake(piece) {
    const dx = piece.x - this.x;
    const dy = piece.y - this.y;
    return dx === dy || dx + dy === 0;
  }

  toString() {
    return "Bishop";
  }
}

module.exports = {
  Rook: Rook,
  Bishop: Bishop
};