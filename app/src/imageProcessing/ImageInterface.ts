import { Image } from "canvas";
import { Point, Blob } from "./largestObjectLocalisation";
import { CornerPoints } from "./cornerDetection";
const path = require("path");

const canvas = require("canvas");
const fs = require("fs");

interface PointPair {
  p1: {
    x: number;
    y: number;
  };
  p2: {
    x: number;
    y: number;
  };
}

export default class ImageInterface {
  bytes: Uint8ClampedArray;
  width: number;
  height: number;
  constructor(bytes: Uint8ClampedArray, width: number, height: number) {
    this.bytes = bytes;
    this.width = width;
    this.height = height;
  }

  saveImageLocally(
    dataToSave: Uint8ClampedArray,
    outputFilename: string,
    cordinates: Blob | null = null,
    points: CornerPoints | null = null
  ): void {
    const canvasObj = canvas.createCanvas(this.width, this.height);
    const ctx = canvasObj.getContext("2d");
    const newImageData = ctx.createImageData(this.width, this.height);
    newImageData.data.set(dataToSave);
    ctx.putImageData(newImageData, 0, 0);
    // Draw bounding box
    if (cordinates) {
      ctx.lineWidth = 9;
      ctx.strokeStyle = "green";
      ctx.strokeRect(
        cordinates?.bounds.topLeft.x,
        cordinates?.bounds.topLeft.y,
        cordinates?.width,
        cordinates?.height
      );
    }

    // Add corner points
    if (points) {
      ctx.fillStyle = "red";
      ctx.fillRect(points.bottomLeft.x, points.bottomLeft.y, 15, 15);
      ctx.fillRect(points.bottomRight.x, points.bottomRight.y, 15, 15);
      ctx.fillRect(points.topRight.x, points.topRight.y, 15, 15);
      ctx.fillRect(points.topLeft.x, points.topLeft.y, 15, 15);
    }

    const out = fs.createWriteStream(path.join("./results", outputFilename));
    const stream = canvasObj.createPNGStream();
    stream.pipe(out);
  }

  toImageData(): ImageData {
    const imageData = new canvas.ImageData(this.width, this.height);
    for (let y = 0; y < this.height; y++) {
      const row = y * this.width;
      for (let x = 0; x < this.width; x++) {
        const value = this.bytes[row + x];
        imageData.data[(row + x) * 4] = value;
        imageData.data[(row + x) * 4 + 1] = value;
        imageData.data[(row + x) * 4 + 2] = value;
        imageData.data[(row + x) * 4 + 3] = 255;
      }
    }
    return imageData;
  }

  drawGridLines(
    linesData: PointPair[],
    imageData: Uint8ClampedArray,
    outputFilename: string
  ) {
    const canvasObj = canvas.createCanvas(this.width, this.height);
    const ctx = canvasObj.getContext("2d");
    const newImageData = ctx.createImageData(this.width, this.height);
    newImageData.data.set(imageData);
    ctx.putImageData(newImageData, 0, 0);

    linesData.forEach((lineData) => {
      ctx.beginPath();
      ctx.moveTo(lineData.p1.x, lineData.p1.y);
      ctx.lineTo(lineData.p2.x, lineData.p2.y);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 8;
      ctx.stroke();
    });

    const out = fs.createWriteStream(path.join("./results", outputFilename));
    const stream = canvasObj.createPNGStream();
    stream.pipe(out);
  }

  blankImage(width: number, height: number): ImageInterface {
    const bytes = new Uint8ClampedArray(width * height);
    return new ImageInterface(bytes, width, height);
  }

  get copy(): ImageInterface {
    return new ImageInterface(
      new Uint8ClampedArray(this.bytes),
      this.width,
      this.height
    );
  }
}
