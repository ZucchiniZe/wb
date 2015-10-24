(function(wb) {

    var pen, eraser,
        currentPath = new wb.PathManager(),
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
        //eraser = new paper.Tool();

        pen.onMouseDown = handleNewPath(currentPath, {
            eventName: 'pen:create'
        });
        pen.onMouseDrag = handleDrawPath(currentPath);
        pen.onMouseUp = stopDataSend();

        socket.on('pen:create', handleNewPath(socketPath));
        socket.on('pen:extend', handleDrawPath(socketPath));

        paper.view.draw();

    };

    function handleNewPath(pm, sendOpts) {
        return function (e) {
            // always make a new currentPath
            pm.setPath(new paper.Path());

            var currentPath = pm.getPath();
            currentPath.strokeColor = 'black';
            currentPath.add(e.point);

            if (sendOpts) {
                sendData(sendOpts.eventName, e);
            }
        }
    }

    function handleDrawPath(pm, sendOpts) {
        return function (e) {
            // there should already be a path on the pathmanager
            var currentPath = pm.getPath();

            currentPath.add(e.point);

            if (sendOpts) {
                sendData(sendOpts.eventName, e);
            }
        }
    }

    function sendData(eventName, data) {
        dataToSend = data;

        if (!dataSendActive) {
            dataSendFn = setInterval(function emit() {
                socket.emit(eventName, JSON.stringify(data.point));
            }, 100);
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