import ImageInterface from "./ImageInterface";

async function convertToGrayscale(imageData: ImageData): Promise<ImageInterface> {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const bytes = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const g = imageData.data[(row + x) * 4 + 1];
      bytes[(row + x) * 4] = g;
      bytes[(row + x) * 4 + 1] = g;
      bytes[(row + x) * 4 + 2] = g;
      bytes[(row + x) * 4 + 3] = 255;
    }
  }
  const output = new ImageInterface(bytes, width, height);
  output.saveImageLocally(output.bytes, "test.png");
  return output;
}

module.exports = { convertToGrayscale };
