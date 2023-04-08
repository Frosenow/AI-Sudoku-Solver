"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = void 0;
const greyscale_1 = __importDefault(require("./greyscale"));
const adaptiveThreshold_1 = __importDefault(require("./adaptiveThreshold"));
async function processor(imageObject) {
    const grayscaleImg = await (0, greyscale_1.default)(imageObject);
    //   const boxblur = boxBlur(grayscaleImg, 20, 20);
    const thresholded = (0, adaptiveThreshold_1.default)(grayscaleImg, 20, 20);
}
exports.processor = processor;
//# sourceMappingURL=imageProcessor.js.map