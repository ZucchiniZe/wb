export default class PathManager {

    constructor() {
        this.$$path = false;
        this.$$width = 1;
        this.$$color = 'black';
        this.$$prevPaths = [];
    }

    get path() {
        return this.$$path;
    }

    set path(path) {
        this.$$path = path;
    }

    get width() {
        return this.$$width;
    }

    set width(width) {
        this.$$width = width;
    }

    get color() {
        return this.$$color;
    }

    set color(color) {
        this.$$color = color;
    }

    pushPath(path) {
        this.$$prevPaths.push(path);
    }

};
