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
    saveImageLocally(dataToSave, outputFilename, cordinates) {
        const canvasObj = canvas.createCanvas(this.width, this.height);
        const ctx = canvasObj.getContext("2d");
        const newImageData = ctx.createImageData(this.width, this.height);
        newImageData.data.set(dataToSave);
        ctx.putImageData(newImageData, 0, 0);
        if (cordinates) {
            ctx.lineWidth = 9;
            ctx.strokeStyle = "green";
            ctx.strokeRect(cordinates?.bounds.topLeft.x, cordinates?.bounds.topLeft.y, cordinates?.width, cordinates?.height);
        }
        const out = fs.createWriteStream(outputFilename);
        const stream = canvasObj.createPNGStream();
        stream.pipe(out);
    }
    toImageData() {
        const imageData = new canvas.ImageData(this.width, this.height);
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
    get copy() {
        return new ImageInterface(new Uint8ClampedArray(this.bytes), this.width, this.height);
    }
}
exports.default = ImageInterface;
//# sourceMappingURL=ImageInterface.js.map