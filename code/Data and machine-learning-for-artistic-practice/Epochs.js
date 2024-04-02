/*
  Data and machine learning for artistic practice
  Week 6
  
  Pose classification (train model 2/3)
  Inspired by Daniel Shiffman
  
*/

let brain;

function setup() {
  createCanvas(640, 480);
  
  // define neural network options
  let options = {
    inputs: 34,
    outputs: 1,
    task: 'regression',
    debug: true
  }

  brain = ml5.neuralNetwork(options);
  
  // load the data we trained in part 1
  brain.loadData('grey.json', dataReady);
}

function dataReady() {
  // normalise our data using the pre-built function
  brain.normalizeData();
  brain.train({epochs: 50}, finished); 
}

function finished() {
  console.log('model trained');
  brain.save();
}