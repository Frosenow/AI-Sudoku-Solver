import ImageInterface from "./ImageInterface";
import boxBlur from "./boxblur";
import convertToGrayscale from "./greyscale";
import adaptiveThreshold from "./adaptiveThreshold";

export async function processor(imageObject: ImageData): Promise<void> {
  const grayscaleImg = await convertToGrayscale(imageObject);
  const boxblur = boxBlur(grayscaleImg, 20, 20);
  const thresholded = adaptiveThreshold(grayscaleImg, 20, 20);
}
