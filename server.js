//set up express
let express = require("express");
let app = express();
let server = app.listen(8000);

//file system & cross origin resources (cors)
let fs = require('fs');
let cors = require('cors');
app.use(cors());

//hosting files
app.use(express.static("public"));



// let socket = require("socket.io");
// let io = socket(server);
// io.sockets.on("connection", newConnection);

// function newConnection(socket) {
//   console.log("new connection: " + socket.id);
//   socket.on('chatmsg', function(msg) {
//     socket.broadcast.emit('chatmsg', data);
//
//   });
// }


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
