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
    this.copy = [
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
    this.errorMessages = [];
    this.isDisplayingErrorMessage = false;
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
        cellValue === 0
          ? cell.classList.add("sudoku-cell")
          : cell.classList.add("sudoku-cell", "fixed");

        if (!cell.classList.contains("fixed") && cellValue !== 0) {
          cell.classList.add("guess");
        }

        cell.value = cellValue !== 0 ? cellValue : "";
        cell.id = `cell-${row}-${col}`;
        cell.addEventListener("input", () => this.handleCellInput(row, col));
        sudokuGrid.appendChild(cell);
      }
    }

    this.addGridLines();
  }

  renderSolvedSudokuGrid() {
    const sudokuGrid = document.getElementById("sudoku-grid");
    sudokuGrid.innerHTML = "";

    for (let row = 0; row < this.copy.length; row++) {
      for (let col = 0; col < this.copy[row].length; col++) {
        const cellValue = this.copy[row][col];
        const originalCellValue = this.board[row][col];
        const cell = document.createElement("input");
        cell.type = "number";

        if (cellValue !== originalCellValue) {
          cell.classList.add("sudoku-cell", "guess");
        } else {
          cell.classList.add("sudoku-cell", "fixed");
        }

        cell.value = cellValue !== 0 ? cellValue : "";
        cell.id = `cell-${row}-${col}`;
        cell.addEventListener("input", () => this.handleCellInput(row, col));
        sudokuGrid.appendChild(cell);
      }
    }

    this.addGridLines();
  }

  addGridLines() {
    const sudokuGrid = document.getElementById("sudoku-grid");

    // Remove existing grid lines
    const existingGridLines = sudokuGrid.querySelectorAll(".grid-line");
    existingGridLines.forEach((line) => line.remove());

    // Add horizontal grid lines
    for (let i = 1; i < 3; i++) {
      const line = document.createElement("div");
      line.classList.add("grid-line", "horizontal-line", `line-${i}`);
      sudokuGrid.appendChild(line);
    }

    // Add vertical grid lines
    for (let i = 1; i < 3; i++) {
      const line = document.createElement("div");
      line.classList.add("grid-line", "vertical-line", `line-${i}`);
      sudokuGrid.appendChild(line);
    }
  }

  handleCellInput(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    const digit = parseInt(cell.value);
    if (!isNaN(digit) && digit >= 1 && digit <= 9) {
      this.addDigit(row, col, digit);
    } else {
      this.addDigit(row, col, 0);
    }
    console.log(this.board);
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

  solve() {
    // Copy the board to the working copy
    this.copy = this.board.map((row) => row.slice());

    // Start solving the puzzle
    const isSolved = this.solvePuzzle();

    if (isSolved) {
      console.log("Sudoku puzzle solved!");
      this.renderSolvedSudokuGrid(); // Call the new method to render the solved Sudoku
    } else {
      const errorMessage = "Unable to solve the Sudoku puzzle";
      this.displayErrorMessage(errorMessage);
    }
  }

  solvePuzzle() {
    for (let row = 0; row < this.copy.length; row++) {
      for (let col = 0; col < this.copy[row].length; col++) {
        if (this.copy[row][col] === 0) {
          for (let digit = 1; digit <= 9; digit++) {
            if (this.isSafe(row, col, digit)) {
              this.copy[row][col] = digit;
              if (this.solvePuzzle()) {
                return true;
              }
              this.copy[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isSafe(row, col, digit) {
    return (
      this.isRowSafe(row, digit) &&
      this.isColumnSafe(col, digit) &&
      this.isBoxSafe(row - (row % 3), col - (col % 3), digit)
    );
  }

  isRowSafe(row, digit) {
    for (let col = 0; col < this.copy[row].length; col++) {
      if (this.copy[row][col] === digit) {
        return false;
      }
    }
    return true;
  }

  isColumnSafe(col, digit) {
    for (let row = 0; row < this.copy.length; row++) {
      if (this.copy[row][col] === digit) {
        return false;
      }
    }
    return true;
  }

  isBoxSafe(startRow, startCol, digit) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.copy[startRow + row][startCol + col] === digit) {
          return false;
        }
      }
    }
    return true;
  }

  checkValidity() {
    const invalidDigits = [];

    // Check rows for duplicates
    for (let row = 0; row < this.board.length; row++) {
      const rowDigits = new Set();
      for (let col = 0; col < this.board[row].length; col++) {
        const digit = this.board[row][col];
        if (digit !== 0) {
          if (rowDigits.has(digit)) {
            invalidDigits.push({ row, col, digit });
          } else {
            rowDigits.add(digit);
          }
        }
      }
    }

    // Check columns for duplicates
    for (let col = 0; col < this.board[0].length; col++) {
      const colDigits = new Set();
      for (let row = 0; row < this.board.length; row++) {
        const digit = this.board[row][col];
        if (digit !== 0) {
          if (colDigits.has(digit)) {
            invalidDigits.push({ row, col, digit });
          } else {
            colDigits.add(digit);
          }
        }
      }
    }

    // Check grids for duplicates
    for (let startRow = 0; startRow < this.board.length; startRow += 3) {
      for (let startCol = 0; startCol < this.board[0].length; startCol += 3) {
        const gridDigits = new Set();
        for (let row = startRow; row < startRow + 3; row++) {
          for (let col = startCol; col < startCol + 3; col++) {
            const digit = this.board[row][col];
            if (digit !== 0) {
              if (gridDigits.has(digit)) {
                invalidDigits.push({ row, col, digit });
              } else {
                gridDigits.add(digit);
              }
            }
          }
        }
      }
    }

    if (invalidDigits.length > 0) {
      const errorMessage = "Invalid digits found";
      invalidDigits.forEach(({ row, col, digit }) => {
        // console.log(`Digit ${digit} at row ${row} and column ${col}`);
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add("invalid");
      });
      this.displayErrorMessage(errorMessage);
      return false;
    } else {
      console.log("Sudoku board is valid.");
      return true;
    }
  }

  displayErrorMessage(message, duration = 1000) {
    this.errorMessages.push({ message, duration });
    if (!this.isDisplayingErrorMessage) {
      this.showNextErrorMessage();
    }
  }

  showNextErrorMessage() {
    const errorMessage = document.querySelector(".error-message");
    if (this.errorMessages.length > 0) {
      const { message, duration } = this.errorMessages.shift();
      errorMessage.textContent = message.trim();
      errorMessage.style.display = "block";
      errorMessage.classList.add("show");
      this.isDisplayingErrorMessage = true;
      setTimeout(() => {
        errorMessage.classList.remove("show");
        setTimeout(() => {
          errorMessage.style.display = "none";
          this.isDisplayingErrorMessage = false;
          this.showNextErrorMessage();
        }, 500);
      }, duration);
    }
  }
}
