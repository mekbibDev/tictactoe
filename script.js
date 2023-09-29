var gameBoard = (function () {

  var _board = _createBoard();

  var getBoard = () => _board;

  var setToken = (row, column, token) => {
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
  return { getBoard, setToken, resetBoard };
})();

function Player(name, token) {
  var getName = () => name;
  var getToken = () => token;

  return { getName, getToken };
}

var gameControl = (function (gameBoard) {
  var _players = [Player('mekbib', 'X'), Player('daniel', 'O')];
  const _cells = 9;
  var _activePlayer = _players[0];

  function _playRound(activePlayer) {

    return gameBoard.setToken(window.prompt('input row'), window.prompt('input column'), activePlayer.getToken());
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
  function startGame() {

    let i = _cells;
    while (i > 0) {
      if (_playRound(_activePlayer)) {
        const gameOver = _checkWin(gameBoard.getBoard());
        if (gameOver !== false) {
          let winner = _activePlayer;

          break;
        }
        _activePlayer = _activePlayer === _players[0] ? _players[1] : _players[0];
        i = i - 1;
      }

    }
    gameBoard.resetBoard();
  }

  return { startGame };
})(gameBoard);



gameControl.startGame();