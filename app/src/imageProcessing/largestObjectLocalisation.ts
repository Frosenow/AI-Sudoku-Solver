import ImageInterface from "./ImageInterface.js";

// Helper class to find and localise the biggest blob
class Blob {
  points: Point[];
  bounds: { topLeft: Point; bottomRight: Point };
  constructor(points: Point[], topLeft: Point, bottomRight: Point) {
    this.points = points;
    this.bounds = { topLeft, bottomRight };
  }

  get width() {
    return this.bounds.bottomRight.x - this.bounds.topLeft.x;
  }
  get height() {
    return this.bounds.bottomRight.y - this.bounds.topLeft.y;
  }
  get aspectRatio(): number {
    return this.width / this.height;
  }
}

// Interface for storing cordiantes
export interface Point {
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
    for (
      let neighborY = Math.max(0, currentPixel!.y - 1);
      neighborY < height && neighborY <= currentPixel!.y + 1;
      neighborY++
    ) {
      for (
        let neighborX = Math.max(0, currentPixel!.x - 1);
        neighborX < width && neighborX <= currentPixel!.x + 1;
        neighborX++
      ) {
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

// Defines filtering criteria
type BlobOptions = {
  minAspectRatio: number;
  maxAspectRatio: number;
  minSize: number;
  maxSize: number;
};

// Find the largest blob in givern binary image
function getLargestBlob(
  binaryImage: ImageInterface,
  options: BlobOptions
): Blob | null {
  let largestRegion: Blob | null = null;

  // Create copy of input image because we working on image reference
  const imgTmp = binaryImage.copy;
  const { width, height, bytes } = imgTmp;

  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      // Check if current pixel is foreground
      if (bytes[row + x] == 255) {
        // Get the region that is connected to the pixel
        const connectedRegion = findBlob(imgTmp, x, y);
        // Compute the width and height of the connected region
        const regionWidth =
          connectedRegion.bounds.bottomRight.x -
          connectedRegion.bounds.topLeft.x;
        const regionHeight =
          connectedRegion.bounds.bottomRight.y -
          connectedRegion.bounds.topLeft.y;

        // Check if the connected region satisfies the given filtering criteria (BloblOptions)
        const satisfiesFilters =
          connectedRegion.aspectRatio >= options.minAspectRatio &&
          connectedRegion.aspectRatio <= options.maxAspectRatio &&
          regionHeight >= options.minSize &&
          regionWidth >= options.minSize &&
          regionHeight <= options.maxSize &&
          regionWidth <= options.maxSize;
        {
          // Update the largest region if the current region satisfies the filtering criteria and has more pixels than the current largest region.
          if (
            satisfiesFilters &&
            (!largestRegion ||
              connectedRegion.points.length > largestRegion.points.length)
          ) {
            largestRegion = connectedRegion;
          }
        }
      }
    }
  }
  // Draw bounds on the biggest blob
  const test = binaryImage.toImageData();
  binaryImage.saveImageLocally(
    test.data,
    "blobDetectionImage.png",
    largestRegion
  );
  return largestRegion;
}

export { getLargestBlob, findBlob, Blob };
