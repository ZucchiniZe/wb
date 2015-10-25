import express from 'express';
import http from 'http';
import Socket from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = Socket(server);

const port = 4000 || process.env['PORT'];

// express GET / and static /public files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/b/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket) {
    socket.on('health:alive', data => {
        socket.roomName = data || 'test';
    });

    console.log(socket.roomName);

    socket.join(socket.roomName);

    console.log(io.sockets.adapter.rooms);

    // console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('pen:create', (data) => {
        console.log('create line', data);

        socket.broadcast.emit('pen:create', data);
    });

    socket.on('pen:extend', (data) => {
        console.log('drew line', data);

        socket.broadcast.emit('pen:extend', data);
    });
});

console.log("server listening on port", port);
server.listen(port);
