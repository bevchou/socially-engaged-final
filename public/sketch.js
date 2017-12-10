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
//array of last 3 objects
let convo = {};
//data for loading past conversation
let newinfo;


function setup() {
  noCanvas();
  //username input
  nameInput = createInput('');
  nameInput.id('nameInput');
  nameInput.size(120, 18);
  nameInput.changed(updateName);
  //text conversation dom
  chatbody = select('chatbody');
  //load initial JSONObject
  loadJSON('convo.json', getOldConvo);
  //request username
  userReq = createP('Submit your name to continue.');
  userReq.id('namealert');
  // socket io script
  socket = io.connect("http://localhost:8000");
  //get broadcasted text & post to browser
  socket.on('chatmsg', function(data) {
    let posttext = data.user + ": " + data.msg;
    let p = createP(posttext);
    chatbody.child(p);
  });
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

let newMsgData;

function newText() {
  if (trim(msgInput.value()) != "") {
    loadJSON('convo.json', updateJSON);
    let message = msgInput.value();
    //create object of msg data
    newMsgData = {
      time: new Date().getTime() / 1000,
      msg: message,
      length: message.length,
      user: urUsername
    }
    timeCheck(newMsgData);
    if (timeLonger) {
      //emit to other viewers
      socket.emit('chatmsg', newMsgData);
      //add to convo json object
      convo[msgCount] = newMsgData;
      //post to chat
      let posttext = convo[msgCount].user + " (" + convertDate(convo[msgCount].time) + "): " + convo[msgCount].msg;
      let p = createP(posttext);
      chatbody.child(p);
      console.log(convo);
      msgCount++;
      cleartext();
    }
  }
  return false;
}

function updateJSON(data) {
  newinfo = data;
  console.log('json file loaded');
}

function getOldConvo(data) {
  //pass data to newinfo
  newinfo = data;
  //show all old messages
  for (let i = 1; i < Object.keys(newinfo).length; i++) {
    let posttext = newinfo[i].user + " (" + convertDate(newinfo[i].time) + "): " + newinfo[i].msg;
    let p = createP(posttext);
    chatbody.child(p);
  }
}

//enter key will trigger send
function keyPressed() {
  if (keyCode == ENTER && nameSumbitted == true) {
    newText();
    return false;
  }
}

//clear text/make new text area after sending text
function cleartext() {
  msgInput.remove();
  msgInput = createElement('textarea', '')
  msgInput.id('msgInput');
  msgInput.changed(newText);
}

let messagecount;
let lastInterval;
let newInterval;
let timeLonger = false;
//if wait time is longer than previous
function timeCheck(newMessage) {
  messagecount = Object.keys(newinfo).length;

  if (messagecount < 3) {
    timeLonger = true;
  } else {
    lastInterval = newinfo[messagecount - 1].time - newinfo[messagecount - 2].time;
    newInterval = newMessage.time - newinfo[messagecount - 1].time;
    if (newInterval > lastInterval) {
      timeLonger = true;
    } else if (newInterval < lastInterval) {
      let timeleft = lastInterval - newInterval;
      let timewarning = createP('wait ' + convertTime(timeleft) + ' before sending a message.');
      chatbody.child(timewarning);
      timeLonger = false;
    }
  }
}

function convertDate(epochdate) {
  let myDate = new Date(epochdate * 1000);
  return myDate.toLocaleString();
}

function convertTime(seconds) {
  let words;
  if (seconds < 60) {
    words = roundplace(seconds) + " seconds";
  } else if (seconds >= 60 && seconds < 60 * 60) {
    let minutes = seconds / 60;
    words = roundplace(minutes) + " minutes";
  } else if (seconds >= 60 * 60 && seconds < 60 * 60 * 24) {
    let hours = seconds / 1200;
    words = roundplace(hours) + " hours";
  } else {
    let days = seconds / (1200 * 24);
    words = roundplace(days) + " days";
  }
  return words;
}

//rounds to second decimal place
function roundplace(number){
  return round(100*number)/100;
}
