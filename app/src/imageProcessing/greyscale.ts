import ImageInterface from "./ImageInterface";

export default async function convertToGrayscale(
  imageData: ImageData
): Promise<ImageInterface> {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Empty array to save one channel, grayscale image
  const bytes = new Uint8ClampedArray(width * height);

  // Convert to grayscale
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      // Extract only green channel because it has the biggest weight
      // grey = 0.299 * r + 0.587 * g + 0.114 * b;
      const g = imageData.data[(row + x) * 4 + 1];
      bytes[row + x] = g;
    }
  }
  const output = new ImageInterface(bytes, width, height);

  // Saving image for demonstration purpouse
  const outputImgData = output.toImageData();
  output.saveImageLocally(outputImgData.data, "greyscaleImage.png");

  return output;
}
