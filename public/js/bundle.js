/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _PathManager = __webpack_require__(1);

	var _PathManager2 = _interopRequireDefault(_PathManager);

	var pen,
	    eraser,
	    clientPath = new _PathManager2['default'](),
	    socketPath = new _PathManager2['default'](),
	    paths = [],
	    dataToSend = {},
	    dataSendFn,
	    dataSendActive = false;

	try {
	    var socket = io();
	    paper.install(window);
	} catch (e) {
	    console.warn("paper.js or socket.io scripts didn't load synchronously before client script");
	    throw e;
	}

	window.onload = function () {

	    var canvas = document.getElementById('canvas');
	    var container = document.getElementById('container');
	    paper.setup(canvas);

	    pen = new paper.Tool();
	    pen.minDistance = 5;
	    eraser = new paper.Tool();

	    pen.onMouseDown = handleNewPath(clientPath, {
	        eventName: 'pen:create'
	    });
	    pen.onMouseDrag = handleDrawPath(clientPath, {
	        eventName: 'pen:extend'
	    });
	    pen.onMouseUp = stopDataSend();

	    socket.on('pen:create', handleNewPath(socketPath));
	    socket.on('pen:extend', handleDrawPath(socketPath));

	    paper.view.draw();
	};

	function handleNewPath(pm, sendOpts) {
	    return function (e) {
	        if (typeof e === 'string') {
	            e = JSON.parse(e);
	            e.point = correctPoint(e);
	        }

	        // save reference to the old path
	        pm.pushPath(pm.path);

	        // make a new path
	        pm.path = new paper.Path();

	        // set path properties
	        var path = pm.path;
	        path.strokeColor = 'black';

	        path.add(e.point);

	        if (sendOpts) {
	            sendData(sendOpts.eventName, e, true);
	        }
	    };
	}

	function handleDrawPath(pm, sendOpts) {
	    return function (e) {
	        if (typeof e === 'string') {
	            e = JSON.parse(e);
	            e.point = correctPoint(e);
	        }

	        // there should already be a path on the pathmanager
	        var path = pm.path;

	        path.add(e.point);

	        // re-smooth path
	        // path.smooth();

	        if (sendOpts) {
	            sendData(sendOpts.eventName, e);
	        }
	    };
	}

	function correctPoint(e) {
	    return new paper.Point(e.point[1], e.point[2]);
	}

	function sendData(eventName, data, once) {
	    dataToSend = {
	        eventName: eventName,
	        point: data.point
	    };

	    if (once) {
	        socket.emit(dataToSend.eventName, JSON.stringify(dataToSend));
	    } else if (!dataSendActive) {
	        dataSendFn = setInterval(function emit() {
	            socket.emit(dataToSend.eventName, JSON.stringify(dataToSend));
	        }, 25);
	        dataSendActive = true;
	    }
	}

	function stopDataSend() {
	    return function () {
	        clearInterval(dataSendFn);
	        dataSendActive = false;
	    };
	}

	function resizeCanvas($canvas, $parent) {
	    var aspect = $canvas.height / $canvas.width,
	        width = $parent.offsetWidth,
	        height = $parent.offsetHeight;

	    $canvas.width = width;
	    $canvas.height = Math.round(aspect * width);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PathManager = (function () {
	    function PathManager() {
	        _classCallCheck(this, PathManager);

	        this.$$path = false;
	        this.$$prevPaths = [];
	    }

	    _createClass(PathManager, [{
	        key: "pushPath",
	        value: function pushPath(path) {
	            this.$$prevPaths.push(path);
	        }
	    }, {
	        key: "path",
	        get: function get() {
	            return this.$$path;
	        },
	        set: function set(path) {
	            this.$$path = path;
	        }
	    }]);

	    return PathManager;
	})();

	module.exports = PathManager;

/***/ }
/******/ ]);