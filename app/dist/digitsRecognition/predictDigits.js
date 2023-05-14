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
exports.getClasses = void 0;
const tfn = __importStar(require("@tensorflow/tfjs-node"));
const tf = __importStar(require("@tensorflow/tfjs"));
const MODEL_URL = tfn.io.fileSystem("./tfjs_model/model.json");
const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const IMAGE_SIZE = 20;
let _model = undefined;
let modelLoadingPromise = undefined;
async function loadModel() {
    const model = await tf.loadLayersModel(MODEL_URL);
    return model;
}
loadModel().then(() => console.log("Model Loaded", console.error));
async function getClasses(logits) {
    const logitsArray = (await logits.array());
    const classes = logitsArray.map((values) => {
        let maxProb = 0;
        let maxIndex = 0;
        values.forEach((value, index) => {
            if (value > maxProb) {
                maxProb = value;
                maxIndex = index;
            }
        });
        return CLASSES[maxIndex];
    });
    return classes;
}
exports.getClasses = getClasses;
async function fillInPrediction(boxes) {
    const model = await loadModel();
    const logits = tf.tidy(() => {
        // convert the images into tensors
        const images = boxes.map((box) => {
            const imageObj = box.numberImage.toImageData();
            const pixelData = new Uint8Array(imageObj.data);
            const width = imageObj.width;
            const height = imageObj.height;
            const img = tf.browser
                .fromPixels({ data: pixelData, width, height }, 1)
                .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
                .toFloat();
            const mean = img.mean();
            const std = tf.moments(img).variance.sqrt();
            const normalized = img.sub(mean).div(std);
            const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 1]);
            return batched;
        });
        const input = tf.concat(images);
        // Make the predictions
        return model.predict(input, {
            batchSize: boxes.length,
        });
    });
    // Convert logits to probabilities and class names.
    const classes = await getClasses(logits);
    // fill in the boxes with the results
    classes.forEach((className, index) => (boxes[index].contents = className));
}
exports.default = fillInPrediction;
//# sourceMappingURL=predictDigits.js.map