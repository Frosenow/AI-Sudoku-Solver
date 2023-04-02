export default class Image {
  bytes: Uint8ClampedArray;
  width: number;
  height: number;
  constructor(bytes: Uint8ClampedArray, width: number, height: number) {
    this.bytes = bytes;
    this.width = width;
    this.height = height;
  }

  convertToData(): ImageData {
    const imageData = new ImageData(this.width, this.height);
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
}
