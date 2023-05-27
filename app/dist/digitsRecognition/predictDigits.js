import * as tfn from "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs";
const MODEL_URL = tfn.io.fileSystem("./tfjs_model/model.json");
const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const IMAGE_SIZE = 28;
async function loadModel() {
    const model = await tf.loadLayersModel(MODEL_URL);
    return model;
}
loadModel().then(() => console.log("Model Loaded", console.error));
export default async function fillInPrediction(boxes) {
    // Load the pretrained model
    const model = await tf.loadLayersModel(MODEL_URL);
    const images = boxes.map((box) => {
        const img = tf.browser.fromPixels(box.numberImage.toImageData(), 1);
        return img;
    });
    console.log(images);
}
//# sourceMappingURL=predictDigits.js.map