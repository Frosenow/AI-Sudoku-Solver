const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

async function convertToGrayscale(rawImageData: Buffer) {
  const image = await loadImage(rawImageData);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");

  context.drawImage(image, 0, 0);
  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.getImageData(0, 0, width, height);
  const bytes = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      // Green Channel
      const g = imageData.data[(row + x) * 4 + 1];
      bytes[row + x] = g;
    }
  }

  // Create a new canvas with the grayscale image data
  const grayscaleImageData = context.createImageData(width, height);
  grayscaleImageData.data.set(bytes);
  context.putImageData(grayscaleImageData, 0, 0);

  // Save the grayscale image as a new file
  const stream = fs.createWriteStream("grayscale.png");
  const pngStream = canvas.createPNGStream();
  pngStream.pipe(stream);
}

module.exports = { convertToGrayscale };
