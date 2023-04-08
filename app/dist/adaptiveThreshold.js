"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxblur_1 = __importDefault(require("./boxblur"));
function adaptiveThreshold(image, threshold, blurSize) {
    const { width, height, bytes } = image;
    const blurred = (0, boxblur_1.default)(image, blurSize, blurSize);
    const blurredBytes = blurred.bytes;
    for (let y = 0; y < height; y++) {
        const row = y * width;
        for (let x = 0; x < width; x++) {
            bytes[row + width + x] = blurredBytes[row + x] - bytes[row + width + x] > threshold ? 255 : 0;
        }
    }
    const test = image.toImageData();
    image.saveImageLocally(test.data, "threshold.png");
    return image;
}
exports.default = adaptiveThreshold;
//# sourceMappingURL=adaptiveThreshold.js.map