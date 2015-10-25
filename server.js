import express from 'express';
import http from 'http';
import Socket from 'socket.io';
import uid from 'uid';

const app = express();
const server = http.createServer(app);
const io = Socket(server);

const port = 4000 || process.env['PORT'];

// express GET / and static /public files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

// keep track of users & available colors
let users = {};
let colors = ["#2CB3D0","#1C7185","#D1812C","85411C","#2E2E2E","E5A9E5"];

io.on('connection', function(socket) {

    console.log('user connected');
    let id = uid(10);
    let thisUser = {color: colors[Math.floor(Math.random() * 6)]};

    // notify all other sockets of new user
    socket.broadcast.emit('user:connection', thisUser);

    // notify this socket of all users currently in room
    for (var _uid in users) {
        if (users.hasOwnProperty(_uid)) {
            socket.emit('user:connection', _uid);
        };
    };

    console.log(users,thisUser);
    //finally, add user to room
    users[id] = thisUser;

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete users[id];
        socket.broadcast.emit('user:disconnect', id);
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
