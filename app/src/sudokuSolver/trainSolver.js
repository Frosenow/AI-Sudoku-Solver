import tf, { input } from "@tensorflow/tfjs-node";
import Papa from "papaparse";
import fs from "fs";

const datasetPath = "./sudoku2.csv";
const csvData = fs.readFileSync(datasetPath, "utf8");

const dataset = Papa.parse(csvData, { header: true }).data;

const quizzes = [];
const solutions = [];

for (const entry of dataset) {
  const quizArray = entry.quizzes.split("").map(Number);
  const solutionArray = entry.solutions.split("").map(Number);
  quizzes.push(quizArray);
  solutions.push(solutionArray);
}

const inputTensor = tf.tensor(quizzes);
const outputTensor = tf.tensor(solutions);

// Normalize the input and output tensors
const normalizedInputTensor = tf.div(inputTensor, 9);
const normalizedOutputTensor = tf.div(outputTensor, 9);

const model = tf.sequential();

model.add(
  tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: "relu",
    padding: "same",
    inputShape: [9, 9, 1],
  })
);
model.add(tf.layers.batchNormalization());
model.add(
  tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: "relu",
    padding: "same",
  })
);
model.add(tf.layers.batchNormalization());
model.add(
  tf.layers.conv2d({
    filters: 128,
    kernelSize: 1,
    activation: "relu",
    padding: "same",
  })
);

model.add(tf.layers.flatten());
model.add(
  tf.layers.dense({
    units: 81 * 9,
  })
);
model.add(
  tf.layers.reshape({
    targetShape: [-1, 9],
  })
);
model.add(tf.layers.softmax());

model.compile({
  loss: "sparseCategoricalCrossentropy",
  optimizer: "adam",
});

const epochs = 2;
const batchSize = 64;

await model.fit(normalizedInputTensor, normalizedOutputTensor, {
  epochs,
  batchSize,
});
