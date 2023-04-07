"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const canvas = require("canvas");
const getImageData_1 = require("./getImageData");
async function convertToGrayscale(base64Image) {
    const imageData = await (0, getImageData_1.getImageData)(base64Image);
    const bytes = new Uint8ClampedArray(imageData.data.length);
    const height = imageData.height;
    const width = imageData.width;
    for (let y = 0; y < height; y++) {
        const row = y * width;
        for (let x = 0; x < width; x++) {
            // Green Channel
            const g = imageData.data[(row + x) * 4 + 1];
            bytes[row + x] = g;
        }
    }
}
module.exports = { convertToGrayscale };
//# sourceMappingURL=greyscale.js.map