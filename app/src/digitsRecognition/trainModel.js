import * as tf from "@tensorflow/tfjs";
import { MnistData } from "tfjs-mnist-dataset";

const loadMNIST = async () => {
  const data = new MnistData();
  await data.load();
  return data;
};

const convertToTensor = (data) => {
  return data.map(({ xs, ys }) => {
    const normalizedXs = tf.tidy(() => xs.reshape([-1, 28, 28, 1]).div(255));
    const labels = tf.oneHot(ys, 10);
    return { xs: normalizedXs, labels };
  });
};

const run = async () => {
  const mnistData = await loadMNIST();
  const trainData = mnistData.getTrainData();
  const testData = mnistData.getTestData();

  const processedTrainData = convertToTensor(trainData);
  const processedTestData = convertToTensor(testData);

  const model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 1],
      filters: 32,
      kernelSize: 3,
      activation: "relu",
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 128, activation: "relu" }));
  model.add(tf.layers.dense({ units: 10, activation: "softmax" }));

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  const batchSize = 64;
  const epochs = 10;

  await model.fit(processedTrainData.xs, processedTrainData.labels, {
    batchSize,
    epochs,
    validationSplit: 0.15,
    callbacks: tfvis.show.fitCallbacks(
      { name: "Training Performance" },
      ["loss", "val_loss", "acc", "val_acc"],
      { height: 200, callbacks: ["onEpochEnd"] }
    ),
  });

  const evalResult = model.evaluate(
    processedTestData.xs,
    processedTestData.labels
  );
  console.log("Test loss:", evalResult[0].dataSync()[0]);
  console.log("Test accuracy:", evalResult[1].dataSync()[0]);

  const predict = async (imageTensor) => {
    const normalizedImage = tf.tidy(() =>
      imageTensor.div(255).reshape([-1, 28, 28, 1])
    );
    const prediction = model.predict(normalizedImage);
    const predictedClass = tf.argMax(prediction, 1).dataSync()[0];
    console.log("Predicted class:", predictedClass);
  };

  // Example usage:
  const imageTensor = tf.browser.fromPixels(imageElement);
  predict(imageTensor);
};

run();
