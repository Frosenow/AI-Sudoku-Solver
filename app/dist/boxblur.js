"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ImageInterface_1 = __importDefault(require("./ImageInterface"));
function precompute(bytes, width, height) {
    const result = new Array(bytes.length);
    let dst = 0;
    let src = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let tot = bytes[src];
            if (x > 0)
                tot += result[dst - 1];
            if (y > 0)
                tot += result[dst - width];
            if (x > 0 && y > 0)
                tot -= result[dst - width - 1];
            result[dst] = tot;
            dst++;
            src++;
        }
    }
    return result;
}
// this is a utility function used by DoBoxBlur below
function readP(precomputed, w, h, x, y) {
    if (x < 0)
        x = 0;
    else if (x >= w)
        x = w - 1;
    if (y < 0)
        y = 0;
    else if (y >= h)
        y = h - 1;
    return precomputed[x + y * w];
}
function boxBlur(src, boxw, boxh) {
    const { width, height, bytes } = src;
    const precomputed = precompute(bytes, width, height);
    const result = new Uint8ClampedArray(width * height);
    let dst = 0;
    const mul = 1.0 / ((boxw * 2 + 1) * (boxh * 2 + 1));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tot = readP(precomputed, width, height, x + boxw, y + boxh) +
                readP(precomputed, width, height, x - boxw, y - boxh) -
                readP(precomputed, width, height, x - boxw, y + boxh) -
                readP(precomputed, width, height, x + boxw, y - boxh);
            result[dst] = tot * mul;
            dst++;
        }
    }
    const output = new ImageInterface_1.default(result, width, height);
    return output;
}
exports.default = boxBlur;
//# sourceMappingURL=boxblur.js.map