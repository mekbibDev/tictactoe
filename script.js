function gameBoard() {

  var _board = _createBoard();

  var getBoard = () => _board;

  var placeMarker = (row, column, marker) => {
    if (_board[row][column] === null) {
      _board[row][column] = marker;
      return true;
    }
    else
      return false;
  }
  var setBoard = (board) => {
    _board = board;
  }
  var resetBoard = () => {
    _board = _createBoard();
  };

  function _createBoard() {
    const row = 3;
    const column = 3;
    var board = Array(row).fill([]);

    for (let i = 0; i < column; i++) {
      board[i] = Array(column).fill(null);
    }
    return board;
  }
  return { getBoard, placeMarker, resetBoard, setBoard };
}

function player(name, marker) {
  var getName = () => name;
  var getMarker = () => marker;

  return { getName, getMarker };
}


function computer(name, marker) {
  var getName = () => name;
  var getMarker = () => marker;
  var markers = ['O', 'X'];
  var _currentMarker = markers[0];
  var isBot = true;

  var _switchCurrentMarker = () => _currentMarker === 'O' ? _currentMarker = 'X' : _currentMarker = 'O';
  function chooseCell() {
    if(gameController.getCells() === 9){
      let row = Math.floor(Math.random() * 3);
      let column = Math.floor(Math.random() * 3) ;
      let state = {row,column, points:0};
      
      return state;
    }
    var state = _chooseState(JSON.parse(JSON.stringify(gameController.gameBoard.getBoard())), gameController.getCells());
    return state;
  }
  function _chooseState(currentBoard, cells) {

    var states = [];
    var gameBoardTemp = gameBoard();

    gameBoardTemp.setBoard(JSON.parse(JSON.stringify(currentBoard)));

    for (const row in gameBoardTemp.getBoard()) {
      for (const column in gameBoardTemp.getBoard()[row]) {
        if (gameBoardTemp.getBoard()[row][column] === null) {
          let calculatedPoints = _calculatePoints(row, column, gameBoardTemp, cells);
          states.push({ row, column, points: calculatedPoints });
        }

      }
    }
    let state = states.toSorted((a, b) => a.points - b.points)[states.length - 1];
    console.log('in choose state');
    console.log(states);
    return state;

  }
  function _calculatePoints(row, column, gameBoardTemp, cells, marker = 'O', depth = 0) {
    var gameBoardTempTwo = gameBoard();
    var boardCopy = JSON.parse(JSON.stringify(gameBoardTemp.getBoard()))
    gameBoardTempTwo.setBoard(boardCopy);
    gameBoardTempTwo.placeMarker(row, column, marker);
    boardCopy = JSON.parse(JSON.stringify(gameBoardTempTwo.getBoard()))

    cells -= 1;
    if (typeof (gameController.checkWin(gameBoardTempTwo.getBoard())) === 'string') {
      if (gameController.checkWin(gameBoardTempTwo.getBoard()) === 'X')
        return depth - 10;
      else
        return 10 - depth;
    }
    else if (cells === 0) {
      return 0;
    }
    depth += 1;
    marker = marker === 'X' ? 'O' : 'X';
    let states = [];
    for (const row in gameBoardTempTwo.getBoard()) {
      for (const column in gameBoardTempTwo.getBoard()[row]) {
        if (gameBoardTempTwo.getBoard()[row][column] === null) {
          let calculatedPoints = _calculatePoints(row, column, gameBoardTempTwo, cells, marker, depth);
          states.push({ row, column, points: calculatedPoints });
        }
      }
    }

    let state = [];
    if (marker === 'X')
      state = states.toSorted((a, b) => a.points - b.points)[0];
    else
      state = states.toSorted((a, b) => a.points - b.points)[states.length - 1];
    console.log(states);
    return state.points;

  }



  return { getName, getMarker, chooseCell, isBot };
}
var gameController = (function (gameBoard) {
  var _players = [player('player', 'X'), computer('Unbeatable Bot', 'O')];
  var _cells = 9;
  var _activePlayer = _players[0];
  var _gameStatus = {
    gameOver: false,
    tie: false,
    winner: null,
  }

  function playRound(row, column) {
    if (gameBoard.placeMarker(row, column, _activePlayer.getMarker())) {
      _cells -= 1;
      if (typeof (checkWin(gameBoard.getBoard())) === 'string') {
        _gameStatus.gameOver = true;
        _gameStatus.winner = _activePlayer;
        _switchPlayer();
        return _gameStatus;
      }
      else if (_cells === 0) {
        _gameStatus.gameOver = true;
        _gameStatus.tie = true;
        _switchPlayer();
        return _gameStatus;
      }
      _switchPlayer();
    }
    return _gameStatus;
  }
  function checkWin(board) {
    //checks for horizontal or vertical matches
    for (const i in board) {
      if (typeof (board[i][0]) === 'string' & board[i][0] === board[i][1] & board[i][0] === board[i][2])
        return board[i][0];
      if (typeof (board[0][i]) === 'string' & board[0][i] === board[1][i] & board[0][i] === board[2][i])
        return board[0][i];
    }
    //checks for crisscross matches
    if (typeof (board[1][1]) === 'string' & (((board[1][1] === board[0][0]) & (board[1][1] === board[2][2]))
      || ((board[1][1] === board[2][0]) & (board[1][1] === board[0][2]))))
      return board[1][1];
    return false;
  }
  function _switchPlayer() {
    _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
  }
  function resetGame() {
    _cells = 9;
    _gameStatus = {
      gameOver: false,
      tie: false,
      winner: null,
    }
    gameBoard.resetBoard();
  }
  function getCells() {
    return _cells;
  }
  function getActivePlayer() {
    return _activePlayer;
  }
  return { playRound, resetGame, checkWin, getCells, getActivePlayer, gameBoard };
})(gameBoard())

