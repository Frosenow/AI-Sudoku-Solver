import ImageInterface from "./ImageInterface";

async function convertToGrayscale(imageData: ImageData): Promise<ImageInterface> {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const bytes = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const g = imageData.data[(row + x) * 4 + 1];
      bytes[row + x] = g;
    }
  }
  const output = new ImageInterface(bytes, width, height);
  return output;
}

module.exports = { convertToGrayscale };
