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

        draw.onMouseDown = handleNewPath(path);
        draw.onMouseDrag = handleDrawPath(path);

        socket.on('path:new', handleNewPath(socketPath));
        socket.on('path:draw', handleDrawPath(socketPath));

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