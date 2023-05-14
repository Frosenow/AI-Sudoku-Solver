"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSudokuBoxes = void 0;
const largestObjectLocalisation_1 = require("./largestObjectLocalisation");
// Function to extract each box from the Sudoku grid
function extractSudokuBoxes(grayscaleImage, thresholdedImage) {
    const boxes = [];
    // Define the size of the grid and each box
    const imageSize = grayscaleImage.width;
    const boxSize = imageSize / 9;
    // Define the size of the search area within each box
    const searchSize = boxSize / 5;
    // Iterate over each box in the grid
    for (let yIndex = 0; yIndex < 9; yIndex++) {
        for (let xIndex = 0; xIndex < 9; xIndex++) {
            // Define variables to keep track of the boundaries and contents of each box
            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;
            let maxX = 0;
            let maxY = 0;
            let pointsCount = 0;
            // Define the boundaries of the search area within the current box
            const searchX1 = xIndex * boxSize + searchSize;
            const searchY1 = yIndex * boxSize + searchSize;
            const searchX2 = xIndex * boxSize + boxSize - searchSize;
            const searchY2 = yIndex * boxSize + boxSize - searchSize;
            // Iterate over each pixel in the search area and check if it is part of a blob
            for (let searchY = searchY1; searchY < searchY2; searchY++) {
                for (let searchX = searchX1; searchX < searchX2; searchX++) {
                    if (thresholdedImage.bytes[searchY * imageSize + searchX] === 255) {
                        // If the pixel is part of a blob, update the boundaries and count of the current box
                        const component = (0, largestObjectLocalisation_1.findBlob)(thresholdedImage, searchX, searchY);
                        const foundWidth = component.bounds.bottomRight.x - component.bounds.topLeft.x;
                        const foundHeight = component.bounds.bottomRight.y - component.bounds.topLeft.y;
                        if (component.points.length > 10 &&
                            foundWidth < boxSize &&
                            foundHeight < boxSize) {
                            minX = Math.min(minX, component.bounds.topLeft.x);
                            minY = Math.min(minY, component.bounds.topLeft.y);
                            maxX = Math.max(maxX, component.bounds.bottomRight.x);
                            maxY = Math.max(maxY, component.bounds.bottomRight.y);
                            pointsCount += component.points.length;
                        }
                    }
                }
            }
            // Calculate the width and height of the current box
            const foundWidth = maxX - minX;
            const foundHeight = maxY - minY;
            // Check if the box has a valid number and add it to the results
            if (pointsCount > 10 &&
                foundWidth < boxSize &&
                foundHeight < boxSize &&
                foundWidth > boxSize / 10 &&
                foundHeight > boxSize / 3) {
                const numberImage = grayscaleImage.createSubImage(Math.max(0, minX - 2), Math.max(0, minY - 2), Math.min(imageSize - 1, maxX + 2), Math.min(imageSize - 1, maxY + 2));
                boxes.push({
                    x: xIndex,
                    y: yIndex,
                    minX,
                    maxX,
                    minY,
                    maxY,
                    numberImage,
                    contents: 0,
                });
            }
        }
    }
    return boxes;
}
exports.extractSudokuBoxes = extractSudokuBoxes;
//# sourceMappingURL=extractBoxes.js.map