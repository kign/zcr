const assert = require("assert");

const board = require('../model/board');
const moves = require('../model/moves');
const history = require('../view/history');
const graphics = require('../view/graphics');

const controls = document.getElementById('controls');
let running = false;

class Button {
  constructor(name) {
    this.elm = controls.querySelector(`button[name=${name}]`);
    if (!this.elm)
      console.error("Cannot find", name);
    this.elm.addEventListener("click", () => {
      console.log(name, "clicked");
      this.onClick();
      buttons.forEach(b => b.updateState());
    });
  }

  disable(disabled) {
    if (disabled) {
      this.elm.setAttribute('disabled', 'yes');
      this.elm.querySelector('img').setAttribute('class', 'inactive');
    }
    else {
      this.elm.removeAttribute('disabled');
      this.elm.querySelector('img').removeAttribute('class');
    }
  }

  hide(hidden) {
    this.elm.style.display = hidden? 'none' : '';
  }
}

class Step extends Button {
  constructor() {
    super("step");
  }

  onClick() {
    board.oneGameStep(moves.count() + 1);
    history.addRow();
  }

  updateState() {
    this.disable(running || moves.gameEnded() || moves.pointer() < moves.count());
  }
}

class Run extends Button {
  constructor() {
    super("run");
  }

  onClick() {
    assert(!running);
    if (moves.gameEnded()) return;
    board.oneGameStep(moves.count() + 1);
    history.addRow();

    if (moves.gameEnded()) return;

    running = true;
    graphics.registerOnAnimationEnd(() => {
      board.oneGameStep(moves.count() + 1);
      history.addRow();
      if (moves.gameEnded()) {
        running = false;
        graphics.registerOnAnimationEnd(null);
        buttons.forEach(b => b.updateState());
      }
    });
  }

  updateState() {
    this.disable(moves.gameEnded() || moves.pointer() < moves.count());
    this.hide(running);
  }
}

class Stop extends Button {
  constructor() {
    super("stop");
  }

  onClick() {
    assert(running);
    running = false;
    graphics.registerOnAnimationEnd(null);
  }

  updateState() {
    this.hide(!running);
  }
}

class Back extends Button {
  constructor() {
    super("back");
  }

  onClick() {
    const {coin, dice} = moves.moveBack();
    board.move(coin, dice, true);
    history.updatePointer();
  }

  updateState() {
    this.disable(running || moves.pointer() <= 0);
  }
}

class Forward extends Button {
  constructor() {
    super("forward");
  }

  onClick() {
    const {coin, dice} = moves.moveForward();
    board.move(coin, dice, false);
    history.updatePointer();
  }

  updateState() {
    this.disable(running || moves.pointer() >= moves.count());
  }
}

class Reset extends Button {
  constructor() {
    super("reset");
  }

  onClick() {
    graphics.reset();
    board.reset();
    moves.reset();
    history.reset();
  }

  updateState() {
    this.disable(running || moves.count() === 0);
  }
}

const buttons = [new Back(), new Forward(), new Step(), new Run(), new Stop(), new Reset()];
buttons.forEach(b => b.updateState());