/*
  Jonas Kjeldmand Jensen
  April 2024

  Pre-trained pose classification code piece
  This code piece shows dots at joints and facial features and draws dots between them
  Inspired by Daniel Shiffman
*/

// Global variables declaration
let video,          // Webcam video capture
    poseNet,        // PoseNet model for pose detection
    pose,           // Detected pose data
    skeleton,       // Skeleton structure data
    brain,          // Neural network model
    state = "waiting", // State variable for data collection
    targetGrey,     // Array to store pose data
    greySlider;     // Slider for setting grayscale range

function setup() {
  // Create canvas
  createCanvas(640, 480);
  background(255); // Set background to white

  // Create slider for grayscale range
  greySlider = createSlider(0, 255, 0); // 0 to 255. 0 at start

  // Load webcam feed
  video = createCapture(VIDEO, cameraLoaded);
  video.size(640, 480); // Set size to match canvas
  video.hide(); // Hide the video element
}

// Callback function when webcam feed is loaded
function cameraLoaded(stream) {
  // Load PoseNet model
  poseNet = ml5.poseNet(video, modelLoaded);
  
  // Event listener for 'pose' detection
  poseNet.on("pose", gotPoses); 

  // Initialize neural network model
  let options = {
    inputs: 34,    // Number of inputs
    outputs: 1,    // Number of outputs
    task: "regression", // Regression task
    debug: true    // Enable debug mode
  };
  brain = ml5.neuralNetwork(options);
}

// Callback function when a pose is detected
function gotPoses(poses) {
  if (poses.length > 0) {
    // Get pose and skeleton data
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    
    // Check if in collecting state
    if (state == "collecting") {
      let inputs = [];
      
      // Extract keypoint positions and add to inputs array
      for (let keypoint of pose.keypoints) {
        let x = keypoint.position.x;
        let y = keypoint.position.y;
        inputs.push(x);
        inputs.push(y);
      }
      
      // Add data to neural network model for training
      brain.addData(inputs, targetGrey);
    }
  }
}

function draw() {
  // Clear canvas
  background(255);

  // Draw black lines and dots only
  stroke(0);
  strokeWeight(2);

  // If a pose is detected, draw skeleton and keypoints
  if (pose) {
    for (let bone of skeleton) {
      let a = bone[0];
      let b = bone[1];
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    
    for (let keypoint of pose.keypoints) {
      fill(0);
      stroke(255);
      let x = keypoint.position.x;
      let y = keypoint.position.y;
      ellipse(x, y, 16, 16);
    }
  }
}

function keyPressed() {
  // Save collected data when 's' key is pressed
  if (key == "s") {
    brain.saveData();
  } 
  // Start data collection when 'd' key is pressed
  else if (key == "d") {
    targetGrey = [greySlider.value()];
    console.log(targetGrey);
    
    // Set timeout for collecting data
    setTimeout(function () {
      console.log("collecting");
      state = "collecting";
      setTimeout(function () {
        console.log("not collecting");
        state = "waiting";
      }, 10000); // 10 seconds
    }, 5000); // 5 seconds
  }
}

// Callback function when PoseNet model is loaded
function modelLoaded() {
  console.log("poseNet ready");
}
