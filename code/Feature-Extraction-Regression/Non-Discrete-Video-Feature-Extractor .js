/* 
  Jonas Kjeldmand Jensen
  April 2024
  
  Non-Discrete Video Feature Extractor 
*/

// Variables to store ml5 models, video feed, and UI elements
let mobilenet; // MobileNet model for feature extraction
let predictor; // Regression model
let video; // Video feed
let value = 0; // Predicted value
let slider; // Slider to adjust label value
let addButton; // Button to add example image for training
let trainButton; // Button to initiate training

// Callback function to handle model readiness
function modelReady() {
  console.log('Model is ready!!!');
}

// Callback function to handle video feed readiness
function videoReady() {
  console.log('Video is ready!!!');
}

// Callback function during training to monitor loss
function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
    predictor.predict(gotResults);
  } else {
    console.log(loss);
  }
}

// Callback function to handle prediction results
function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    value = result.value; // Update predicted value
    predictor.predict(gotResults); // Continuously predict
  }
}

// Setup function to initialize canvas, video feed, and ml5 models
function setup() {
  createCanvas(320, 270); // Create canvas
  video = createCapture(VIDEO); // Capture video from webcam
  video.hide(); // Hide video feed
  background(0); // Set background color

  // Initialize MobileNet model for feature extraction
  mobilenet = ml5.featureExtractor('MobileNet', modelReady);
  // Create a regression model with MobileNet features and video feed
  predictor = mobilenet.regression(video, videoReady);

  // Create slider to adjust label value
  slider = createSlider(0, 1, 0.5, 0.01);

  // Create button to add example image for training
  addButton = createButton('add example image');
  addButton.mousePressed(function() {
    predictor.addImage(slider.value());
  });

  // Create button to start training
  trainButton = createButton('train');
  trainButton.mousePressed(function() {
    predictor.train(whileTraining);
  });
}

// Draw function to render video feed and predicted value
function draw() {
  background(0); // Refresh background
  image(video, 0, 0, 320, 240); // Display video feed
  rectMode(CENTER); // Set rect mode to center
  fill(255, 0, 200); // Fill color for rectangle
  // Draw a rectangle to represent predicted value position
  rect(value * width, height / 2, 50, 50);

  fill(255); // Text color
  textSize(16); // Text size
  text(value, 10, height - 10); // Display predicted value
}
