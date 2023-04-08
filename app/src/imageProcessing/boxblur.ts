import ImageInterface from "./ImageInterface";

function boxBlur(image: ImageInterface, radius: number): ImageInterface {
  const pixels = image.bytes;
  const width = image.width;
  const height = image.height;
  const output = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      for (let j = -radius; j <= radius; j++) {
        for (let i = -radius; i <= radius; i++) {
          const x0 = x + i;
          const y0 = y + j;

          if (x0 >= 0 && x0 < width && y0 >= 0 && y0 < height) {
            const index = (y0 * width + x0) * 4;

            r += pixels[index];
            g += pixels[index + 1];
            b += pixels[index + 2];
            a += pixels[index + 3];
            count++;
          }
        }
      }

      const outputIndex = (y * width + x) * 4;
      output[outputIndex] = Math.floor(r / count);
      output[outputIndex + 1] = Math.floor(g / count);
      output[outputIndex + 2] = Math.floor(b / count);
      output[outputIndex + 3] = Math.floor(a / count);
    }
  }

  const result = new ImageInterface(output, width, height);
  result.saveImageLocally(result.bytes, "blurred.png");
  return result;
}

module.exports = { boxBlur };