function displayBoard(board) {
  var boardContainer = document.querySelector('.board');
  boardContainer.textContent = '';
  var resetButton = document.createElement('button');
  for (let row in board) {
    for (column in board[row]) {
      let button = document.createElement('button');
      button.dataset.row = row;
      button.dataset.column = column;
      button.addEventListener('click', placeMarker)
      boardContainer.append(button);
    }
  }

  resetButton.textContent = 'Reset';
  resetButton.addEventListener('click', resetGame);
  boardContainer.append(resetButton);
}
function placeMarker(e) {
  const row = Number(e.target.dataset.row);
  const column = Number(e.target.dataset.column);
  let gameStatus = gameController.playRound(row, column);
  e.target.textContent = gameController.gameBoard.getBoard()[row][column];
  if (gameStatus.gameOver) {
    displayGameStatus(gameStatus);
  }
  else if (gameController.getActivePlayer().isBot) {

    botClick();
  }
}

function displayGameStatus(gameStatus) {
  let gameStatusElement = document.querySelector('.gameStatus');
  removeListenersFromButtons();
  if (gameStatus.winner !== null) {
    gameStatusElement.textContent = `${gameStatus.winner.getName()} has won the Game`;
  }
  else {
    gameStatusElement.textContent = "The game is a tie";
  }
}
function resetGame() {
  gameController.resetGame();
  let gameStatusElement = document.querySelector('.gameStatus');
  gameStatusElement.textContent = '';
  displayBoard(gameController.gameBoard.getBoard());
  if(gameController.getActivePlayer().isBot){
    botClick();
  }
}
function removeListenersFromButtons() {
  let buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.removeEventListener('click', placeMarker);
  })
}
function botClick(){
  var cell = gameController.getActivePlayer().chooseCell();
  var button = document.querySelector(`button[data-row='${cell.row}'][data-column='${cell.column}']`);
  button.click();
}
displayBoard(gameController.gameBoard.getBoard())
