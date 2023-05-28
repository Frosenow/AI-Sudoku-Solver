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
export async function getClasses(logits) {
    const logitsArray = (await logits.array());
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
/**
 * Apply our neural network to the extracted images
 * @param boxes A set of puzzle boxes containing images
 */
export default async function fillInPrediction(boxes) {
    const model = await loadModel();
    const logits = tf.tidy(() => {
        // convert the images into tensors and process them in the same way we did during training
        // if you change the code in the training then update the code here
        const images = boxes.map((box) => {
            const img = tf.browser
                .fromPixels(box.numberImage.toImageData(), 1)
                .resizeBilinear([IMAGE_SIZE, IMAGE_SIZE])
                .toFloat();
            const mean = img.mean();
            const std = tf.moments(img).variance.sqrt();
            const normalized = img.sub(mean).div(std);
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
    const classes = await getClasses(logits);
    // fill in the boxes with the results
    classes.forEach((className, index) => (boxes[index].contents = className));
}
//# sourceMappingURL=predictDigits.js.map