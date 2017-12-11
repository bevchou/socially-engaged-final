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
let timeLonger = false;
let lastInterval, newInterval;
let msgLonger = false;
let lastLength, newLength;
//sockets
let socket;
//data for loading past conversation
let newinfo;
let messagecount;
//info for incoming messages
let newMsgData;

function setup() {
  noCanvas();
  //username input
  nameInput = createInput('');
  nameInput.id('nameInput');
  nameInput.size(120, 18);
  nameInput.changed(updateName);
  //text conversation dom
  chatbody = select('chatbody');
  //request username
  userReq = createP('Submit your name to continue.');
  userReq.id('namealert');
  //load initial JSONObject
  loadJSON('convo.json', getOldConvo);
  // socket io script
  socket = io.connect("http://localhost:8000");
  //get broadcasted text & post to browser
  socket.on('chatmsg', function(data) {
    let posttext = data.user + " (" + convertDate(data.time) + "): " + data.msg
    let p = createP(posttext);
    chatbody.child(p);
  });
}

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
    //check reply time interval
    timeCheck(newMsgData);
    //check length
    lengthCheck(newMsgData);
    if (timeLonger && msgLonger) {
      //emit to other viewers
      socket.emit('chatmsg', newMsgData);
      //post to chat
      let posttext = newMsgData.user + " (" + convertDate(newMsgData.time) + "): " + newMsgData.msg;
      let p = createP(posttext);
      chatbody.child(p);
      // msgCount++;
      cleartext();
    }
  }
  return false;
}

function updateJSON(data) {
  newinfo = data;
  messagecount = Object.keys(newinfo).length;
  lastInterval = newinfo[messagecount - 1].time - newinfo[messagecount - 2].time;
  lastLength = newinfo[messagecount -1].length;
  console.log('json file loaded');
}

function getOldConvo(data) {
  //pass data to newinfo
  newinfo = data;
  messagecount = Object.keys(newinfo).length;
  //show all old messages
  for (let i = 1; i < messagecount; i++) {
    let posttext = newinfo[i].user + " (" + convertDate(newinfo[i].time) + "): " + newinfo[i].msg;
    let p = createP(posttext);
    chatbody.child(p);
  }
  //calculate necessary info
  lastInterval = newinfo[messagecount - 1].time - newinfo[messagecount - 2].time;
  lastLength = newinfo[messagecount -1].length;
}

let timeleft
//if wait time is longer than previous
function timeCheck(newMessage) {
  messagecount = Object.keys(newinfo).length;
  //if there are less than 2 messages (the first message at index 0 is a test entry)
  //than allow users to send message
  if (messagecount < 3) {
    timeLonger = true;
  } else {
    //otherwise check if new message interval is longer
    newInterval = newMessage.time - newinfo[messagecount - 1].time;
    if (newInterval >= lastInterval) {
      //if so allow user to send
      timeLonger = true;
    } else if (newInterval < lastInterval) {
      //if not tell user the wait time & don't allow to send
      timeleft = lastInterval - newInterval;
      let timewarning = createP('wait ' + convertTime(timeleft) + ' before sending a message');
      timewarning.class('warning');
      chatbody.child(timewarning);
      timeLonger = false;
    }
  }
}

//check message is longer than previous
function lengthCheck(newMessage) {
  messagecount = Object.keys(newinfo).length;
  if (messagecount < 3){
    msgLonger = true;
  } else {
    newLength = newMessage.length;
    if (newLength >= lastLength){
      msgLonger = true;
    } else if (newLength < lastLength){
      let charNeeded = lastLength - newLength;
      let lengthWarning = createP('your message needs ' + charNeeded + ' more characters');
      lengthWarning.class('warning');
      chatbody.child(lengthWarning);
      msgLonger = false;
    }
  }
}
