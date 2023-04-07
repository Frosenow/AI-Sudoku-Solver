const canvas = require("canvas");
const fs = require("fs");

export default class ImageInterface {
  bytes: Uint8ClampedArray;
  width: number;
  height: number;
  constructor(bytes: Uint8ClampedArray, width: number, height: number) {
    this.bytes = bytes;
    this.width = width;
    this.height = height;
  }

  saveImageLocally(
    dataToSave: Uint8ClampedArray,
    outputFilename: string
  ): void {
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
