var gameBoard = (function () {

  var _board = _createBoard();

  var getBoard = () => _board;

  var placeMarker = (row, column, token) => {
    if (_board[row][column] === undefined) {
      _board[row][column] = token;
      return true;
    }
    else
      return false;
  }

  var resetBoard = () => {
    _board = _createBoard();
  };

  function _createBoard() {
    const row = 3;
    const column = 3;
    var board = Array(row).fill([]);

    for (let i = 0; i < column; i++) {
      board[i] = Array(column).fill();
    }
    return board;
  }
  return { getBoard, placeMarker, resetBoard };
})();

function Player(name, token) {
  var getName = () => name;
  var getToken = () => token;

  return { getName, getToken };
}

var gameControl = (function (gameBoard) {
  var _players = [Player('mekbib', 'X'), Player('daniel', 'O')];
  var _cells = 9;
  var _activePlayer = _players[0];
  var _gameStatus = {
    gameOver: false,
    tie: false,
    winner: null,
  }
  function playRound(row, column) {
    if (gameBoard.placeMarker(row, column, _activePlayer.getToken())) {
      _cells -= 1;
      if (_checkWin(gameBoard.getBoard())) {
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
  function _checkWin(board) {
    //checks for horizontal or vertical matches
    for (const i in board) {
      if (typeof (board[i][0]) === 'string' & board[i][0] === board[i][1] & board[i][0] === board[i][2])
        return true;
      if (typeof (board[0][i]) === 'string' & board[0][i] === board[1][i] & board[0][i] === board[2][i])
        return true;
    }
    //checks for crisscross matches
    if (typeof (board[1][1]) === 'string' & (((board[1][1] === board[0][0]) & (board[1][1] === board[2][2]))
      || ((board[1][1] === board[2][0]) & (board[1][1] === board[0][2]))))
      return true;
    return false;
  }
  function _switchPlayer() {
    _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
  }

  return { playRound };
})(gameBoard);

function displayBoard(board) {
  var boardContainer = document.querySelector('.board');
  for (let row in board) {
    for (column in board[row]) {
      let button = document.createElement('button');
      button.dataset.row = row;
      button.dataset.column = column;
      button.addEventListener('click', placeMarker)
      boardContainer.append(button);
    }
  }
}
function placeMarker(e) {
  const row = Number(e.target.dataset.row);
  const column = Number(e.target.dataset.column);
  let gameStatus = gameControl.playRound(row, column);
  e.target.textContent = gameBoard.getBoard()[row][column];
  if (gameStatus.gameOver) {
    displayGameStatus(gameStatus);
  }
}
function displayGameStatus(gameStatus) {
  let gameStatusElement = document.querySelector('.gameStatus');
  if (gameStatus.winner !== null) {
    gameStatusElement.textContent = `${gameStatus.winner.getName()} has won the Game`;
  }
  else {
    gameStatusElement.textContent = "The game is a tie";
  }
}
displayBoard(gameBoard.getBoard())
