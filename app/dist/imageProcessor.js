"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processor = void 0;
const greyscale_1 = __importDefault(require("./greyscale"));
const adaptiveThreshold_1 = __importDefault(require("./adaptiveThreshold"));
const largestObjectLocalisation_1 = __importDefault(require("./largestObjectLocalisation"));
const cornerDetection_1 = __importDefault(require("./cornerDetection"));
const sanityCheck_1 = __importDefault(require("./sanityCheck"));
const HomographicTransform_1 = __importDefault(require("./HomographicTransform"));
async function processor(imageObject) {
    const grayscaleImg = await (0, greyscale_1.default)(imageObject);
    const thresholded = (0, adaptiveThreshold_1.default)(grayscaleImg, 20, 20);
    const largestBlob = (0, largestObjectLocalisation_1.default)(thresholded, {
        minAspectRatio: 0.5,
        maxAspectRatio: 1.5,
        minSize: Math.min(imageObject.width, imageObject.height) * 0.3,
        maxSize: Math.max(imageObject.width, imageObject.height) * 0.9,
    });
    if (largestBlob) {
        const cornerPoints = (0, cornerDetection_1.default)(largestBlob);
        console.log(cornerPoints);
        thresholded.saveImageLocally(imageObject.data, "cornerPointsImage.png", largestBlob, cornerPoints);
        if ((0, sanityCheck_1.default)(cornerPoints)) {
            const PROCESSING_SIZE = 900;
            const transform = (0, HomographicTransform_1.default)(PROCESSING_SIZE, cornerPoints);
            console.log(transform);
        }
    }
    else {
        console.log("Largest Blob not found");
    }
}
exports.processor = processor;
//# sourceMappingURL=imageProcessor.js.map