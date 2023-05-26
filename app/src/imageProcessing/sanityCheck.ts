import { Point } from "./largestObjectLocalisation.js";

export default function sanityCheck({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}: {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
}): Boolean {
  // Helper function to calculate four sides of quadrilateral
  const calculateLength = (Point1: Point, Point2: Point) => {
    const dx = Point1.x - Point2.x;
    const dy = Point1.y - Point2.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  };

  const topLength = calculateLength(topLeft, topRight);
  const bottomLength = calculateLength(bottomLeft, bottomRight);
  const leftLength = calculateLength(topLeft, bottomLeft);
  const rightLength = calculateLength(topRight, bottomRight);

  // Helper function to chceck ratio
  const isWithinRange = (value: number, range: number[]) =>
    value >= range[0] && value <= range[1];

  // Check if the ratio of four sides of quadrilaterl are in acceptable range
  return (
    isWithinRange(topLength / bottomLength, [0.5, 1.5]) &&
    isWithinRange(leftLength / rightLength, [0.7, 1.3]) &&
    isWithinRange(leftLength / bottomLength, [0.5, 1.5])
  );
}
