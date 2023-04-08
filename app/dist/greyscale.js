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
    const bytes = new Uint8ClampedArray(width * height);
    for (let y = 0; y < height; y++) {
        const row = y * width;
        for (let x = 0; x < width; x++) {
            const g = imageData.data[(row + x) * 4 + 1];
            bytes[row + x] = g;
        }
    }
    const output = new ImageInterface_1.default(bytes, width, height);
    return output;
}
exports.default = convertToGrayscale;
//# sourceMappingURL=greyscale.js.map