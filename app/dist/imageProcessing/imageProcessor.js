import convertToGrayscale from "./greyscale.js";
import adaptiveThreshold from "./adaptiveThreshold.js";
import { getLargestBlob } from "./largestObjectLocalisation.js";
import getCornersCords from "./cornerDetection.js";
import sanityCheck from "./sanityCheck.js";
import { homographicTransform } from "./homographicTransform.js";
import createGridLines from "./createGridLines.js";
import getTransformedSquares from "./getTransformedSquares.js";
import { extractSudokuBoxes } from "./extractBoxes.js";
export default async function processor(imageObject) {
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
        thresholded.saveImageLocally(imageObject.data, "cornerPointsImage.png", largestBlob, cornerPoints);
        if (sanityCheck(cornerPoints)) {
            const PROCESSING_SIZE = 900;
            const transform = homographicTransform(PROCESSING_SIZE, cornerPoints);
            const gridLines = createGridLines(transform, PROCESSING_SIZE);
            thresholded.drawGridLines(gridLines, imageObject.data, "gridLines.png");
            const extractedGrayscaleImage = getTransformedSquares(grayscaleImg, PROCESSING_SIZE, transform, "greyscaleExtracted.png");
            const extractedThresholdImage = getTransformedSquares(thresholded, PROCESSING_SIZE, transform, "thresholdExtracted.png");
            const boxes = extractSudokuBoxes(extractedGrayscaleImage, extractedThresholdImage);
            boxes.forEach((box, idx) => {
                box.numberImage.saveImageLocally(box.numberImage.toImageData().data, `./digits/digit${idx}.png`);
            });
            boxes.map((box) => {
                box["imageData"] = box.numberImage.toImageData();
                console.log(box);
            });
            return boxes;
        }
    }
    else {
        console.log("Largest Blob not found");
        return undefined;
    }
}
//# sourceMappingURL=imageProcessor.js.map