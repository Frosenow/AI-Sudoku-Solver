const fs = require("fs");
const canvas = require("canvas");
import ImageInterface from "./ImageInterface";

async function convertToGrayscale(
  imageData: ImageData
): Promise<ImageInterface> {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Calculate luminance using different weighting of the color channels
    const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    data[i] = luminance;
    data[i + 1] = luminance;
    data[i + 2] = luminance;
  }
  const output = new ImageInterface(data, imageData.width, imageData.height);
  return output;
}

module.exports = { convertToGrayscale };
