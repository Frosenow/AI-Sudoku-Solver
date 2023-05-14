import * as tfn from "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs";
import { SudokuBox } from "../imageProcessing/extractBoxes";
const MODEL_URL = tfn.io.fileSystem("./tfjs_model/model.json");

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const IMAGE_SIZE = 20;
let _model: tf.LayersModel | undefined = undefined;
let modelLoadingPromise: Promise<tf.LayersModel> | undefined = undefined;

async function loadModel(): Promise<tf.LayersModel> {
  const model = await tf.loadLayersModel(MODEL_URL);
  return model;
}
loadModel().then(() => console.log("Model Loaded", console.error));

export async function getClasses(logits: tf.Tensor<tf.Rank>) {
  const logitsArray = (await logits.array()) as number[][];
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

export default async function fillInPrediction(boxes: SudokuBox[]) {
  const model = await loadModel();
  const logits = tf.tidy(() => {
    // convert the images into tensors
    const images = boxes.map((box) => {
      const imageObj = box.numberImage.toImageData();
      const pixelData = new Uint8Array(imageObj.data);
      const width = imageObj.width;
      const height = imageObj.height;

      const img = tf.browser
        .fromPixels({ data: pixelData, width, height }, 1)
        .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
        .toFloat();
      const mean = img.mean();
      const std = tf.moments(img).variance.sqrt();
      const normalized = img.sub(mean).div(std);
      const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 1]);
      return batched;
    });
    const input = tf.concat(images);
    // Make the predictions
    return model.predict(input, {
      batchSize: boxes.length,
    });
  });
  // Convert logits to probabilities and class names.
  const classes = await getClasses(logits as tf.Tensor<tf.Rank>);
  // fill in the boxes with the results
  classes.forEach((className, index) => (boxes[index].contents = className));
}
