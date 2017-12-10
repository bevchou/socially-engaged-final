//GLOBAL VARIABLES
let canvas;
//dom elements
let nameInput, msgInput;
let sendButton;
let userReq;
//element selection
let chatbody;
//msg attributes
let urUsername;
let msgCount = 0;
//boolean checks
let nameSumbitted = false;
//sockets
let socket;
//JSON object
let convo = {};


function setup() {
  noCanvas();
  //username input
  nameInput = createInput('');
  nameInput.id('nameInput');
  nameInput.size(120, 18);
  // nameInput.position(370, 500);
  nameInput.changed(updateName);
  //text conversation dom
  chatbody = select('chatbody');
  //request username
  userReq = createP('Submit your name to continue.');
  userReq.id('namealert');
  // socket io script
  // socket = io.connect("http://localhost:8000");
  // socket.on('msg', newText);
}

function updateName() {
  urUsername = nameInput.value();
  nameSumbitted = true;
  nameInput.remove();
  userReq.remove();
  //create msg input
  msgInput = createElement('textarea', '')
  msgInput.id('msgInput');
  msgInput.changed(newText);
  //create msg send button
  sendButton = createButton('send');
  sendButton.mouseClicked(newText);
  sendButton.id('sendButton');
}

function newText() {
  if (trim(msgInput.value()) != "") {
    let message = msgInput.value();
    //create object of msg data
    let newMsgData = {
      time: millis(),
      msg: message,
      length: message.length,
      user: urUsername
    }
    //add to convo json file
    convo[msgCount] = newMsgData;
    //post to chat
    let posttext = convo[msgCount].user + ": " + convo[msgCount].msg;
    let p = createP(posttext);
    chatbody.child(p);
    console.log(convo);
    msgCount++;
    cleartext();
  }
  return false;
}

function keyPressed() {
  if (keyCode == ENTER && nameSumbitted == true) {
    newText();
    return false;
  }
}

function cleartext() {
  msgInput.remove();
  msgInput = createElement('textarea', '')
  msgInput.id('msgInput');
  msgInput.changed(newText);
}

function timeCheck() {
  // if (Object.keys(convo).length )
}

function draw() {
  // console.log(Object.keys(convo).length);

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
