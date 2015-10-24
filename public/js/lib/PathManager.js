var wb;
(function(wb) {

    wb.PathManager = (function() {
        var pm = function() {
            this.path = false;
            this.prevPaths = [];
        };
        pm.prototype.setPath = function(path) { this.path = path; };
        pm.prototype.getPath = function() { return this.path; };
        pm.prototype.pushPath = function(path) { this.prevPaths.push(path); };
        return pm;
    })();

})(wb || (wb = {}));