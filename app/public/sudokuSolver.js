export default async function solveSudoku(puzzle) {
  const size = 9; // Size of the Sudoku puzzle
  const boxSize = 3; // Size of each sub-grid (box)

  // Function to find an empty cell in the puzzle
  function findEmptyCell(puzzle) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (puzzle[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  // Function to check if a number is valid in a specific cell
  function isValid(num, row, col) {
    // Check if the number is valid in the current row
    for (let i = 0; i < size; i++) {
      if (puzzle[i][col] === num && i !== row) {
        return false;
      }
    }

    // Check if the number is valid in the current column
    for (let i = 0; i < size; i++) {
      if (puzzle[row][i] === num && i !== col) {
        return false;
      }
    }

    // Check if the number is valid in the current box
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    for (let i = boxRow; i < boxRow + boxSize; i++) {
      for (let j = boxCol; j < boxCol + boxSize; j++) {
        if (puzzle[i][j] === num && i !== row && j !== col) {
          return false;
        }
      }
    }

    return true;
  }

  // Function to solve the puzzle using backtracking
  async function solve() {
    const emptyCell = findEmptyCell(puzzle);

    // If there are no empty cells, the puzzle is solved
    if (emptyCell === null) {
      return true;
    }

    const [row, col] = emptyCell;

    // Try filling the empty cell with numbers from 1 to 9
    for (let num = 1; num <= size; num++) {
      if (isValid(num, row, col)) {
        puzzle[row][col] = num;

        // Recursively solve the remaining puzzle
        if (await solve()) {
          return true;
        }

        // If the current configuration leads to a dead end, reset the cell
        puzzle[row][col] = 0;
      }
    }

    // If no number can be placed in the current cell, backtrack
    return false;
  }

  // Make a copy of the puzzle to avoid modifying the original array
  const puzzleCopy = puzzle.map((row) => row.slice());

  // Solve the puzzle
  if (await solve()) {
    return puzzleCopy;
  } else {
    return null;
  }
}
