//Canvas container
var p5div = document
  .querySelector('#p5sketch');

//Canvas size
var w, h;

//P5.js sketch
var p5sketch = ( p5 ) => {
  
  p5.setup = () => {
    w = p5div.clientWidth;
    h = p5div.clientHeight;
    p5.createCanvas(w,h);
  };
  
  p5.windowResized = () => {
    w = p5div.clientWidth;
    h = p5div.clientHeight;
    
    p5.resizeCanvas(w,h);
  }

  let t = 0;
  let t1= 0;
  let sel1 = 0, sel2 = 0;
  p5.draw = () => {
    p5.clear();
    p5.noFill();
    for(let i = 1; i < 80; i++) {
      p5.strokeWeight(p5.noise(t));
      p5.bezier(
        0,
        [h/2, i*8, 0, p5.random(8)][sel1%4],
        p5.noise(t)*w,
        p5.noise(t*2)*h,
        p5.noise(t*3)*w,
        p5.noise(t + i*8)*h,
        w,
        [h/2, i*8, h, p5.random(8)][sel2%4]
      )
    }
    
    t += 0.02;
    t1 += 0.08;
    
    if(p5.frameCount % 200 == 0) 
      sel1++;
    
    if(p5.frameCount % 300 == 0) 
      sel2++;
  }
}

//P5.js sketch instance
var p5inst = new p5(p5sketch, p5div);