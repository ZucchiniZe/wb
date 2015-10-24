(function() {

    var draw, erase, path, socketPath;

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

        draw = new paper.Tool();
        //erase = new paper.Tool();

        draw.onMouseDown = function (e) {
            path = new paper.Path();
            path.strokeColor = 'black';
            path.add(e.point);

            //socket.emit('path:new', e);
        };
        draw.onMouseDrag = function (e) {
            path.add(e.point);

            //socket.emit('path:draw', e);
        };

        socket.on('path:new', function (e) {
            socketPath = new paper.Path();
            socketPath.strokeColor = 'black';
            socketPath.add(e.point);
        });
        socket.on('path:draw', function (e) {
            socketPath.add(e.point);
        });

        paper.view.draw();

    };

    function handleNewPath(path) {
        return function (e) {
            path = new paper.Path();
            path.strokeColor = 'black';
            path.add(e.point);
        }
    }

    function handleDrawPath(path) {
        return function (e) {
            path.add(e.point);
        }
    }

    function resizeCanvas($canvas, $parent) {
        var aspect = $canvas.height / $canvas.width,
            width = $parent.offsetWidth,
            height = $parent.offsetHeight;

        $canvas.width = width;
        $canvas.height = Math.round(aspect * width);
    }

})();