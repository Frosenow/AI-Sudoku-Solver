"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPoint = exports.homographicTransform = void 0;
const math = __importStar(require("mathjs"));
function homographicTransform(size, corners) {
    // Create an 8x8 matrix with all elements set to 0
    const A = math.zeros(8, 8);
    // Set specific values in the matrix based on size and corners
    const { topRight, bottomLeft, bottomRight } = corners;
    A.set([0, 2], 1);
    A.set([1, 5], 1);
    A.set([2, 0], size);
    A.set([2, 2], 1);
    A.set([2, 6], -size * topRight.x);
    A.set([3, 3], size);
    A.set([3, 5], 1);
    A.set([3, 6], -size * topRight.y);
    A.set([4, 1], size);
    A.set([4, 2], 1);
    A.set([4, 7], -size * bottomLeft.x);
    A.set([5, 4], size);
    A.set([5, 5], 1);
    A.set([5, 7], -size * bottomLeft.y);
    A.set([6, 0], size);
    A.set([6, 1], size);
    A.set([6, 2], 1);
    A.set([6, 6], -size * bottomRight.x);
    A.set([6, 7], -size * bottomRight.x);
    A.set([7, 3], size);
    A.set([7, 4], size);
    A.set([7, 5], 1);
    A.set([7, 6], -size * bottomRight.y);
    A.set([7, 7], -size * bottomRight.y);
    // Create a matrix B that represents the coordinates of the corners
    // of the target image. The values of the coordinates are stored in
    // the corners object.
    const B = math.matrix([
        corners.topLeft.x,
        corners.topLeft.y,
        corners.topRight.x,
        corners.topRight.y,
        corners.bottomLeft.x,
        corners.bottomLeft.y,
        corners.bottomRight.x,
        corners.bottomRight.y,
    ]);
    // Transpose matrix A to facilitate matrix multiplication.
    const A_t = math.transpose(A);
    // Calculate the solution to the system of linear equations Ax = B,
    // where A is the matrix defined earlier and B is the corners matrix.
    // To do this, we first multiply the transpose of A by A, then calculate
    // the inverse of this product. Finally, we multiply the inverse by the
    // transpose of A, and then by the B matrix.
    const lambda = math.multiply(math.multiply(math.inv(math.multiply(A_t, A)), A_t), B);
    // Extract the individual values of lambda (the unknowns a, b, c, d, e, f, g, and h)
    // from the lambda matrix and store them in separate variables.
    const a = lambda.get([0]);
    const b = lambda.get([1]);
    const c = lambda.get([2]);
    const d = lambda.get([3]);
    const e = lambda.get([4]);
    const f = lambda.get([5]);
    const g = lambda.get([6]);
    const h = lambda.get([7]);
    // Return an object containing the individual values of the unknowns.
    return { a, b, c, d, e, f, g, h };
}
exports.homographicTransform = homographicTransform;
// Define the transformPoint function which takes a point and a transform object
function transformPoint(point, transform) {
    const { a, b, c, d, e, f, g, h } = transform;
    const { x, y } = point;
    // Calculate intermediate values used in the transformation and
    // Calculate the transformed x and y values using the intermediate values
    const sx = (a * x + b * y + c) / (g * x + h * y + 1);
    const sy = (d * x + e * y + f) / (g * x + h * y + 1);
    // Return the transformed point as an object with x and y properties
    return { x: sx, y: sy };
}
exports.transformPoint = transformPoint;
//# sourceMappingURL=HomographicTransform.js.map