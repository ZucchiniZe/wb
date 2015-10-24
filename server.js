'use strict';

var express = require('express'),
    socket = require('socket.io');

var app = express();

var server = require('http').createServer(app),
    PORT = 4000;

var io = socket(server);

io.on('connection', function(socket) {
    console.log('user connected');

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('draw:line', function(data) {
        console.log('drew line', data);

        socket.broadcast.emit('draw:line', data);
    })
});

// express GET / and static /public files
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/public', express.static('public'));

server.listen(PORT);
console.log("server listening on port",PORT);