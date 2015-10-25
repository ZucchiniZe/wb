import PathManager from './PathManager';
import SocketEmitter from './SocketEmitter';
import GUI from './gui/gui';

try {
    var socket = io();
    paper.install(window);
}
catch (e) {
    console.warn("paper.js or socket.io scripts didn't load synchronously before client script");
    throw e;
}

var pen, eraser,
    clientPath = new PathManager(),
    socketPath = new PathManager(),
    emitter = new SocketEmitter(socket);

window.onload = function () {
    let pathname = window.location.pathname;
    let path = pathname > 3 ? pathname.substring(3, pathname.length) : 'root';
    socket.emit('health:alive', path);


    var canvas = document.getElementById('canvas');
    var container = document.getElementById('container');
    paper.setup(canvas);

    pen = new paper.Tool();
    pen.minDistance = 5;
    eraser = new paper.Tool();

    pen.onMouseDown = handleNewPath(clientPath, {
        eventName: 'pen:create'
    });
    pen.onMouseDrag = handleDrawPath(clientPath, {
        eventName: 'pen:extend'
    });
    pen.onMouseUp = stopDataSend();

    socket.on('pen:create', handleNewPath(socketPath));
    socket.on('pen:extend', handleDrawPath(socketPath));

};

function handleNewPath(pm, emit) {
    return function (e) {
        if (typeof e === 'string') {
            e = JSON.parse(e);
            e.point = correctPoint(e);
        }

        // save reference to the old path
        pm.pushPath(pm.path);

        // make a new path
        pm.path = new paper.Path();

        // set path properties
        var path = pm.path;
        path.strokeColor = 'black';

        path.add(e.point);

        if (emit) {
            emitter.sendData(emit.eventName, e, true);
        }
    };
}

function handleDrawPath(pm, emit) {
    return function (e) {
        if (typeof e === 'string') {
            e = JSON.parse(e);
            e.point = correctPoint(e);
        }

        // there should already be a path on the pathmanager
        var path = pm.path;

        path.add(e.point);

        // re-smooth path
        path.smooth();

        paper.view.draw();

        if (emit) {
            emitter.sendData(emit.eventName, e);
        }
    };
}

function correctPoint(e) {
    return new paper.Point(e.point[1], e.point[2]);
}

function stopDataSend() {
    return function() {
        clearInterval(emitter.dataSendFn);
        emitter.dataSendActive = false;
    };
}

function resizeCanvas($canvas, $parent) {
    var aspect = $canvas.height / $canvas.width,
        width = $parent.offsetWidth,
        height = $parent.offsetHeight;

    $canvas.width = width;
    $canvas.height = Math.round(aspect * width);
}
=======
// initialize the UI angular app
GUI.init(angular, socket);

window.onload = function () {
    var canvas = document.getElementById('canvas');
    paper.setup(canvas);
};
>>>>>>> 557eb4ae3f49e4c09bf90d3eea757839d6a30e83
