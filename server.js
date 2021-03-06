import express from 'express';
import debug from 'debug';
import morgan from 'morgan';
import http from 'http';
import Socket from 'socket.io';
import uid from 'uid';

const app = express();
const server = http.createServer(app);
const io = Socket(server);
const log = debug('dev');
const prod = debug('prod');

const port = 4000 || process.env['PORT'];

// express GET / and static /public files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/b/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));
app.use(morgan('combined'));

// keep track of users & available colors
let users = {};
let colors = ["#2CB3D0","#1C7185","#D1812C","85411C","#2E2E2E","E5A9E5"];

io.on('connection', function(socket) {
    var room = 'root';
    socket.on('health:alive', data => {
        room = data;
        log('proper room name', data);
    });

    socket.join(room);
    log('join room', room);

    log('user connected');
    prod('user connected');
    let id = uid(10);
    let thisUser = {color: colors[Math.floor(Math.random() * 6)]};

    // notify all other sockets of new user
    socket.broadcast.to(room).emit('user:connection', thisUser);

    // notify this socket of all users currently in room
    for (var _uid in users) {
        if (users.hasOwnProperty(_uid)) {
            socket.to(room).emit('user:connection', _uid);
        };
    };

    log(users,thisUser);
    //finally, add user to room
    users[id] = thisUser;

    socket.on('disconnect', () => {
        socket.leave(room);
        log('user disconnected');
        delete users[id];
        socket.broadcast.to(room).emit('user:disconnect', id);
    });

    socket.on('pen:create', (data) => {
        log('create line', data);

        socket.broadcast.to(room).emit('pen:create', data);
    });

    socket.on('pen:extend', (data) => {
        log('drew line', data);

        socket.broadcast.to(room).emit('pen:extend', data);
    });

    log(io.sockets.adapter.rooms);
});

console.log("server listening on port", port);
server.listen(port);
