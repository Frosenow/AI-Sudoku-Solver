import ImageInterface from "./ImageInterface";
import boxBlur from "./boxblur";
import convertToGrayscale from "./greyscale";
import adaptiveThreshold from "./adaptiveThreshold";
import getLargestBlob from "./largestObjectLocalisation";
import getCornersCords from "./cornerDetection";
import sanityCheck from "./sanityCheck";
import { homographicTransform } from "./homographicTransform";
import createGridLines from "./createGridLines";
import getTransformedSquares from "./getTransformedSquares";

export async function processor(imageObject: ImageData): Promise<void> {
  const grayscaleImg = await convertToGrayscale(imageObject);
  const thresholded = adaptiveThreshold(grayscaleImg, 20, 20);
  const largestBlob = getLargestBlob(thresholded, {
    minAspectRatio: 0.5,
    maxAspectRatio: 1.5,
    minSize: Math.min(imageObject.width, imageObject.height) * 0.3,
    maxSize: Math.max(imageObject.width, imageObject.height) * 0.9,
  });

  if (largestBlob) {
    const cornerPoints = getCornersCords(largestBlob);
    console.log(cornerPoints);
    thresholded.saveImageLocally(
      imageObject.data,
      "cornerPointsImage.png",
      largestBlob,
      cornerPoints
    );
    if (sanityCheck(cornerPoints)) {
      const PROCESSING_SIZE = 900;
      const transform = homographicTransform(PROCESSING_SIZE, cornerPoints);
      console.log(transform);
      const gridLines = createGridLines(transform, PROCESSING_SIZE);
      thresholded.drawGridLines(gridLines, imageObject.data, "gridLines.png");

      const extractedGrayscaleImage = getTransformedSquares(
        grayscaleImg,
        PROCESSING_SIZE,
        transform,
        "greyscaleExtracted.png"
      );

      const extractedThresholdImage = getTransformedSquares(
        thresholded,
        PROCESSING_SIZE,
        transform,
        "thresholdExtracted.png"
      );
    }
  } else {
    console.log("Largest Blob not found");
  }
}
