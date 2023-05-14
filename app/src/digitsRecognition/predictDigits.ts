import * as tf from "@tensorflow/tfjs-node";
import { SudokuBox } from "../imageProcessing/extractBoxes";
const { createCanvas } = require("canvas");
const fs = require("fs");
const Jimp = require("jimp");

const MODEL_URL = tf.io.fileSystem("./tfjs_model/model.json");
const folderPath = "./results/digits";

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
  readGrayscaleImages(folderPath).then((boxesArr: any) => {
    boxesArr.forEach((box: ImageData) => {
      const canvas = createCanvas(box.width, box.height);
      const ctx = canvas.getContext("2d");
      const imageDataObj = ctx.createImageData(box.width, box.height);
      imageDataObj.data.set(box.data);

      const img = tf.browser
        .fromPixels(imageDataObj, 1)
        .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
        .toFloat();
    });
  });
}

async function readGrayscaleImages(folderPath: string) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, async (err: any, files: string[]) => {
      if (err) {
        reject(`Error reading folder ${folderPath}: ${err}`);
        return;
      }

      const imageDataArray = [];

      for (const file of files) {
        const filePath = `${folderPath}/${file}`;

        try {
          const image = await Jimp.read(filePath);
          const imageData = {
            data: image.bitmap.data,
            width: image.bitmap.width,
            height: image.bitmap.height,
          };
          imageDataArray.push(imageData);
        } catch (err) {
          reject(`Error reading image ${filePath}: ${err}`);
        }
      }

      resolve(imageDataArray);
    });
  });
}
