// Jonas Kjeldmand Jensen, April 2024
// Teaching non-linear Gradient Descent intuitively through 
// the P5.js framework

let x_vals = [];
let y_vals = [];
let m = 0;
let b = 0;

const learningRate = 0.05;

function setup() {
  createCanvas(800, 600);
}

function loss(pred, label) {
  return (pred - label) ** 2;
}

function predict(x) {
  // y = mx + b
  return m * x + b;
}

function mousePressed() {
  let x = map(mouseX, 0, width, 0, 1);
  let y = map(mouseY, 0, height, 1, 0);
  x_vals.push(x);
  y_vals.push(y);
}

function gradientDescent() {
  const n = x_vals.length;
  for (let i = 0; i < n; i++) {
    const x = x_vals[i];
    const y = y_vals[i];
    const guess = predict(x);
    const error = guess - y;
    m -= (2 / n) * error * x * learningRate;
    b -= (2 / n) * error * learningRate;
  }
}

function draw() {
  background(0);

  if (x_vals.length > 0) {
    gradientDescent();
    drawLine();
    drawPoints();
  }
}
function drawPoints() {
  // Disable anti-aliasing
  noSmooth();

  for (let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], 0, 1, 0, width);
    let py = map(y_vals[i], 0, 1, height, 0);

    // Calculate the position of the point relative to the line
    let lineY = m * x_vals[i] + b;
    let side = y_vals[i] > lineY ? -1 : 1; // If point is above line, side = -1, else side = 1

    // Set color based on which side of the line the point is on
    if (side === -1) {
      fill(255, 0, 0); // Red if above the line
    } else {
      fill(0, 0, 255); // Blue if below the line
    }

    noStroke(); // Remove stroke
    ellipse(px, py, 8, 8);
  }

  // Re-enable anti-aliasing for other drawings
  smooth();
}

function drawLine() {
  const x_min = 0;
  const x_max = 1;
  const y_min = predict(x_min);
  const y_max = predict(x_max);

  let x1 = map(x_min, 0, 1, 0, width);
  let x2 = map(x_max, 0, 1, 0, width);
  let y1 = map(y_min, 0, 1, height, 0);
  let y2 = map(y_max, 0, 1, height, 0);

  strokeWeight(2);
  stroke(255);
  line(x1, y1, x2, y2);
}
