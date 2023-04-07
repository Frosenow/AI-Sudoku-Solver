const fs = require("fs");
const canvas = require("canvas");
import { getImageData } from "./getImageData";

async function convertToGrayscale(base64Image: string) {
  const imageData = await getImageData(base64Image);

  const height = imageData.height;
  const width = imageData.width;

  const bytes = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      // Green Channel
      const g = imageData.data[(row + x) * 4 + 1];
      bytes[row + x] = g;
    }
  }
  // create a new canvas
  const canvasObj = canvas.createCanvas(width, height);
  const context = canvasObj.getContext("2d");

  // create a new ImageData object from the bytes array
  const imageDataObj = new canvas.ImageData(bytes, width, height);

  // put the ImageData object onto the canvas
  context.putImageData(imageDataObj, 0, 0);

  // get the base64 data URL of the canvas
  const base64Data = canvasObj.toDataURL();
  // fs.writeFile("outpunt.txt", test, (err: any) => {
  //   console.log("saved");
  // });
}

module.exports = { convertToGrayscale };
