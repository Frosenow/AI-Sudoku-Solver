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
    convertToData() {
        const imageData = new ImageData(this.width, this.height);
        for (let y = 0; y < this.height; y++) {
            const row = y * this.width;
            for (let x = 0; x < this.width; x++) {
                const value = this.bytes[row + x];
                imageData.data[(row + x) * 4] = value;
                imageData.data[(row + x) * 4 + 1] = value;
                imageData.data[(row + x) * 4 + 2] = value;
                imageData.data[(row + x) * 4 + 3] = 255;
            }
        }
        return imageData;
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