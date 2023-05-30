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
    this.renderSudokuGrid();
  }

  renderSudokuGrid() {
    const sudokuGrid = document.getElementById("sudoku-grid");
    sudokuGrid.innerHTML = "";

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const cellValue = this.board[row][col];
        const cell = document.createElement("input");
        cell.type = "number";
        cell.classList.add("sudoku-cell");
        cell.value = cellValue !== 0 ? cellValue : "";
        cell.id = `cell-${row}-${col}`; // Add the ID to the cell
        cell.addEventListener("input", () => this.handleCellInput(row, col));
        sudokuGrid.appendChild(cell);
      }
    }
  }

  handleCellInput(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    const digit = parseInt(cell.value);
    if (!isNaN(digit)) {
      this.addDigit(row, col, digit);
    }
  }

  selectCell(row, col) {
    const cells = document.querySelectorAll(".sudoku-cell");
    cells.forEach((cell) => cell.classList.remove("selected"));
    const selectedCell = document.getElementById(`cell-${row}-${col}`);
    selectedCell.classList.add("selected");
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
