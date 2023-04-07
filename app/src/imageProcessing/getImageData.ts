const canvas = require("canvas");

interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export async function getImageData(base64Image: string): Promise<ImageData> {
  //   Create new image object
  const image = await canvas.loadImage(base64Image);
  const canvasObj = canvas.createCanvas(image.width, image.height);

  const ctx = canvasObj.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  return {
    data: imageData.data,
    width: image.width,
    height: image.height,
  };
}
