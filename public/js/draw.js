(function(wb) {

    var pen, eraser,
        path = new wb.PathManager(),
        socketPath = new wb.PathManager(),
        dataToSend = {},
        dataSendFn,
        dataSendActive = false;

    try {
        var socket = io();
        paper.install(window);
    }
    catch (e) {
        console.warn("paper.js or socket.io scripts didn't load synchronously before client script");
        console.error("Exception:",e);
        return;
    }

    window.onload = function () {

        canvas = document.getElementById('canvas');
        container = document.getElementById('container');
        paper.setup(canvas);

        pen = new paper.Tool();
        pen.minDistance = 10;
        //eraser = new paper.Tool();

        pen.onMouseDown = handleNewPath(path);
        pen.onMouseDrag = handleDrawPath(path);
        pen.onMouseUp = stopDataSend();

        socket.on('pen:create', handleNewPath(socketPath));
        socket.on('pen:extend', handleDrawPath(socketPath));

        paper.view.draw();

    };

    function handleNewPath(pm, sendOpts) {
        return function (e) {
            // always make a new path
            pm.setPath(new paper.Path());

            var path = pm.getPath();
            path.strokeColor = 'black';
            path.add(e.point);

            if (sendOpts) {
                sendData(sendOpts.eventName, sendOpts.socket, e);
            }
        }
    }

    function handleDrawPath(pm, sendOpts) {
        return function (e) {

            debugger;
            // there should already be a path on the pathmanager
            var path = pm.getPath();

            path.add(e.point);

            if (sendOpts) {
                sendData(sendOpts.eventName, sendOpts.socket, e);
            }
        }
    }

    function sendData(eventName, socket, data) {
        dataToSend = data;

        if (!dataSendActive) {
            dataSendFn = setInterval(function emit() {
                socket.emit(eventName, dataToSend);
            }, 100);
            dataSendActive = true;
        }
    }

    function stopDataSend() {
        return function() {
            clearInterval(dataSendFn);
        }
    }

    function emit(socket, eventName, data) {
        socket.emit(eventName, data);
    }

    function resizeCanvas($canvas, $parent) {
        var aspect = $canvas.height / $canvas.width,
            width = $parent.offsetWidth,
            height = $parent.offsetHeight;

        $canvas.width = width;
        $canvas.height = Math.round(aspect * width);
    }

})(wb);