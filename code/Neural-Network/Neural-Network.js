/*
   Jonas Kjeldmand Jensen
   April 2024

   Visualization of Neural Network and how wights affect it

*/
let model;
let trainingData = [];
let targetLabel = 'C';
let state = 'collection';

let env, wave;

let freqs = {
  'C': 261.6256,
  'D': 293.6648,
  'E': 329.6276
}

function setup() {
  createCanvas(400, 400);

  let options = {
    inputs: ['x', 'y'],
    outputs: ['C', 'D', 'E'],
    task: "classification",
    debug: true
  }
  model = ml5.neuralNetwork(options);

  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);

  wave = new p5.Oscillator();

  wave.setType('sine');
  wave.start();
  wave.freq(440);
  wave.amp(env);

}

function mousePressed() {
  let inputs = {
    x: mouseX,
    y: mouseY
  }
  let target = targetLabel;
  if (state == 'collection') {
    wave.freq(freqs[target]);
    env.play();
    model.addData(inputs, [target]);
    trainingData.push({
      inputs,
      target
    });
  } else if (state == 'prediction') {
    // make a guess 
    model.classify(inputs, gotResult);
  }
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  console.log(results);
  
  let note = results[0].label;
  wave.freq(freqs[note]);
  env.play();
  
}




function keyPressed() {
  if (key == 't') {
    let options = {
      epochs: 2000,
    }
    state = 'training';
    model.normalizeData();
    model.train(options, whileTraining, finishedTraining);
  } else {
    targetLabel = key.toUpperCase();
    console.log(targetLabel);
  }
}

function whileTraining(epoch, loss) {
  console.log(epoch);
}

function finishedTraining() {
  console.log('done');
  state = 'prediction';
}


function draw() {
  background(255);
  for (let i = 0; i < trainingData.length; i++) {
    let data = trainingData[i];
    stroke(0);
    noFill();
    ellipse(data.inputs.x, data.inputs.y, 16, 16);
    textAlign(CENTER, CENTER);
    fill(0);
    text(data.target, data.inputs.x, data.inputs.y);
  }



}