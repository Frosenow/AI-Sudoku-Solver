"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const canvas = require("canvas");
const ImageInterface_1 = __importDefault(require("./ImageInterface"));
async function convertToGrayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Calculate luminance using different weighting of the color channels
        const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = luminance;
        data[i + 1] = luminance;
        data[i + 2] = luminance;
    }
    const output = new ImageInterface_1.default(data, imageData.width, imageData.height);
    output.saveImageLocally(data, "test.png");
}
module.exports = { convertToGrayscale };
//# sourceMappingURL=greyscale.js.map