"use strict";
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
async function convertToGrayscale(rawImageData) {
    const image = await loadImage(rawImageData);
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const width = canvas.width;
    const height = canvas.height;
    const imageData = context.getImageData(0, 0, width, height);
    const bytes = new Uint8ClampedArray(width * height);
    for (let y = 0; y < height; y++) {
        const row = y * width;
        for (let x = 0; x < width; x++) {
            // Green Channel 
            const g = imageData.data[(row + x) * 4 + 1];
            bytes[row + x] = g;
        }
    }
    console.log(bytes);
}
module.exports = { convertToGrayscale };
//# sourceMappingURL=greyscale.js.map