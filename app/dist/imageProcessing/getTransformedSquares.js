import ImageInterface from "./ImageInterface.js";
// This function applies an affine transformation to an input image and returns the resulting transformed image.
// The function takes in four arguments:
//   - source: an ImageInterface object representing the input image
//   - size: a number representing the dimensions of a square output image
//   - transform: a Transform object representing the affine transformation matrix
//   - outputFileName: a string representing the name of the file to save the transformed image to
export default function getTransformedSquares(
  source,
  size,
  transform,
  outputFileName
) {
  // Destructure the properties of the transformation matrix into separate variables for convenience
  const { a, b, c, d, e, f, g, h } = transform;
  // Create a new blank image object with the specified dimensions
  const result = ImageInterface.blankImage(size, size);
  // Loop through each pixel of the new image
  for (let y = 0; y < size; y++) {
    // Calculate the transformation values for this row of pixels
    const sxBias = b * y + c;
    const sxFactor = h * y + 1;
    const syBias = e * y + f;
    const syFactor = h * y + 1;
    for (let x = 0; x < size; x++) {
      // Calculate the corresponding pixel location in the source image using the transformation matrix
      const sx = Math.floor((a * x + sxBias) / (g * x + sxFactor));
      const sy = Math.floor((d * x + syBias) / (g * x + syFactor));
      // Set the value of the pixel in the new image to the corresponding pixel value in the source image
      result.bytes[y * size + x] = source.bytes[sy * source.width + sx];
    }
  }
  // Save the resulting image to a file with the specified name
  result.saveImageLocally(result.toImageData().data, outputFileName);
  // Return the resulting transformed image object
  return result;
}
//# sourceMappingURL=getTransformedSquares.js.map
