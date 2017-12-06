//GLOBAL VARIABLES
let socket;

function setup() {
  createCanvas(400, 400);
  background(0);
  noStroke();

  socket = io.connect("http://localhost:3000");
  socket.on('mouse', newDrawing);
}


function draw() {

}

function newDrawing(data) {
  fill(0, 0, 255);
  ellipse(data.x, data.y, 20);
}

function mouseDragged() {
  fill(255, 0, 0);
  ellipse(mouseX, mouseY, 20);
  console.log("Sending: " + mouseX + ", " + mouseY);
  let data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data);
}
