//GLOBAL VARIABLES
let canvas;
let nameInput, msgInput;
let sendButton;
let socket;
let urUsername;
let msgCount = 0;
let time;

//JSON object
let convo = {};


function setup() {
  time = millis();
  canvas = createCanvas(350, 600);
  canvas.id('canvas');
  background(0);;
  noStroke();
  // input
  nameInput = createInput('');
  nameInput.size(120, 18);
  nameInput.position(370, 500);
  nameInput.changed(updateName);
  msgInput = createInput('');
  msgInput.size(200, 70);
  msgInput.position(25, 640);
  msgInput.changed(newText);
  //button
  sendButton = createButton('send');
  sendButton.position(300, 650);
  // socket io script
  socket = io.connect("http://localhost:3000");
  // socket.on('mouse', newDrawing);
}


function updateName() {
  urUsername = nameInput.value();
  nameInput.hide();
}

function newText() {
  let message = msgInput.value();
  let newMsgData = {
    time: millis(),
    msg: message,
    length: message.length,
    user: urUsername
  }
  convo[msgCount] = newMsgData;
  console.log(convo);
  msgCount++;
  return false;
}

//Should I just make everything dom elements? lol whatver

function draw() {
  rect(0, 0, width, height);
  stroke(0);
  noFill();
  strokeWeight(2);

}

// function newDrawing(data) {
//   fill(0, 0, 255);
//   ellipse(data.x, data.y, 20);
// }
//
// function updateText() {
//   fill(255, 0, 0);
//   ellipse(mouseX, mouseY, 20);
//   console.log("Sending: " + mouseX + ", " + mouseY);
//   let data = {
//     x: mouseX,
//     y: mouseY
//   }
//   socket.emit('mouse', data);
// }
