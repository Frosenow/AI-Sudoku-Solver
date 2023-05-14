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
const tf = __importStar(require("@tensorflow/tfjs-node"));
const { createCanvas } = require("canvas");
const fs = require("fs");
const Jimp = require("jimp");
const MODEL_URL = tf.io.fileSystem("./tfjs_model/model.json");
const folderPath = "./results/digits";
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
    readGrayscaleImages(folderPath).then((boxesArr) => {
        boxesArr.forEach((box) => {
            const canvas = createCanvas(box.width, box.height);
            const ctx = canvas.getContext("2d");
            const imageDataObj = ctx.createImageData(box.width, box.height);
            imageDataObj.data.set(box.data);
            const img = tf.browser
                .fromPixels(imageDataObj, 1)
                .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
                .toFloat();
        });
    });
}
exports.default = fillInPrediction;
async function readGrayscaleImages(folderPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, async (err, files) => {
            if (err) {
                reject(`Error reading folder ${folderPath}: ${err}`);
                return;
            }
            const imageDataArray = [];
            for (const file of files) {
                const filePath = `${folderPath}/${file}`;
                try {
                    const image = await Jimp.read(filePath);
                    const imageData = {
                        data: image.bitmap.data,
                        width: image.bitmap.width,
                        height: image.bitmap.height,
                    };
                    imageDataArray.push(imageData);
                }
                catch (err) {
                    reject(`Error reading image ${filePath}: ${err}`);
                }
            }
            resolve(imageDataArray);
        });
    });
}
//# sourceMappingURL=predictDigits.js.map