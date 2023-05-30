const uploader = document.querySelector("#upload-btn");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const { createWorker, PSM } = Tesseract;
import SudokuBoard from "./sudokuBox.js";

// DOM Element to display extracted sudoku digits
const sudokuGrid = document.getElementById("sudoku-grid");
const photoContainer = document.querySelector(".card");

uploader.addEventListener("change", uploadImage);
const predictedDigits = [];

function uploadImage() {
  photoContainer.style.display = "block";
  const image = uploader.files[0];
  const imgObj = new Image();

  imgObj.src = URL.createObjectURL(image);
  imgObj.onload = async () => {
    // Get image size
    canvas.width = imgObj.naturalWidth;
    canvas.height = imgObj.naturalHeight;

    // Draw image on website using canvas
    ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");

    canvas.style.display = "block";
    // Send encoded image to server
    fetch("/uploads", {
      method: "POST",
      body: JSON.stringify({
        dataURL: dataURL,
        width: canvas.width,
        height: canvas.height,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const sudokuBoard = new SudokuBoard();

        for (const obj of data) {
          parseImageData(obj);
          let output = await recognizeDigit(obj.imageData.data);
          predictedDigits.push(output);
        }

        // Get the predictions
        await fillInPrediction(data);
        sudokuGrid.style.display = "grid";
        // Double check the predictions
        data.forEach((canvas, idx) => {
          if (canvas.contents !== predictedDigits[idx]) {
            canvas.contents = predictedDigits[idx];
          }

          // Setting the know values
          if (canvas.contents !== 0) {
            sudokuBoard.addDigit(canvas.y, canvas.x, canvas.contents);
          }
        });
        console.log(sudokuBoard.toString());
        console.log(sudokuBoard.board);
        sudokuBoard.renderSudokuGrid();
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const IMAGE_SIZE = 20;

const MODEL_URL = "./tfjs_model/model.json";

async function loadModel() {
  const model = await tf.loadLayersModel(MODEL_URL);
  return model;
}
loadModel().then(() => console.log("Model Loaded", console.error));

// Work out what the class should be from the results of the neural network prediction
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
  const logits = tf.tidy(() => {
    // Convert the images into tensors and process them in the same way we did during training
    // if you change the code in the training then update the code here
    const images = boxes.map((box) => {
      const img = tf.browser
        .fromPixels(box.imageData.data, 1)
        .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
        .toFloat();
      const mean = img.mean();
      const std = tf.moments(img).variance.sqrt();
      const normalized = img.sub(mean).div(std);
      const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 1]);
      return batched;
    });
    // Concatentate all the images for processing all at once
    const input = tf.concat(images);
    // Make the predictions
    return model.predict(input, {
      batchSize: boxes.length,
    });
  });
  // Convert logits to probabilities and class names.
  const classes = await getClasses(logits);
  // Fill in the boxes with the results
  classes.forEach((className, index) => (boxes[index].contents = className));
  console.log("DONE");
  console.log(predictedDigits);
}

function convertArrayToCanvas(array, width, height) {
  // Create ImageData object
  const imageData = new ImageData(array, width, height);

  // Create HTMLCanvasElement
  const canvas = document.createElement("canvas");

  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Get 2D rendering context
  const context = canvas.getContext("2d");

  // Draw ImageData on canvas
  context.putImageData(imageData, 0, 0);

  // Return HTMLCanvasElement
  return canvas;
}

const worker = await createWorker();

async function recognizeDigit(image) {
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  await worker.setParameters({
    tessedit_char_whitelist: "123456789",
    tessedit_pageseg_mode: PSM.SINGLE_CHAR,
  });
  const {
    data: { text },
  } = await worker.recognize(image);
  return parseInt(text.trim());
}

function parseImageData(obj) {
  const bytes = Object.values(obj.numberImage.bytes);
  const bytesImageData = Object.values(obj.imageData.data);

  const imageDataArray = Uint8ClampedArray.from(bytesImageData);
  const bytesArray = Uint8ClampedArray.from(bytes);

  obj.numberImage.bytes = bytesArray;
  obj.imageData.data = convertArrayToCanvas(
    imageDataArray,
    obj.numberImage.width,
    obj.numberImage.height
  );
}
