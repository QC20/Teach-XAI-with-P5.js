let x_vals = [];
let y_vals = [];
let coef = [0, 0, 0]; // Coefficients for quadratic function: y = ax^2 + bx + c
const learningRate = 0.05;
let iterations = 0;
let cost = 0; // Variable to store the cost value

function setup() {
  createCanvas(800, 600);
}

function loss(pred, label) {
  return (pred - label) ** 2;
}

function predict(x) {
  // Quadratic function: y = ax^2 + bx + c
  return coef[0] * x * x + coef[1] * x + coef[2];
}

function mousePressed() {
  let x = map(mouseX, 0, width, -1, 1);
  let y = map(mouseY, 0, height, 1, -1);
  x_vals.push(x);
  y_vals.push(y);
}

function gradientDescent() {
  const n = x_vals.length;
  let totalError = 0; // Variable to accumulate total error for calculating cost
  for (let i = 0; i < n; i++) {
    const x = x_vals[i];
    const y = y_vals[i];
    const guess = predict(x);
    const error = guess - y;
    totalError += loss(guess, y); // Accumulate error for each data point
    // Gradient descent for quadratic function coefficients
    coef[0] -= (2 / n) * error * x * x * learningRate;
    coef[1] -= (2 / n) * error * x * learningRate;
    coef[2] -= (2 / n) * error * learningRate;
  }
  cost = totalError / n; // Calculate cost by dividing total error by the number of data points
}

function draw() {
  background(0);

  if (x_vals.length > 0 && iterations < 100000) {
    gradientDescent();
    drawCurve();
    drawPoints();
    iterations++;
  }
  
  fill(255);
  textSize(20);
  text(`a: ${coef[0].toFixed(2)}`, 20, 40);
  text(`b: ${coef[1].toFixed(2)}`, 20, 70);
  text(`c: ${coef[2].toFixed(2)}`, 20, 100);
  text(`Cost: ${cost.toFixed(2)}`, 20, 130); // Display the cost value
  text(`Iterations: ${iterations}`, 20, 160); // Display the number of iterations
}

function drawPoints() {
  for (let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], -1, 1, 0, width);
    let py = map(y_vals[i], 1, -1, 0, height);

    // Calculate the position of the point relative to the line
    let lineY = predict(x_vals[i]);
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
}


function drawCurve() {
  // Drawing the curve
  beginShape();
  noFill();
  stroke(255);
  strokeWeight(2);
  for (let x = -1; x <= 1; x += 0.01) {
    let px = map(x, -1, 1, 0, width);
    let py = map(predict(x), 1, -1, 0, height);
    vertex(px, py);
  }
  endShape();
}
