import * as tf from "@tensorflow/tfjs-node";
import { promisify } from "util";
import { readFile } from "fs";

const readImageFile = promisify(readFile);
const readLabelFile = promisify(readFile);

async function loadMNISTImages() {
  const data = await readImageFile("./train-images.idx3-ubyte");
  const magicNumber = data.readInt32BE(0);
  const numImages = data.readInt32BE(4);
  const numRows = data.readInt32BE(8);
  const numCols = data.readInt32BE(12);

  const imagesData = data.slice(16);
  const images = new Float32Array(numImages * numRows * numCols);

  for (let i = 0; i < numImages; i++) {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const pixelIndex = i * numRows * numCols + r * numCols + c;
        const value = imagesData[pixelIndex];
        images[pixelIndex] = value / 255;
      }
    }
  }

  return images;
}

async function loadMNISTLabels() {
  const data = await readLabelFile("./train-labels.idx1-ubyte");
  const magicNumber = data.readInt32BE(0);
  const numLabels = data.readInt32BE(4);

  const labelsData = data.slice(8);
  const labels = new Uint8Array(numLabels);

  for (let i = 0; i < numLabels; i++) {
    labels[i] = labelsData[i];
  }

  return labels;
}

async function createModel() {
  const trainingData = await loadMNISTImages();
  const trainingLabelsData = await loadMNISTLabels();

  const numSamples = trainingData.length / (28 * 28);

  const trainingDataTensor = tf.tensor4d(trainingData, [numSamples, 28, 28, 1]);

  const trainingLabelsTensor = tf.oneHot(trainingLabelsData, 10);

  const model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: "relu",
      kernelInitializer: "VarianceScaling",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    })
  );

  model.add(
    tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: "relu",
      kernelInitializer: "VarianceScaling",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    })
  );

  model.add(tf.layers.flatten());

  model.add(
    tf.layers.dense({
      units: 10,
      kernelInitializer: "VarianceScaling",
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: tf.train.sgd(0.15),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  const epochs = 10;
  const batchSize = 32;

  for (let epoch = 1; epoch <= epochs; epoch++) {
    console.log(`Epoch ${epoch}/${epochs}`);
    const history = await model.fit(trainingDataTensor, trainingLabelsTensor, {
      batchSize,
      epochs: 1,
    });
    console.log("Loss:", history.history.loss[0]);
    console.log("Accuracy:", history.history.acc[0]);
  }

  console.log("Training completed");

  // Evaluation
  const testingData = await loadMNISTImages();
  const testingLabelsData = await loadMNISTLabels();

  const testingDataTensor = tf.tensor4d(testingData, [
    testingData.length / (28 * 28),
    28,
    28,
    1,
  ]);

  const testingLabelsTensor = tf.oneHot(testingLabelsData, 10);

  const evalResult = model.evaluate(testingDataTensor, testingLabelsTensor);
  console.log("Evaluation Loss:", evalResult[0]);
  console.log("Evaluation Accuracy:", evalResult[1]);

  await model.save("file://pretrained_model");

  console.log("Model saved successfully");
}

createModel();
