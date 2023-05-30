export default class SudokuBoard {
  constructor() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  addDigit(row, col, digit) {
    this.board[row][col] = digit;
  }

  toString() {
    let output = "";
    for (let row = 0; row < this.board.length; row++) {
      if (row > 0 && row % 3 === 0) {
        output += "+-------+-------+-------+\n";
      }
      for (let col = 0; col < this.board[row].length; col++) {
        if (col === 0) {
          output += "| ";
        } else if (col % 3 === 0) {
          output += "| ";
        }
        const digit = this.board[row][col] || " ";
        output += digit + " ";
      }
      output += "|\n";
    }
    output += "+-------+-------+-------+";
    return output;
  }
}
