/*
   Jonas Kjeldmand Jensen
   April 2024

   // Save/Load Model
   // This code creates a real-time image classification application allowing users to train the 
   // model with "happy" or "sad" images, and then save the trained model for later use.
*/

let mobilenet;
let classifier;
let video;
let label = 'loading model';
let happyButton;
let sadButton;
let trainButton;

// Function to handle model readiness
function modelReady() {
  console.log('Model is ready!!!');
  // Uncomment the following line to load a custom model after MobileNet
  // classifier.load('model.json', customModelReady);
}

// Function to handle video readiness
function videoReady() {
  console.log('Video is ready!!!');
}

function setup() {
  createCanvas(320, 270);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  
  // Initialize MobileNet feature extractor and classifier
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  classifier = mobilenet.classification(video, videoReady);

  // Create buttons for adding happy and sad labels, training, and saving the model
  happyButton = createButton('happy');
  happyButton.mousePressed(function() {
    classifier.addImage('happy');
  });

  sadButton = createButton('sad');
  sadButton.mousePressed(function() {
    classifier.addImage('sad');
  });

  trainButton = createButton('train');
  trainButton.mousePressed(function() {
    classifier.train(whileTraining);
  });

  saveButton = createButton('save');
  saveButton.mousePressed(function() {
    classifier.save();
  });
}

function draw() {
  background(0);
  // Display video feed
  image(video, 0, 0, 320, 240);
  fill(255);
  textSize(16);
  // Display the current label below the video feed
  text(label, 10, height - 10);
}

// Function to handle training progress
function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
    // Once training is complete, start classification
    classifier.classify(gotResults);
  } else {
    // Log the training loss during training
    console.log(loss);
  }
}

// Function to handle classification results
function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    // Display the predicted label
    label = result[0].label;
    // Continue classification for real-time prediction
    classifier.classify(gotResults);
  }
}
