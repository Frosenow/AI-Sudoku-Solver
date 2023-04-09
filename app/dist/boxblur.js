"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Code inspired by: https://github.com/atomic14/ar-browser-sudoku/blob/894478d78d01a302a9a50448a539ec4ce180eeea/app/src/augmentedReality/imageProcessing/boxBlur.ts
const ImageInterface_1 = __importDefault(require("./ImageInterface"));
// Precalculate sum of each pixel
function precalculate(bytes, width, height) {
    const result = new Array(bytes.length);
    // Output array indexes
    let outputIdx = 0;
    // Input array indexes
    let inputIdx = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // pixel sum for current pixel value
            let sum = bytes[inputIdx];
            // Calculate sum around pixel
            if (x > 0)
                sum += result[outputIdx - 1];
            if (y > 0)
                sum += result[outputIdx - width];
            // Avoid duplicates
            if (x > 0 && y > 0)
                sum -= result[outputIdx - width - 1];
            result[outputIdx] = sum;
            outputIdx++;
            inputIdx++;
        }
    }
    return result;
}
function getPrecalculated(precalculated, w, h, x, y) {
    if (x < 0)
        x = 0;
    else if (x >= w)
        x = w - 1;
    if (y < 0)
        y = 0;
    else if (y >= h)
        y = h - 1;
    return precalculated[x + y * w];
}
function boxBlur(src, boxw, boxh) {
    const { width, height, bytes } = src;
    // Precalculated sums of rectangular regions around pixels
    const precalculated = precalculate(bytes, width, height);
    const result = new Uint8ClampedArray(width * height);
    let outputIdx = 0;
    // Calculate total number of pixels in the rectangular area to get multiplication factor
    const mul = 1.0 / ((boxw * 2 + 1) * (boxh * 2 + 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sum = getPrecalculated(precalculated, width, height, x + boxw, y + boxh) +
                getPrecalculated(precalculated, width, height, x - boxw, y - boxh) -
                getPrecalculated(precalculated, width, height, x - boxw, y + boxh) -
                getPrecalculated(precalculated, width, height, x + boxw, y - boxh);
            // Normalize the result so it stays in 0 - 255 range
            result[outputIdx] = sum * mul;
            outputIdx++;
        }
    }
    const output = new ImageInterface_1.default(result, width, height);
    return output;
}
exports.default = boxBlur;
//# sourceMappingURL=boxblur.js.map