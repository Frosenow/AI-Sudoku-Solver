"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Image {
    constructor(bytes, width, height) {
        this.bytes = bytes;
        this.width = width;
        this.height = height;
    }
    convertToData() {
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
exports.default = Image;
//# sourceMappingURL=Image.js.map