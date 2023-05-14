"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homographicTransform_1 = require("./homographicTransform");
// Define a function named createGridLines that takes in a Transform object and a PROCESSING_SIZE number
function createGridLines(transform, PROCESSING_SIZE) {
    // Calculate the size of each box
    const boxSize = PROCESSING_SIZE / 9;
    // Initialize an empty array to store the grid lines
    const gridLines = [];
    // Loop through each grid line
    for (let l = 1; l < 9; l++) {
        // Calculate the coordinates of the two endpoints of the horizontal line and push it into the gridLines array
        gridLines.push({
            p1: (0, homographicTransform_1.transformPoint)({ x: 0, y: l * boxSize }, transform),
            p2: (0, homographicTransform_1.transformPoint)({ x: PROCESSING_SIZE, y: l * boxSize }, transform),
        });
        // Calculate the coordinates of the two endpoints of the vertical line and push it into the gridLines array
        gridLines.push({
            p1: (0, homographicTransform_1.transformPoint)({ y: 0, x: l * boxSize }, transform),
            p2: (0, homographicTransform_1.transformPoint)({ y: PROCESSING_SIZE, x: l * boxSize }, transform),
        });
    }
    // Return the array of grid lines
    return gridLines;
}
exports.default = createGridLines;
//# sourceMappingURL=createGridLines.js.map