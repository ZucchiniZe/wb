(function(wb) {

    var pen, eraser,
        clientPath = new wb.PathManager(),
        socketPath = new wb.PathManager(),
        paths = [],
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

        paper.view.draw();

    };

    function handleNewPath(pm, sendOpts) {
        return function (e) {
            if (typeof e === 'string') {
                e = JSON.parse(e);
                e.point = correctPoint(e);
            }

            // save reference to the old path
            pm.pushPath(pm.getPath());

            // make a new path
            pm.setPath(new paper.Path());

            // set path properties
            var path = pm.getPath();
            path.strokeColor = 'black';

            path.add(e.point);

            if (sendOpts) {
                sendData(sendOpts.eventName, e, true);
            }
        }
    }

    function handleDrawPath(pm, sendOpts) {
        return function (e) {
            if (typeof e === 'string') {
                e = JSON.parse(e);
                e.point = correctPoint(e)
            }

            // there should already be a path on the pathmanager
            var path = pm.getPath();

            path.add(e.point);

            // re-smooth path
            path.smooth();

            if (sendOpts) {
                sendData(sendOpts.eventName, e);
            }
        }
    }

    function correctPoint(e) {
        return new paper.Point(e.point[1], e.point[2]);
    }

    function sendData(eventName, data, once) {
        dataToSend = {
            eventName: eventName,
            point: data.point
        };

        if (once) {
            socket.emit(dataToSend.eventName, JSON.stringify(dataToSend));
        }
        else if (!dataSendActive) {
            dataSendFn = setInterval(function emit() {
                socket.emit(dataToSend.eventName, JSON.stringify(dataToSend));
            }, 25);
            dataSendActive = true;
        }
    }

    function stopDataSend() {
        return function() {
            clearInterval(dataSendFn);
            dataSendActive = false;
        }
    }

    function resizeCanvas($canvas, $parent) {
        var aspect = $canvas.height / $canvas.width,
            width = $parent.offsetWidth,
            height = $parent.offsetHeight;

        $canvas.width = width;
        $canvas.height = Math.round(aspect * width);
    }

})(wb);