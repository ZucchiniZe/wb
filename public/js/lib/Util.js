var wb;
(function(wb) {

    wb.util = {};

    wb.util.resizeCanvas = function($canvas, $parent) {
        var aspect = $canvas.height / $canvas.width,
            width = $parent.offsetWidth,
            height = $parent.offsetHeight;

        $canvas.width = width;
        $canvas.height = Math.round(aspect * width);
    }

})(wb || (wb = {}));