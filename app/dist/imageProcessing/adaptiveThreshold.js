import boxBlur from "./boxblur.js";
// Binarization of an image using adaptive thresholding
export default function adaptiveThreshold(image, threshold, blurSize) {
  const { width, height, bytes } = image;
  // Using blurred image to reduce noise and help with overexposed photos
  const blurred = boxBlur(image, blurSize, blurSize);
  const blurredBytes = blurred.bytes;
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      // Calculating difference between blurred pixel and regular pixel to get threshold value
      bytes[row + width + x] =
        blurredBytes[row + x] - bytes[row + width + x] > threshold ? 255 : 0;
    }
  }
  // Saving image for demonstration purpouse
  const outputImgData = image.toImageData();
  image.saveImageLocally(outputImgData.data, "thresholdedImage.png");
  return image;
}
//# sourceMappingURL=adaptiveThreshold.js.map
