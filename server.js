var express = require('express');
var http = require('http')
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var websocket = socketio(server);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

websocket.on('connection', function(socket){
  console.log('new user connected');

  const id = getRandom(1, 100)

  socket.emit('send-id', id)

  socket.on('send', function(data) {
    websocket.emit('send', data)
  })
});

server.listen(3000, function() { console.log('listening on *:3000') });
