"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = void 0;
const greyscale_1 = __importDefault(require("./greyscale"));
const adaptiveThreshold_1 = __importDefault(require("./adaptiveThreshold"));
const largestObjectLocalisation_1 = require("./largestObjectLocalisation");
const cornerDetection_1 = __importDefault(require("./cornerDetection"));
const sanityCheck_1 = __importDefault(require("./sanityCheck"));
const homographicTransform_1 = require("./homographicTransform");
const createGridLines_1 = __importDefault(require("./createGridLines"));
const getTransformedSquares_1 = __importDefault(require("./getTransformedSquares"));
const extractBoxes_1 = require("./extractBoxes");
const predictDigits_1 = __importDefault(require("../digitsRecognition/predictDigits"));
async function processor(imageObject) {
    const grayscaleImg = await (0, greyscale_1.default)(imageObject);
    const thresholded = (0, adaptiveThreshold_1.default)(grayscaleImg, 20, 20);
    const largestBlob = (0, largestObjectLocalisation_1.getLargestBlob)(thresholded, {
        minAspectRatio: 0.5,
        maxAspectRatio: 1.5,
        minSize: Math.min(imageObject.width, imageObject.height) * 0.3,
        maxSize: Math.max(imageObject.width, imageObject.height) * 0.9,
    });
    if (largestBlob) {
        const cornerPoints = (0, cornerDetection_1.default)(largestBlob);
        thresholded.saveImageLocally(imageObject.data, "cornerPointsImage.png", largestBlob, cornerPoints);
        if ((0, sanityCheck_1.default)(cornerPoints)) {
            const PROCESSING_SIZE = 900;
            const transform = (0, homographicTransform_1.homographicTransform)(PROCESSING_SIZE, cornerPoints);
            const gridLines = (0, createGridLines_1.default)(transform, PROCESSING_SIZE);
            thresholded.drawGridLines(gridLines, imageObject.data, "gridLines.png");
            const extractedGrayscaleImage = (0, getTransformedSquares_1.default)(grayscaleImg, PROCESSING_SIZE, transform, "greyscaleExtracted.png");
            const extractedThresholdImage = (0, getTransformedSquares_1.default)(thresholded, PROCESSING_SIZE, transform, "thresholdExtracted.png");
            const boxes = (0, extractBoxes_1.extractSudokuBoxes)(extractedGrayscaleImage, extractedThresholdImage);
            await (0, predictDigits_1.default)(boxes);
            boxes.forEach((box, idx) => {
                box.numberImage.saveImageLocally(box.numberImage.toImageData().data, `./digits/digit${idx}-predicted${box.contents}.png`);
            });
        }
    }
    else {
        console.log("Largest Blob not found");
    }
}
exports.processor = processor;
//# sourceMappingURL=imageProcessor.js.map