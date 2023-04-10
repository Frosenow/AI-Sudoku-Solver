import ImageInterface from "./ImageInterface";

// Helper class to find and localise the biggest blob
export class Blob {
  points: Point[];
  bounds: { topLeft: Point; bottomRight: Point };
  constructor(points: Point[], topLeft: Point, bottomRight: Point) {
    this.points = points;
    this.bounds = { topLeft, bottomRight };
  }
}

// Interface for storing cordiantes
interface Point {
  x: number;
  y: number;
}

// Helper function for finding connected objects in image
function findBlob(image: ImageInterface, x: number, y: number) {
  const { bytes, width, height } = image;
  // Variable to track the bounding box of the connected component
  let minX = x;
  let maxX = x;
  let minY = y;
  let maxY = y;

  // Array to hold the pixels amount in the connected component
  const pixels: Point[] = [];

  // Stack to hold the frontier of pixels to explore
  const stack: Point[] = [];

  // Push the starting pixel onto the stack and add it to the pixels array.
  pixels.push({ x, y });
  stack.push({ x, y });

  // Setting starting pixel ax explored by setting it to black (0)
  bytes[y * width + x] = 0;

  // While there are still pixels to explore
  while (stack.length > 0) {
    // Pop the pixel from the stack
    const currentPixel = stack.pop();

    // Updating the bounding box
    minX = Math.min(currentPixel!.x, minX);
    maxX = Math.max(currentPixel!.x, maxX);
    minY = Math.min(currentPixel!.y, minY);
    maxY = Math.max(currentPixel!.y, maxY);

    // Chceck for neighboring pixels of current pixel
    for (let neighborY = Math.max(0, currentPixel!.y - 1); neighborY < height && neighborY <= currentPixel!.y + 1; neighborY++) {
      for (let neighborX = Math.max(0, currentPixel!.x - 1); neighborX < width && neighborX <= currentPixel!.x + 1; neighborX++) {
        // if neighboring pixel is unexplored and white (255)
        if (bytes[neighborY * width + neighborX] == 255) {
          // Add it to the stack and pixel array
          pixels.push({ x: neighborX, y: neighborY });
          stack.push({ x: neighborX, y: neighborY });

          // Mark the pixel as explored
          bytes[neighborY * width + neighborX] = 0;
        }
      }
    }
  }

  return new Blob(pixels, { x: minX, y: minY }, { x: maxX, y: maxY });
}
