"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs"));
async function recognizeDigits(digits) {
    // Load MNIST model
    const model = await tf.loadLayersModel("https://tfhub.dev/tensorflow/tfjs-model/mnist_convnet_v2/1/default/1", { strict: true });
    // Loop through all digits and recognize them
    for (const digit of digits) {
        // Extract digit image data and create ImageData object
        const imageData = digit.numberImage.bytes;
        const imageDataArray = new Uint8ClampedArray(imageData);
        const imageDataObj = new ImageData(imageDataArray, digit.numberImage.width, digit.numberImage.height);
        // Create tensor from image data and preprocess
        const imageTensor = tf.browser.fromPixels(imageDataObj, 1).toFloat();
        const resizedImage = tf.image.resizeBilinear(imageTensor, [28, 28]);
        const normalizedImage = resizedImage.div(tf.scalar(255));
        // Predict digit
        const prediction = model.predict(normalizedImage.reshape([1, 28, 28, 1]));
        const predictedDigit = tf.argMax(tf.flatten(prediction), 1).dataSync()[0];
        // Set contents property with predicted digit
        digit.contents = predictedDigit;
    }
}
exports.default = recognizeDigits;
//# sourceMappingURL=predict.js.map