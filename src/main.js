const graphics = require('./view/graphics');
const board = require('./model/board');
const {Rook, Bishop} = require('./model/pieces');

board.positionPiece(new Rook(7,0));   // h1
board.positionPiece(new Bishop(2,2)); // c3

graphics.init();
