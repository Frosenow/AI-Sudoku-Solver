"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const canvas = require("canvas");
const ImageInterface_1 = require("./ImageInterface");
async function convertToGrayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = luminance;
        data[i + 1] = luminance;
        data[i + 2] = luminance;
    }
    (0, ImageInterface_1.saveImageLocally)(imageData, data);
}
module.exports = { convertToGrayscale };
//# sourceMappingURL=greyscale.js.map