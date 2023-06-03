"use strict";
// Utility functions for Sudoku
// Generate a random Sudoku grid
function generateRandomGrid() {
    const grid = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const value = Math.floor(Math.random() * 9) + 1;
            row.push(value);
        }
        grid.push(row);
    }
    return grid;
}
// Calculate the fitness of a Sudoku grid
function calculateFitness(grid) {
    let fitness = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const value = grid[i][j];
            const row = getRow(grid, i);
            const column = getColumn(grid, j);
            const square = getSquare(grid, i, j);
            if (isValid(value, row) &&
                isValid(value, column) &&
                isValid(value, square)) {
                fitness++;
            }
        }
    }
    return fitness;
}
// Check if a value is valid in a row, column, or square
function isValid(value, array) {
    const count = array.filter((num) => num === value).length;
    return count === 1;
}
// Get a row from the Sudoku grid
function getRow(grid, rowIndex) {
    return grid[rowIndex];
}
// Get a column from the Sudoku grid
function getColumn(grid, columnIndex) {
    const column = [];
    for (let i = 0; i < 9; i++) {
        column.push(grid[i][columnIndex]);
    }
    return column;
}
// Get a 3x3 square from the Sudoku grid
function getSquare(grid, rowIndex, columnIndex) {
    const square = [];
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startColumn = Math.floor(columnIndex / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startColumn; j < startColumn + 3; j++) {
            square.push(grid[i][j]);
        }
    }
    return square;
}
// Print the Sudoku grid
function printGrid(grid) {
    for (let i = 0; i < 9; i++) {
        console.log(grid[i].join(" "));
    }
}
module.exports = {
    generateRandomGrid,
    calculateFitness,
    getRow,
    getColumn,
    getSquare,
    printGrid,
};
//# sourceMappingURL=sudokuUtils.js.map