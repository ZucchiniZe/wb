var wb;
(function(wb) {

    wb.PathManager = (function() {
        var pm = function() {
            this.path = false;
        };
        pm.prototype.setPath = function(path) { this.path = path; };
        pm.prototype.getPath = function() { return this.path; };
        return pm;
    })();

})(wb || (wb = {}));