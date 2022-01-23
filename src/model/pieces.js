class Rook {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  canTake(piece) {
    // with this definition, piece can always take itself
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
    // with this definition, piece can always take itself
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