import PathManager from './PathManager';
import SocketEmitter from './SocketEmitter';
import GUI from './gui';

try {
    var socket = io();
    paper.install(window);
}
catch (e) {
    console.warn("paper.js or socket.io scripts didn't load synchronously before client script");
    throw e;
}


// initialize the UI angular app
GUI.init(angular, socket);

window.onload = function () {
    var canvas = document.getElementById('canvas');
    paper.setup(canvas);

    let pathname = window.location.pathname;
    let path = pathname.length > 3 ? pathname.substring(3, pathname.length) : 'root';

    console.log('pathname:', pathname, 'path:', path);
    socket.emit('health:alive', path);
};
