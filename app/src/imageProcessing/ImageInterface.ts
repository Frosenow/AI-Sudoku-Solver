const canvas = require("canvas");
const fs = require("fs");

interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export function saveImageLocally(
  imageData: ImageData,
  dataToSave: Uint8ClampedArray
): void {
  const canvasObj = canvas.createCanvas(imageData.width, imageData.height);
  const ctx = canvasObj.getContext("2d");
  const newImageData = ctx.createImageData(imageData.width, imageData.height);
  newImageData.data.set(dataToSave);
  ctx.putImageData(newImageData, 0, 0);

  const out = fs.createWriteStream("output.png");
  const stream = canvasObj.createPNGStream();
  stream.pipe(out);
}
