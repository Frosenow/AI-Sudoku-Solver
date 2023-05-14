import * as tf from "@tensorflow/tfjs";
import * as tfn from "@tensorflow/tfjs-node";
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
  const model: tf.LayersModel = await loadModel();

  const logits = tf.tidy(() => {
    // convert the images into tensors and process them in the same way we did during training
    // if you change the code in the training then update the code here
    const images = boxes.map((box) => {
      const tensor = tf
        .tensor(box.numberImage.bytes, [
          box.numberImage.height,
          box.numberImage.width,
          1,
        ])
        .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
        .toFloat();
      const mean = tensor.mean();
      const std = tf.moments(tensor).variance.sqrt();
      const normalized = tensor.sub(mean).div(std);
      const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 1]);
      return batched;
    });

    // concatentate all the images for processing all at once
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
  console.log("finished");
}
