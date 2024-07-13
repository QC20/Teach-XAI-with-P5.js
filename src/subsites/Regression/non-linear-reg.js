let x_vals = [];
let y_vals = [];
let coef = [0, 0, 0];
const learningRate = 0.05;
let cost = 0;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    
    select('#reset-btn').mousePressed(resetSketch);
}

function draw() {
    background(240);
    drawAxis();
    if (x_vals.length > 0) {
        gradientDescent();
        drawCurve();
    }
    drawPoints();
    displayInfo();
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        let x = map(mouseX, 0, width, -1, 1);
        let y = map(mouseY, 0, height, 1, -1);
        x_vals.push(x);
        y_vals.push(y);
    }
}

function gradientDescent() {
    const n = x_vals.length;
    let totalError = 0;
    for (let i = 0; i < n; i++) {
        const x = x_vals[i];
        const y = y_vals[i];
        const guess = predict(x);
        const error = guess - y;
        totalError += (error ** 2);
        coef[0] -= (2 / n) * error * x * x * learningRate;
        coef[1] -= (2 / n) * error * x * learningRate;
        coef[2] -= (2 / n) * error * learningRate;
    }
    cost = totalError / n;
}

function predict(x) {
    return coef[0] * x * x + coef[1] * x + coef[2];
}

function drawAxis() {
    stroke(200);
    line(0, height/2, width, height/2);
    line(width/2, 0, width/2, height);
}

function drawPoints() {
    for (let i = 0; i < x_vals.length; i++) {
        let px = map(x_vals[i], -1, 1, 0, width);
        let py = map(y_vals[i], 1, -1, 0, height);
        let lineY = predict(x_vals[i]);
        let side = y_vals[i] > lineY ? -1 : 1;

        if (side === -1) {
            fill(128, 0, 32); // Deep burgundy red
        } else {
            fill(0, 102, 204); // Complementary blue
        }

        noStroke();
        ellipse(px, py, 8, 8);
    }
}

function drawCurve() {
    beginShape();
    noFill();
    stroke(68, 68, 68); // Deep grey
    strokeWeight(2);
    for (let x = -1; x <= 1; x += 0.01) {
        let px = map(x, -1, 1, 0, width);
        let py = map(predict(x), 1, -1, 0, height);
        vertex(px, py);
    }
    endShape();
}

function displayInfo() {
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text(`a: ${coef[0].toFixed(4)}`, 10, 20);
    text(`b: ${coef[1].toFixed(4)}`, 10, 40);
    text(`c: ${coef[2].toFixed(4)}`, 10, 60);
    text(`Cost: ${cost.toFixed(4)}`, 10, 80);
}

function resetSketch() {
    x_vals = [];
    y_vals = [];
    coef = [0, 0, 0];
    cost = 0;
}