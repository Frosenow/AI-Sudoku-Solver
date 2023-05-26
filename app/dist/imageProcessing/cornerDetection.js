// Find the point in the region that is closest to that corner in terms of Manhattan distance
function getClosestPoint(points, x, y) {
    let closest = points[0];
    let minDistance = Number.MAX_SAFE_INTEGER;
    // Loop through each point in Blob area
    points.forEach((point) => {
        // Calculate Manhattan distance between two given points
        const dx = Math.abs(point.x - x);
        const dy = Math.abs(point.y - y);
        const distance = dx + dy;
        if (distance < minDistance) {
            minDistance = distance;
            closest = point;
        }
    });
    // Return the point with the closest distance
    return closest;
}
// Find corner points of a blob
export default function getCornersCords(area) {
    const { x: minX, y: minY } = area.bounds.topLeft;
    const { x: maxX, y: maxY } = area.bounds.bottomRight;
    const { points } = area;
    // find the points closest to the upper-left, upper-right, lower-left, and lower-right
    return {
        topLeft: getClosestPoint(points, minX, minY),
        topRight: getClosestPoint(points, maxX, minY),
        bottomLeft: getClosestPoint(points, minX, maxY),
        bottomRight: getClosestPoint(points, maxX, maxY),
    };
}
//# sourceMappingURL=cornerDetection.js.map