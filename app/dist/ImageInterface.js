"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas = require("canvas");
const fs = require("fs");
class ImageInterface {
    constructor(bytes, width, height) {
        this.bytes = bytes;
        this.width = width;
        this.height = height;
    }
    saveImageLocally(dataToSave, outputFilename) {
        const canvasObj = canvas.createCanvas(this.width, this.height);
        const ctx = canvasObj.getContext("2d");
        const newImageData = ctx.createImageData(this.width, this.height);
        newImageData.data.set(dataToSave);
        ctx.putImageData(newImageData, 0, 0);
        const out = fs.createWriteStream(outputFilename);
        const stream = canvasObj.createPNGStream();
        stream.pipe(out);
    }
}
exports.default = ImageInterface;
//# sourceMappingURL=ImageInterface.js.map