export function linearRegression(x, y) {
  const n = x.length;
  const xSum = x.reduce((a, b) => a + b, 0);
  const ySum = y.reduce((a, b) => a + b, 0);
  const xySum = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const xSqSum = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * xySum - xSum * ySum) / (n * xSqSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;

  return { slope, intercept };
}

export function getTrendDirection(slope) {
  if (slope > 0.05) return "increasing";
  if (slope < -0.05) return "decreasing";
  return "stable";
}
