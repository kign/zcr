const graphics = require('./view/graphics');
const board = require('./model/board');
const {Rook, Bishop} = require('./model/pieces');

/*
Some (subjective) notes on `node` dependencies:

While of course Javascript methods can call each other in any order, recursively or otherwise,
`require` should, generally, be free of circular dependencies
(though it's not strictly enforced by either `node` or `browserify`).

The reason for this is that each module has some static initialization and `node` must make sure
a module is fully initialized and ready when `require`d by another.

While this imposes no serious constraint on design (one can always initialize all modules on the
top level and then simply have them call one another with no boundaries via handles passed as parameters),
it's useful to have simple rules governing what any given module is allowed to `require`.

Here we follow MVC architecture, with dependencies as follows:

CONTROLLER ----> VIEW ----> MODEL
   |_________________________^

Modules within each group should NOT generally `require` one another,
except in MODEL group, where such dependencies should follow the architecture of the model.
*/



// initial positions
board.positionPiece(new Rook(7,0));   // h1
board.positionPiece(new Bishop(2,2)); // c3

graphics.init();
