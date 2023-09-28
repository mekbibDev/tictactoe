var gameBoard = (function () {

  var _board = _createBoard();

  var getBoard = () => _board;

  var setToken = (row, column, token) => {
    if (_board[row][column] === 'empty')
      _board[row][column] = token;
  }

  var resetBoard = () => {
    _board = _createBoard();
  };

  function _createBoard() {
    const row = 3;
    const column = 3;
    var board = Array(row).fill([]);

    for (let i = 0; i < column; i++) {
      board[i] = Array(column).fill('empty');
    }
    return board;
  }
  return { getBoard, setToken, resetBoard };
})();
