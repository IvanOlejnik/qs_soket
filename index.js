var express = require('express');
var app = express();
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
        var currentDate = new Date();
        currentDate.setTime(currentDate.getTime() + 30*60*1000);// время жизни данных 30 минут;
        arrData[msg['key']] = [msg['data'], currentDate];
    });
});

io.on('connection', function(socket){
    socket.on('request data', function(msg){
        var currentDate = new Date();
        if(arrData[msg] !== undefined){
            if(arrData[msg][1] > currentDate){
                //находим разницу во времени из за часового пояса
                var timeDiff  = Math.abs(arrData[msg][1].getTimezoneOffset() * (60000));
                //чтоб не изменять время в arrData[msg][1], записали время в timeZone
                var timeZone = new Date(arrData[msg][1].getTime() + timeDiff);
                arrReturn = {"key" : msg, "data" : arrData[msg], "time" : timeZone}
                io.emit('return data', arrReturn);
            }else{
                delete arrData[msg]; //shift pop splice не подходят т.к. это ассоциативный массив
                // который является обьектом.
                arrReturn = null;
                io.emit('return data', arrReturn);
            }
        }else{
            arrReturn = null;
            io.emit('return data', arrReturn);
        }
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