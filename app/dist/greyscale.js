"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImageInterface_1 = __importDefault(require("./ImageInterface"));
async function convertToGrayscale(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    // Empty array to save one channel, grayscale image
    const bytes = new Uint8ClampedArray(width * height);
    // Convert to grayscale
    for (let y = 0; y < height; y++) {
        const row = y * width;
        for (let x = 0; x < width; x++) {
            // Extract only green channel because it has the biggest weight
            // grey = 0.299 * r + 0.587 * g + 0.114 * b;
            const g = imageData.data[(row + x) * 4 + 1];
            bytes[row + x] = g;
        }
    }
    const output = new ImageInterface_1.default(bytes, width, height);
    return output;
}
exports.default = convertToGrayscale;
//# sourceMappingURL=greyscale.js.map