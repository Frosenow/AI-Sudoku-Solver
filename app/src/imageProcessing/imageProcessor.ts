import ImageInterface from "./ImageInterface";
import boxBlur from "./boxblur";
import convertToGrayscale from "./greyscale";
import adaptiveThreshold from "./adaptiveThreshold";
import getLargestBlob from "./largestObjectLocalisation";

export async function processor(imageObject: ImageData): Promise<void> {
  const grayscaleImg = await convertToGrayscale(imageObject);
  const thresholded = adaptiveThreshold(grayscaleImg, 20, 20);
  getLargestBlob(thresholded, {
    minAspectRatio: 0.5,
    maxAspectRatio: 1.5,
    minSize: Math.min(imageObject.width, imageObject.height) * 0.3,
    maxSize: Math.max(imageObject.width, imageObject.height) * 0.9,
  });
}
