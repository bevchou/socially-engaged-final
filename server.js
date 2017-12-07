let express = require("express");
let app = express();
let server = app.listen(3000);

app.use(express.static("public"));

console.log("bev's socket server is running!");

let socket = require("socket.io");
let io = socket(server);
io.sockets.on("connection", newConnection);



function newConnection(socket) {
  console.log("new connection: " + socket.id);
  socket.on('mouse', function(data) {
    socket.broadcast.emit('mouse', data);
    console.log(data);
  });
}


// let app = require('express')();
// let http = require('http').Server(app);
// let io = require('socket.io')(http);
//
// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });
//
// io.on('connection', function(socket) {
//   socket.on('chat message', function(msg) {
//     io.emit('chat message', msg);
//   });
// });
//
//
// http.listen(3000, function() {
//   console.log('listening on *:3000');
// });
