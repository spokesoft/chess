/*
|------------------------------------------------------------------------------
|   Application
|------------------------------------------------------------------------------
*/

class App {

  async start() {
    this.element = document.getElementById('app');
    this.usernameLabel = document.querySelector('#username-label');
    this.username = await this.getUsername();
    this.scoreLabel = document.querySelector('#score-label');
    this.score = this.getScore();
    this.usernameLabel.textContent = `Welcome, ${this.username}!`;
    this.scoreLabel.textContent = `${this.score}`;
    this.renderGamePage();
  }

  clear() {
    this.element.innerHTML = '';
  }

  renderPage() {}

  getPlayer1() {
    return new Promise((resolve, reject) => {
      const player1 = new Player();
      resolve(player1);
    });
  }

  getPlayer2() {
    return new Promise((resolve, reject) => {
      const player2 = new Player();
      resolve(player2);
    });
  }

  getOptions() {
    return new Promise((resolve, reject) => {
      const options = {};
      resolve(options);
    });
  }

  getUsername() {
    return new Promise((resolve, reject) => {

      const clear = this.clear.bind(this);
      let username = getCookie('username');
      if (username) return resolve(username);

      clear();
      this.renderLoginPage();
      const form = document.querySelector('#login-form');
      const input = form.querySelector('#username');
      
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = input.value;
        if (!username) return;
        setCookie('username', username, 365);
        clear();
        resolve(username);
      });

    });
  }

  getScore() {
    return parseInt(getCookie('score')) || 0;
  }

  renderLoginPage() {
    this.clear();
    document.getElementById('app').setAttribute('data-template', 'login:page');
    renderTemplates();
    feather.replace();
  }

  renderGamePage() {
    this.clear();
    document.getElementById('app').setAttribute('data-template', 'play:page');
    renderTemplates();
    feather.replace();

    var game = new Game();
  }

}

/*
|------------------------------------------------------------------------------
|   Player
|------------------------------------------------------------------------------
*/

PLAYERCOLOR_WHITE = 0x00;
PLAYERCOLOR_BLACK = 0x01;

class Player {
  constructor(name) {
    this.id = _.uniqueId('player');
    this.color = PLAYERCOLOR_WHITE;
    this.name = name;
    this.score = 0;
    this.pieces = [];
  }
}

/*
|------------------------------------------------------------------------------
|   Robot
|------------------------------------------------------------------------------
*/

class Robot extends Player {
  constructor(name) {
    super(name);
    this.isRobot = true;
  }
}

/*
|------------------------------------------------------------------------------
|   Game
|------------------------------------------------------------------------------
*/

const GAMESTATUS_ACTIVE = 0x00;
const GAMESTATUS_PLAYER1VICTORY = 0x01;
const GAMESTATUS_PLAYER2VICTORY = 0x02;
const GAMESTATUS_PLAYER1STALEMATE = 0x03;
const GAMESTATUS_PLAYER2STALEMATE = 0x04;
const GAMESTATUS_PLAYER1FORFEIT = 0x05;
const GAMESTATUS_PLAYER2FORFEIT = 0x06;

class Game {
  constructor(player1, player2) {
    this.players = [player1, player2];
    this.board = new Board(document.querySelector('.board'));
    this.clock = new Clock();
    this.turn = 0;
    this.status = GAMESTATUS_ACTIVE;
  }

  reset() {}
  start() {}
  forfeit() {}
  getAllMoves(player) {}
  onRobotMove() {}
  onPlayerMove() {}
}

/*
|------------------------------------------------------------------------------
|   Clock
|------------------------------------------------------------------------------
*/

class Clock {}
class ClockLabel {}

/*
|------------------------------------------------------------------------------
|   Board
|------------------------------------------------------------------------------
*/

class Board {
  constructor(element) {
    this.element = element;
    this.tiles = [];
    this.initializeTiles();
    console.log(this.tiles);
  }
  initializeTiles() {

    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    let dark = true;
    let rowStartsDark = true;

    for (let i = 0; i < 8; i++) {
      let row = rows[i];
      rowStartsDark = !rowStartsDark;
      console.log("Row " + row + " " + (rowStartsDark ? "starts dark" : "starts light"));
      for (let j = 0; j < 8; j++) {
        if (j == 0) {
          if (rowStartsDark) {
            dark = true;
          } else {
            dark = false;
          }
        }
        let col = cols[j];
        let tile = new Tile(i, j, `${col}${row}`, dark)
        this.tiles.push(tile);
        this.element.appendChild(tile.element);
        dark = !dark;
      }
    }
  }
}

/*
|------------------------------------------------------------------------------
|   Tile
|------------------------------------------------------------------------------
*/

class Tile {
  constructor(x, y, id, dark) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.piece = null;
    this.dark = dark;
    this.element = document.createElement("div");
    this.element.classList.add("tile");
    if (dark) {
      this.element.classList.add("dark");
    } else {
      this.element.classList.add("light");
    }
  }
}

/*
|------------------------------------------------------------------------------
|   Piece
|------------------------------------------------------------------------------
*/

class Piece {}
class King extends Piece {}
class Queen extends Piece {}
class Rook extends Piece {}
class Bishop extends Piece {}
class Knight extends Piece {}
class Pawn extends Piece {}

function start() {
  const app = new App();
  app.start();
}