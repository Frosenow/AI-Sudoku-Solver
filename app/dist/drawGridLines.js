"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homographicTransform_1 = require("./homographicTransform");
function createGridLines(transform, PROCESSING_SIZE) {
    const boxSize = PROCESSING_SIZE / 9;
    const gridLines = [];
    for (let l = 1; l < 9; l++) {
        // horizonal line
        gridLines.push({
            p1: (0, homographicTransform_1.transformPoint)({ x: 0, y: l * boxSize }, transform),
            p2: (0, homographicTransform_1.transformPoint)({ x: PROCESSING_SIZE, y: l * boxSize }, transform),
        });
        // vertical line
        gridLines.push({
            p1: (0, homographicTransform_1.transformPoint)({ y: 0, x: l * boxSize }, transform),
            p2: (0, homographicTransform_1.transformPoint)({ y: PROCESSING_SIZE, x: l * boxSize }, transform),
        });
    }
    return gridLines;
}
exports.default = createGridLines;
//# sourceMappingURL=drawGridLines.js.map