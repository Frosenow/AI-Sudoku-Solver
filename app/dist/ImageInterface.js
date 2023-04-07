"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveImageLocally = void 0;
const canvas = require("canvas");
const fs = require("fs");
function saveImageLocally(imageData, dataToSave) {
    const canvasObj = canvas.createCanvas(imageData.width, imageData.height);
    const ctx = canvasObj.getContext("2d");
    const newImageData = ctx.createImageData(imageData.width, imageData.height);
    newImageData.data.set(dataToSave);
    ctx.putImageData(newImageData, 0, 0);
    const out = fs.createWriteStream("output.png");
    const stream = canvasObj.createPNGStream();
    stream.pipe(out);
}
exports.saveImageLocally = saveImageLocally;
//# sourceMappingURL=ImageInterface.js.map