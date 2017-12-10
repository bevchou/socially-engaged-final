//set up express
let express = require("express");
let app = express();
let server = app.listen(8000);

//file system
let fs = require('fs');

//load in conversation data
let convo, data;
let exists = fs.existsSync('convo.json');
if (exists) {
  console.log('loading conversation');
  data = fs.readFileSync('convo.json');
  convo = JSON.parse(data);
} else {
  console.log('no conversation available');
  convo = {};
}



//hosting files
app.use(express.static("public"));


let socket = require("socket.io");
let io = socket(server);
io.sockets.on("connection", newConnection);

function newConnection(socket) {
  console.log("new connection: " + socket.id);
  socket.on('chatmsg', function(data) {
    //data is the incoming object with each message's data
    //add to the json object
    let count = Object.keys(convo).length;
    convo[count] = data;
    //write to json file
    let json = JSON.stringify(convo, null, 2);
    fs.writeFile('convo.json', json, finished);
    function finished(err) {
      console.log('it worked');
    }
    //broadcast text message change to all users
    socket.broadcast.emit('chatmsg', data);
  });
}


//TEST JSON
// {
//   "0": {
//     "time": "time",
//     "msg": "message",
//     "length": "message.length",
//     "user": "username"
//   }
// }
