var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

arrData = {};

io.on('connection', function(socket){
  socket.on('sending data', function(msg){
  	arrData[msg['key']] = msg['data'];
  });
});

io.on('connection', function(socket){
  socket.on('request data', function(msg){
  	arrReturn = {"key" : msg, "data" : arrData[msg]}
    io.emit('return data', arrReturn);
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});