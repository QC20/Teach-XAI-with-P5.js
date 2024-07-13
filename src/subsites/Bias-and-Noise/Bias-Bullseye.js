// Declare global variables
let b, n, N, bSlider, nSlider, bx, by, newbx, newby, aButton;

// Arrays to store current and new noise offsets
let setnx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let setny = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let newSetnx = [];
let newSetny = [];

// Boolean flag to toggle annotation display
let annotate = true;

// Setup function, called once when the program starts
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize variables
  N = 20;
  
  // Create and position Bias slider
  bSlider = createSlider(0, 5, 2.5, 0.5);
  bSlider.input(biasCycle);
  bSlider.position(width/2 - 220, height - 50);
  
  // Create and position Noise slider
  nSlider = createSlider(0, 5, 3, 0.5);
  nSlider.input(noiseSetNew);
  nSlider.position(width/2 + 20, height - 50);
  
  // Create and position Toggle Annotation button
  aButton = createButton("Toggle Annotation");
  aButton.position(width/2 - 60, height - 30);
  aButton.mousePressed(toggleAnnotation);
  
  biasCycle();
  noiseSetNew();
  
  b = bSlider.value();
  n = bSlider.value();
  
  bx = width/2;
  by = height/2;
}

// Function called when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Update positions of sliders and button
  bSlider.position(width/2 - 220, height - 50);
  nSlider.position(width/2 + 20, height - 50);
  aButton.position(width/2 - 60, height - 30);
}

// Toggle annotation display on button click
function toggleAnnotation() {
  annotate = !annotate;
}

// Draw function, continuously called to update the canvas
function draw() {
  // Interpolate bias and noise values for smooth transitions
  n = lerp(n, nSlider.value(), 0.2);
  b = lerp(b, bSlider.value(), 0.2);

  noiseDraw();
  
  // Clear canvas
  background(255);
  
  // Draw target
  target(width/2, height/2);
  
  // Draw bias annotation if enabled
  if (annotate) {
    annotateBias(bx, by, width/2, height/2);
  }
  
  // Draw bullseye
  fill(200, 50, 50);
  strokeWeight(3);
  noStroke();
  ellipse(width/2, height/2, 12);
  
  // Interpolate new bias point
  bx = lerp(bx, newbx, 0.2);
  by = lerp(by, newby, 0.2);
  
  // Draw shots
  shots(N, bx, by, n);
  
  // Annotate sliders
  annotateSliders();  
}

// Generate new noise offsets
function noiseSetNew() {
  for (let i = 0; i < N; i++) {
    newSetnx[i] = randomGaussian(0, nSlider.value()) * nSlider.value() * 2;
    newSetny[i] = randomGaussian(0, nSlider.value()) * nSlider.value() * 2;
  }
}

// Interpolate noise offsets for smooth transitions
function noiseDraw() {
  for (let i = 0; i < N; i++) {
    setnx[i] = lerp(setnx[i], newSetnx[i], 0.2);
    setny[i] = lerp(setny[i], newSetny[i], 0.2);
  }
}

// Annotate bias and noise sliders
function annotateSliders() {
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Bias", width/2 - 220, height - 70);
  text("Noise", width/2 + 20, height - 70);
}

// Draw the target circles
function target(x, y) {
  ellipseMode(CENTER);
  strokeWeight(3);
  stroke(0, 255); 
  fill(200, 50, 50); 
  ellipse(x, y, 288);
  noStroke();
  fill(255); 
  ellipse(x, y, 242);
  fill(200, 50, 50); 
  ellipse(x, y, 196);
  fill(255); 
  ellipse(x, y, 150);
  fill(200, 50, 50); 
  ellipse(x, y, 104);
  fill(255);
  ellipse(x, y, 58);
}

// Draw shots with or without dashed lines based on noise level
function shots(N, x, y, n) {
  if (n < 0.5) {
    fill(255, 200, 50, 255);
    strokeWeight(1);
    stroke(0);
    ellipse(x + setnx[0], y + setny[0], 8);
  } else {
    fill(255, 200, 50, 255);
    stroke(0, 0, 255, 200);
    strokeWeight(1);
    if (annotate) {
      for (let i = 0; i < N; i++) {
        linedash(x + setnx[i], y + setny[i], bx, by, 4);
      }  
    }
    stroke(0);
    for (let i = 0; i < N; i++) {
      ellipse(x + setnx[i], y + setny[i], 8);
    }
  }
}

// Annotate bias with an arrow and a line
function annotateBias(x1, y1, x2, y2) {
  let biasMagnitude = dist(x1, y1, x2, y2);
  let biasAngle = atan2(y2 - y1, x2 - x1);
  let biasX = x1 + cos(biasAngle) * biasMagnitude * 0.5;
  let biasY = y1 + sin(biasAngle) * biasMagnitude * 0.5;
  
  noFill();
  strokeWeight(3);
  stroke(0, 0, 255, 150);
  line(x1, y1, biasX, biasY);
  ellipse(x1, y1, b * 64);
  ellipse(biasX, biasY, 10);
}

// Update new bias point for smooth cycling animation
function biasCycle() {
  let angle = frameCount / 100;
  newbx = width/2 + cos(angle) * bSlider.value() * 32;
  newby = height/2 + sin(angle) * bSlider.value() * 32;
}

// Draw dashed lines
function linedash(x1, y1, x2, y2, delta, style = '-') {
  let distance = dist(x1, y1, x2, y2);
  let dashNumber = distance / delta;
  let xDelta = (x2 - x1) / dashNumber;
  let yDelta = (y2 - y1) / dashNumber;

  for (let i = 0; i < dashNumber; i += 2) {
    let xi1 = i * xDelta + x1;
    let yi1 = i * yDelta + y1;
    let xi2 = (i + 1) * xDelta + x1;
    let yi2 = (i + 1) * yDelta + y1;

    if (style == '-') { 
      line(xi1, yi1, xi2, yi2); 
    } else if (style == '.') { 
      point(xi1, yi1); 
    } else if (style == 'o') { 
      ellipse(xi1, yi1, delta / 2); 
    }
  }
}