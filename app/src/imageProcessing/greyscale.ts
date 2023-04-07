const fs = require("fs");
const canvas = require("canvas");
import { saveImageLocally } from "./ImageInterface";

interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

async function convertToGrayscale(imageData: ImageData) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    data[i] = luminance;
    data[i + 1] = luminance;
    data[i + 2] = luminance;
  }
  saveImageLocally(imageData, data);
}

module.exports = { convertToGrayscale };
