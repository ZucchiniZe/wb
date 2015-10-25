import PathManager from './PathManager';
import SocketEmitter from './SocketEmitter';
import GUI from './gui/gui';

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

    // for angular to use in $window service
    window.wbcanvas = canvas;
};