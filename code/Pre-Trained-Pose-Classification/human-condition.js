let video;
let poseNet;
let poses = [];
let lastpose=[]
let mstart=0

function preload(){
  music=loadSound("Fitter Happier.mp3")
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  
    // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  
  
  song =
    "Fitter happier More productive Comfortable Not drinking too much Regular exercise at the gym (3 days a week) Getting on better with your associate employee contemporaries At ease Eating well (no more microwave dinners and saturated fats) A patient, better driver A safer car (baby smiling in back seat) Sleeping well (no bad dreams) No paranoia Careful to all animals (never washing spiders down the plughole) Keep in contact with old friends (enjoy a drink now and then) Will frequently check credit at (moral) bank (hole in the wall) Favours for favours Fond but not in love Charity standing orders On Sundays ring road supermarket (No killing moths or putting boiling water on the ants) Car wash (also on Sundays) No longer afraid of the dark or midday shadows Nothing so ridiculously teenage and desperate Nothing so childish At a better pace Slower and more calculated No chance of escape Now self-employed Concerned (but powerless) An empowered and informed member of society (pragmatism not idealism) Will not cry in public Less chance of illness Tyres that grip in the wet (shot of baby strapped in back seat) A good memory Still cries at a good film Still kisses with saliva No longer empty and frantic Like a cat Tied to a stick That's driven into Frozen winter shit (the ability to laugh at weakness) Calm Fitter, healthier and more productive A pig In a cage On antibiotics                                                                                                                                                                                              ";

  x=[0, 30, 60, 105, 135, 60, 60, 67.5, 67.5, 67.5, 67.5, 67.5,  67.5, 82.5, 82.5, 75, 75, 75, 75]
  y=[24, 24, 24, 24, 24, 33, 42, 51, 57, 63, 69, 75, 120, 75, 120, 0, 6, 12, 18]
  w=[30, 30, 45, 30, 30, 45, 45, 30, 30, 30, 30, 45, 45, 45, 45, 15, 15, 15, 15]
  h=[6, 9, 9, 9, 6, 9, 9, 6, 6, 6, 6, 15, 12, 15, 12, 6, 6, 6, 6]
  m=[0.3,0.3,0.22,0.3,0.3,0.25, 0.25, 0.333, 0.333, 0.333, 0.333, 0.333, 0.266, 0.333, 0.266, 0.4, 0.4, 0.4, 0.4]
  strings=['','','','','','','','','','','','','','','','','','','']
  r=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, PI/2, PI/2, PI/2, PI/2, 0, 0, 0, 0]
  song = split(song, "");
  
  //  rect(75, 0, 15, 6)//h1
  //   rect(75, 6, 15, 6)//h2
  //   rect(75, 12, 15, 6)//h3
  //   rect(75, 18, 15, 6)//h4

  //   rect(0, 24, 30, 6)//la1
  //   rect(30, 24, 30, 9)//la2

  //   rect(105, 24, 30, 9)//ra1
  //   rect(135, 24, 30, 6)//ra2

  //   rect(60, 24, 45, 9)//b1
  //   rect(60, 33, 45, 9)//b2
  //   rect(60, 42, 45, 9)//b3
  //   rect(67.5, 51, 30, 6)//b4
  //   rect(67.5, 57, 30, 6)//b5
  //   rect(67.5, 63, 30, 6)//b6
  //   rect(67.5, 69, 30, 6)//b7

  //   rect(67.5, 75, 15, 45 )//l1
  //   rect(82.5, 75, 15, 45)//l2
  //   rect(67.5, 120, 12, 45)//l3
  //   rect(85.5, 120, 12, 45)//l4
  }
  
function modelReady() {
  select('#status').html('Model Loaded');
  mstart=millis()
  music.play()
}
  

function draw() {
  // image(video, 0, 0, width, height);
  
  drawKeypoints();
  
  current = song.slice(0, max(1, (millis()-mstart)/85));

  jstart = 1;
  for (let i = 0; i < 19; i++) {
    stri = current[jstart - 1];
    strfinal = stri;
    for (let j = jstart; j < current.length - 1; j++) {
      stri = concat(stri, current[j]);
      textSize(h[i]);
      
      if (textWidth(stri) > w[i]) {
        strings[i] = strfinal;
        jstart = j + 1;
        break;
      }
      strfinal = stri;
    }
    
    if (jstart + strfinal.length == current.length) {

      strings[i] = strfinal; //for the final bit only
      
      break;
    }
    if (jstart < current.length - 20 && i == 18) {
      i = -1; //to restart from the hands
    }
  }
  background(0);
  noStroke();
  fill(255);
  
  for (let i = 0; i < 19; i++) {
  push();
    translate(x[i], y[i]);
    rotate(r[i]);
    textSize(h[i]);
    text(strings[i], 0, 0);
    pop();
  }

}


// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  if (poses.length > 0) {  
   pose = poses[0].pose;

    form (0, 10, 8)
    form (1, 8, 6)
    form (2, 6, 5)
    form (3, 5, 7)
    form (4, 7, 9)
    form (5, 6, 5)
    form (6, 6, 5)
    form (7, 12, 11)
    form (8, 12, 11)
    form (9, 12, 11)
    form (10, 12, 11)
    form (11, 11, 13)
    form (12, 13, 15)
    form (13, 14, 12)
    form (14, 16, 14)
    form (15, 4, 3)
    form (16, 4, 3)
    form (17, 4,3)
    form (18, 4, 3)
  }
    

}


function form (i, p1, p2){
  p1 = pose.keypoints[p1];
  p2 = pose.keypoints[p2];
  
  x[i]=p1.position.x
  y[i]=p1.position.y
  x2=p2.position.x
  y2=p2.position.y
  
  if (x[i]>x2){
    r[i]=PI+atan((y2-y[i])/(x2-x[i]))
  }
  else{
    r[i]=atan((y2-y[i])/(x2-x[i]))
  }
  
  w[i]=dist(x[i],y[i],x2,y2)
  
  h[i]=m[i]*w[i]  
      
    if(i==5){
      y[i]=y[i]+h[i]
    }
    else if (i==6){
      y[i]=y[i]+2* h[i]
    }
    else if (i==7){
      y[i]=y[i]-4.5*h[i]
    }
    else if (i==8){
      y[i]=y[i]-3*h[i]
    }
    else if (i==9){
      y[i]=y[i]-1.5*h[i]
    }
    else if (i==15){
      y[i]=y[i]-2*h[i]
    }
    else if (i==16){
      y[i]=y[i]-h[i]
    }
    else if (i==18){
      y[i]=y[i]+h[i]
    }
  
}
  


