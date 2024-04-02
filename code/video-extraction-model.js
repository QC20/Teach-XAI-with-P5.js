
/*
Jonas Kjeldmand Jensen. April 2024.
This code sets up a machine learning regression model using the MobileNet feature extractor to predict
the position of an object in a live video feed. Users can add samples of the object's position, train 
the model, and then use the trained model to predict the position of the object in real-time. The code 
also includes a graphical user interface (UI) with buttons for adding samples, training the model, and 
making predictions, as well as a slider to control the size of a rectangle drawn over the video feed.
*/



let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;
let rectSize = 50;

let lerpedResult = 0.5;

function setup() {
  createCanvas(640,480);
  // Create a video element
  video = createCapture(VIDEO);
  video.size(640,480);
  video.hide();
  // Extract the features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  // Create a new regressor using those features and give the video we want to use
  regressor = featureExtractor.regression(video, videoReady);
  // Create the UI buttons
  setupButtons();
  rectMode(CENTER);
}

function draw() {
  image(video, 0, 0, width, height);
  noStroke();
  fill(255, 0, 0,100);
  
  rectSize = slider.value()*400;
  rectSize = constrain(rectSize, 0, 400);
  
  rect(width/2, height/2, rectSize, rectSize);
  
  textSize(slider.value()*100);
  //text("Hello", 50, 100);
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Model loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  select('#videoStatus').html('Video ready!');
}

// Classify the current frame.
function predict() {
  regressor.predict(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  slider = select('#slider');
  select('#addSample').mousePressed(function() {
    regressor.addImage(slider.value());
    select('#amountOfSamples').html(samples++);
  });

  // Train Button
  select('#train').mousePressed(function() {
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  select('#buttonPredict').mousePressed(predict);
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  
  lerpedResult = lerp(lerpedResult, result, 0.50);
  slider.value(lerpedResult);
  
  predict();
}

