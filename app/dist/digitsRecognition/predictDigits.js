import * as tfn from "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs";
import { createCanvas, loadImage } from "canvas";
const MODEL_URL = tfn.io.fileSystem("./tfjs_model/model.json");
const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const IMAGE_SIZE = 20;
let _model = undefined;
let modelLoadingPromise = undefined;
async function loadModel() {
  const model = await tf.loadLayersModel(MODEL_URL);
  return model;
}
loadModel().then(() => console.log("Model Loaded", console.error));
export async function getClasses(logits) {
  const logitsArray = await logits.array();
  const classes = logitsArray.map((values) => {
    let maxProb = 0;
    let maxIndex = 0;
    values.forEach((value, index) => {
      if (value > maxProb) {
        maxProb = value;
        maxIndex = index;
      }
    });
    return CLASSES[maxIndex];
  });
  return classes;
}
export default async function fillInPrediction(boxes) {
  const model = await loadModel();
  const imageDataArr = [];
  boxes.forEach(async (box) => {
    const canvas = createCanvas(
      box.numberImage.toImageData().width,
      box.numberImage.toImageData().height
    );
    const ctx = canvas.getContext("2d");
    ctx.putImageData(box.numberImage.toImageData(), 0, 0);
    imageDataArr.push(canvas);
  });
  const logits = tf.tidy(() => {
    // convert the images into tensors
    const images = imageDataArr.map((box) => {
      const img = tf.browser
        .fromPixels(box, 1)
        .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
        .toFloat();
      const mean = img.mean();
      const std = tf.moments(img).variance.sqrt();
      const normalized = img.sub(mean).div(std);
      const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 1]);
      return batched;
    });
    const input = tf.concat(images);
    return model.predict(input, { batchSize: boxes.length });
  });
  // Convert logits to probabilities and class names.
  const classes = await getClasses(logits);
  // fill in the boxes with the results
  classes.forEach((className, index) => (boxes[index].contents = className));
}
//# sourceMappingURL=predictDigits.js.map
