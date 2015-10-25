class PathManager {

    constructor() {
        this.$$path = false;
        this.$$prevPaths = [];
    }

    get path() {
        return this.$$path;
    }

    set path(path) {
        this.$$path = path;
    }

    pushPath(path) {
        this.$$prevPaths.push(path);
    }

}

module.exports = PathManager;