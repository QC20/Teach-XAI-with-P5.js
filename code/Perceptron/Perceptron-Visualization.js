/*
   Jonas Kjeldmand Jensen
   April 2024

   
*/

// Press space to add training data
// Press t to start or stop training
// Press p for a prediction

// Inspired by Nature of Code, ch. 10

let perceptron;               // our perceptron instance
let inputs = [ -1, -1, -1 ];  // inputs can be -1 (white) or 1 (black)
let output = -1;              // outputs can be -1 (white) or 1 (black)
let training_set = [];        // this is where the training data gets stored into
let training_iterations = 0;  // how many iterations we've been training
let is_training = false;      // when true, we call train() once per frame

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  perceptron = new Perceptron(3, 0.2);  // create a perceptron with 3 inputs, and learning rate 0.2
}

function draw() {
  background(220);

  // handle training
  if (is_training && 0 < training_set.length) {
    // pick a random data set from the training
    let random_training_data = training_set[floor(random(training_set.length))];
    // and submit it to the perceptron's training method
    inputs = random_training_data.inputs.slice();
    output = perceptron.train(inputs, random_training_data.desired_output);
    training_iterations++;
    // display whether the prediction was right or not
    if (output == random_training_data.desired_output) {
      stroke('green');
      line(295, 245, 300, 250);
      line(300, 250, 305, 235);
    } else {
      stroke('red');
      line(295, 245, 305, 255);
      line(295, 255, 305, 245);      
    }
  }
  
  // draw the perceptron
  stroke(127);
  line(100, 100, 190, 200);
  line(100, 200, 190, 200);
  line(100, 300, 190, 200);
  line(190, 200, 240, 200);
  line(240, 200, 300, 200);
  line(240, 200, 240, 100);
  line(240, 100, 180, 100);
  line(180, 100, 160, 120);
  line(160, 120, 160, 110);
  line(160, 120, 170, 120);
  for (let i=0; i < 3; i++) {
    if (inputs[i] == 1) {
      fill(0);
    } else {
      fill(255);
    }
    ellipse(100, 100+100*i, 40, 40);
  }
  fill(0, 0, 255);
  rect(140, 143, 4, 20 * (1+perceptron.weights[0])/2);
  rect(140, 200, 4, 20 * (1+perceptron.weights[1])/2);
  rect(140, 257, 4, 20 * (1+perceptron.weights[1])/2);
  fill(0);
  rect(190, 200, 30, 30);
  rect(240, 200, 30, 30);
  stroke(255);
  line(185, 200, 195, 200);
  line(190, 195, 190, 205);
  line(235, 205, 240, 205);
  line(240, 205, 240, 195);
  line(240, 195, 245, 195);
  stroke(127);
  if (output == 1) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(300, 200, 40, 40);
  
  // show stats
  fill(0);
  text("training set=" + training_set.length + ", training iterations = " + training_iterations, 10, height-20);
}

function mouseClicked() {
  // change input and output states on mouse click
  if (dist(mouseX, mouseY, 100, 100) < 20) {
    inputs[0] *= -1;
  }
  if (dist(mouseX, mouseY, 100, 200) < 20) {
    inputs[1] *= -1;
  }
  if (dist(mouseX, mouseY, 100, 300) < 20) {
    inputs[2] *= -1;
  }
  if (dist(mouseX, mouseY, 300, 200) < 20) {
    output *= -1;
  }
}

function keyPressed() {
  if (key == ' ') {
    training_set.push({ inputs: inputs.slice(), desired_output: output });  // note: this uses .slice() to make a copy of the array
  }
  if (key == 't') {
    is_training = !is_training;
    if (is_training) {
      frameRate(10);
    } else {
      frameRate(60);
    }
  }
  if (key == 'p') {
    output = perceptron.predict(inputs);
  }
}

class Perceptron {
  constructor(num_inputs, learning_rate) {
    // every input gets a weight associated to it, which
    // starts with a random value (-1..1)
    this.weights = [];
    for (let i=0; i < num_inputs; i++) {
      this.weights.push(random(-1, 1));
    }

    this.learning_rate = learning_rate;
  }

  train(inputs, desired_output) {
    let prediction = this.predict(inputs);
    
    // how far off was the prediction from the desired output
    let error = desired_output - prediction;
    // error can be 0, -2 or 2

    // adjust the weights based on:
    // - learning rate (0..1)
    // - error
    // - inputs

    for (let i=0; i < this.weights.length; i++) {
      this.weights[i] += this.learning_rate * error * inputs[i];
    }
    return prediction;
  }

  predict(inputs) {
    // sum all the values
    let sum = 0;
    for (let i=0; i < this.weights.length; i++) {
      sum += this.weights[i] * inputs[i];
    }

    // if the sum is positive, return 1, else -1
    if (sum < 0) {
      return -1;
    } else {
      return 1;
    }
  }
}
