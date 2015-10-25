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

	var _SocketEmitter = __webpack_require__(2);

	var _SocketEmitter2 = _interopRequireDefault(_SocketEmitter);

	var _guiGui = __webpack_require__(3);

	var _guiGui2 = _interopRequireDefault(_guiGui);

	try {
	    var socket = io();
	    paper.install(window);
	} catch (e) {
	    console.warn("paper.js or socket.io scripts didn't load synchronously before client script");
	    throw e;
	}

	// initialize the UI angular app
	_guiGui2['default'].init(angular, socket);

	window.onload = function () {
	    var canvas = document.getElementById('canvas');
	    paper.setup(canvas);

	    // for angular to use in $window service
	    window.wbcanvas = canvas;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var PathManager = (function () {
	    function PathManager() {
	        _classCallCheck(this, PathManager);

	        this.$$path = false;
	        this.$$width = 1;
	        this.$$color = 'black';
	        this.$$prevPaths = [];
	    }

	    _createClass(PathManager, [{
	        key: 'pushPath',
	        value: function pushPath(path) {
	            this.$$prevPaths.push(path);
	        }
	    }, {
	        key: 'path',
	        get: function get() {
	            return this.$$path;
	        },
	        set: function set(path) {
	            this.$$path = path;
	        }
	    }, {
	        key: 'width',
	        get: function get() {
	            return this.$$width;
	        },
	        set: function set(width) {
	            this.$$width = width;
	        }
	    }, {
	        key: 'color',
	        get: function get() {
	            return this.$$color;
	        },
	        set: function set(color) {
	            this.$$color = color;
	        }
	    }]);

	    return PathManager;
	})();

	module.exports = PathManager;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SocketEmitter = (function () {
	    function SocketEmitter(socket) {
	        _classCallCheck(this, SocketEmitter);

	        this.socket = socket;
	        this.$$lastData = null;
	        this.$$nextData = null;
	        this.dataSendActive = false;
	        this.dataSendFn = null;
	        this.$$interval = 15;
	    }

	    _createClass(SocketEmitter, [{
	        key: "sendData",
	        value: function sendData(eventName, data) {
	            var once = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	            var self = this;

	            self.$$lastData = self.$$nextData;
	            self.$$nextData = {
	                eventName: eventName,
	                point: data.point,
	                delta: data.delta,
	                width: data.width,
	                color: data.color
	            };

	            if (once) {
	                self.socket.emit(self.$$nextData.eventName, JSON.stringify(self.$$nextData));
	            } else if (!self.dataSendActive) {
	                self.dataSendFn = setInterval(function emit() {
	                    if (!SocketEmitter.$$dataEquals(self.$$lastData, self.$$nextData)) {
	                        self.$$lastData = self.$$nextData;
	                        self.socket.emit(self.$$nextData.eventName, JSON.stringify(self.$$nextData));
	                    }
	                }, self.$$interval);
	                self.dataSendActive = true;
	            }
	        }
	    }, {
	        key: "lastData",
	        get: function get() {
	            return this.$$lastData;
	        },
	        set: function set(data) {
	            this.$$lastData = data;
	        }
	    }, {
	        key: "nextData",
	        get: function get() {
	            return this.$$nextData;
	        },
	        set: function set(data) {
	            this.$$nextData = data;
	        }
	    }], [{
	        key: "$$dataEquals",
	        value: function $$dataEquals(d1, d2) {
	            if (d1.point && d2.point) {
	                return d1.point.equals(d2.point);
	            }
	        }
	    }]);

	    return SocketEmitter;
	})();

	module.exports = SocketEmitter;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Users = __webpack_require__(4);

	var _Users2 = _interopRequireDefault(_Users);

	var _Tool = __webpack_require__(5);

	var _Tool2 = _interopRequireDefault(_Tool);

	var GUI = (function () {
	    function GUI() {
	        _classCallCheck(this, GUI);
	    }

	    _createClass(GUI, null, [{
	        key: 'hasInstance',
	        value: function hasInstance() {
	            if (!this.$$instance) {
	                this.$$instance = true;
	                return false;
	            }
	            return true;
	        }
	    }, {
	        key: 'init',
	        value: function init(angular, socket) {

	            if (GUI.hasInstance()) {
	                return;
	            }

	            _Users2['default'].init(angular, socket);
	            _Tool2['default'].init(angular, socket);

	            angular.module('wb:gui', ['wb:users', 'wb:tool', 'wb:service:pathmanager']).controller('gui', ['$scope', 'UsersService', 'ToolService', 'PathManagerService', '$window', function ($scope, UsersService, Tool, PathManager, $window) {

	                var clientPath = PathManager.getClient(),
	                    socketPath = PathManager.getSocket();

	                $scope.settings = {
	                    pen: {
	                        selectedSize: 5,
	                        sizes: [1, 2.5, 5, 10, 20]
	                    },
	                    eraser: {
	                        selectedSize: 5,
	                        sizes: [5, 10, 20]
	                    },
	                    paint: {
	                        selectedSize: 2.5,
	                        sizes: [1, 2.5, 5, 10, 20]
	                    }
	                };

	                var makeScopeTool = function makeScopeTool(type) {
	                    clientPath.color = userColor;
	                    return Tool.make({
	                        type: type
	                    });
	                };

	                /**
	                 * Scope fns
	                 */
	                var randomHex = Math.floor(Math.random() * Math.pow(16, 6)).toString(16); // random for testing purposes, really get this from UsersService
	                var userColor = '#',
	                    i = randomHex.length;
	                while (i-- < 6) {
	                    userColor += '0';
	                }
	                userColor += randomHex;

	                $scope.clear = function () {
	                    paper.project.clear();
	                };

	                $scope.selectTool = function (type) {
	                    $scope.selectedTool = type;
	                    $scope[type] = makeScopeTool(type);
	                    $scope[type].activate();
	                };

	                // Called as selectSize(toolType, selectedSize);
	                $scope.selectSize = function (type, size) {
	                    $scope.settings[type].selectedSize = size;
	                    $scope.selectTool(type);
	                    clientPath.width = size;
	                };

	                // Called as activate.call(toolObject);
	                $scope.activate = function () {
	                    this.activate();
	                };

	                /**
	                 * Scope watch objects
	                 */

	                $scope.users = UsersService.users;

	                $scope.paint = makeScopeTool('paint');
	                $scope.eraser = makeScopeTool('eraser');
	                $scope.pen;
	                $scope.selectTool('pen');
	            }]);
	        }
	    }]);

	    return GUI;
	})();

	module.exports = GUI;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Users = (function () {
	    function Users() {
	        _classCallCheck(this, Users);
	    }

	    _createClass(Users, null, [{
	        key: 'hasInstance',
	        value: function hasInstance() {
	            if (!this.$$instance) {
	                this.$$instance = true;
	                return false;
	            }
	            return true;
	        }
	    }, {
	        key: 'init',
	        value: function init(angular, socket) {

	            if (Users.hasInstance()) {
	                return;
	            }

	            angular.module('wb:users', []).factory('UsersService', ['$rootScope', function ($rootScope) {
	                var users = {};

	                socket.on('user:connection', function (data) {
	                    /**
	                     * User data should include
	                     *      - server assigned uid
	                     *      - user nickname
	                     *      - user color
	                     */
	                    var uid = data.uid;

	                    if (!users[uid]) {
	                        delete data.uid;
	                        users[uid] = data;
	                    }

	                    $rootScope.$apply();
	                });

	                socket.on('user:disconnect', function (uid) {
	                    /**
	                     * Data should just be a uid
	                     */
	                    delete users[uid];

	                    $rootScope.$apply();
	                });

	                socket.on('user:updated', function (data) {
	                    if (!users[data.uid]) {
	                        return;
	                    } else if (data.nickname) {
	                        users[data.uid].nickname = data.nickname;
	                    } else if (data.color) {
	                        users[data.uid].color = data.color;
	                    }

	                    $rootScope.$apply();
	                });

	                return {
	                    users: users
	                };
	            }]);
	        }
	    }]);

	    return Users;
	})();

	module.exports = Users;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _HandlerFactory = __webpack_require__(6);

	var _HandlerFactory2 = _interopRequireDefault(_HandlerFactory);

	var _PathManagerService = __webpack_require__(8);

	var _PathManagerService2 = _interopRequireDefault(_PathManagerService);

	var Tool = (function () {
	    function Tool() {
	        _classCallCheck(this, Tool);
	    }

	    _createClass(Tool, null, [{
	        key: 'hasInstance',
	        value: function hasInstance() {
	            if (!this.$$instance) {
	                this.$$instance = true;
	                return false;
	            }
	            return true;
	        }
	    }, {
	        key: 'init',
	        value: function init(angular, socket) {

	            if (Tool.hasInstance()) {
	                return;
	            }

	            _HandlerFactory2['default'].init(angular, socket);
	            _PathManagerService2['default'].init(angular);

	            angular.module('wb:tool', ['wb:handler', 'wb:service:socketemitter', 'wb:service:pathmanager']).factory('ToolService', ['$rootScope', 'HandlerFactory', 'PathManagerService', 'SocketEmitterService', function ($rootScope, Handler, PathManager, SocketEmitter) {

	                var emitter = SocketEmitter.getInstance();

	                var stopDataSend = function stopDataSend() {
	                    clearInterval(emitter.dataSendFn);
	                    emitter.dataSendActive = false;
	                };

	                var tools = {};

	                return {

	                    get: function get(type) {
	                        if (type) {
	                            return tools[type];
	                        }
	                    },

	                    make: function make(opts) {
	                        switch (opts.type) {

	                            case 'pen':
	                                var pen = new paper.Tool();

	                                pen.minDistance = 5;

	                                pen.onMouseDown = Handler.handleNewPath(PathManager.getClient(), {
	                                    type: 'pen',
	                                    emit: {
	                                        eventName: 'pen:create'
	                                    }
	                                });
	                                pen.onMouseDrag = Handler.handleDrawPath(PathManager.getClient(), {
	                                    type: 'pen',
	                                    emit: {
	                                        eventName: 'pen:extend'
	                                    }
	                                });
	                                /*pen.onMouseMove = Handler.handleDrawCursor({
	                                    type: 'pen',
	                                    color: opts.color,
	                                    width: opts.width
	                                });*/
	                                pen.onMouseUp = stopDataSend;

	                                socket.on('pen:create', Handler.handleNewPath(PathManager.getSocket()));
	                                socket.on('pen:extend', Handler.handleDrawPath(PathManager.getSocket()));

	                                tools.pen = pen;
	                                return pen;

	                            case 'paint':
	                                var paint = new paper.Tool();

	                                paint.minDistance = 5;

	                                paint.onMouseDown = Handler.handleNewPath(PathManager.getClient(), {
	                                    type: 'paint',
	                                    emit: {
	                                        eventName: 'paint:create'
	                                    }
	                                });
	                                paint.onMouseDrag = Handler.handleDrawPath(PathManager.getClient(), {
	                                    type: 'paint',
	                                    emit: {
	                                        eventName: 'paint:extend'
	                                    }
	                                });
	                                paint.onMouseUp = stopDataSend;

	                                socket.on('paint:create', Handler.handleNewPath(PathManager.getSocket()));
	                                socket.on('paint:extend', Handler.handleDrawPath(PathManager.getSocket()));

	                                tools.paint = paint;
	                                return paint;

	                            case 'eraser':
	                                var eraser = new paper.Tool();

	                                eraser.minDistance = 5;

	                                eraser.onMouseDownFn = Handler.handleNewPath(PathManager.getClient(), {
	                                    type: 'eraser',
	                                    emit: {
	                                        eventName: 'eraser:create'
	                                    }
	                                });
	                                eraser.onMouseDrag = Handler.handleDrawPath(PathManager.getClient(), {
	                                    type: 'eraser',
	                                    emit: {
	                                        eventName: 'eraser:extend'
	                                    }
	                                });
	                                eraser.onMouseUp = stopDataSend;

	                                socket.on('eraser:create', Handler.handleNewPath(PathManager.getSocket()));
	                                socket.on('eraser:extend', Handler.handleDrawPath(PathManager.getSocket()));

	                                tools.eraser = eraser;
	                                return eraser;
	                        }
	                    }
	                };
	            }]);
	        }
	    }]);

	    return Tool;
	})();

	module.exports = Tool;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _SocketEmitterService = __webpack_require__(7);

	var _SocketEmitterService2 = _interopRequireDefault(_SocketEmitterService);

	var HandlerFactory = (function () {
	    function HandlerFactory() {
	        _classCallCheck(this, HandlerFactory);
	    }

	    _createClass(HandlerFactory, null, [{
	        key: 'hasInstance',
	        value: function hasInstance() {
	            if (!this.$$instance) {
	                this.$$instance = true;
	                return false;
	            }
	            return true;
	        }
	    }, {
	        key: 'init',
	        value: function init(angular, socket) {

	            if (HandlerFactory.hasInstance()) {
	                return;
	            }

	            _SocketEmitterService2['default'].init(angular, socket);

	            angular.module('wb:handler', ['wb:service:socketemitter']).factory('HandlerFactory', ['$rootScope', 'SocketEmitterService', function ($rootScope, SocketEmitter) {

	                var correctPoint = function correctPoint(e) {
	                    return new paper.Point(e.point[1], e.point[2]);
	                };

	                var emitter = SocketEmitter.getInstance(),
	                    cursor;

	                return {
	                    handleNewPath: function handleNewPath(pm, opts) {
	                        return function (e) {
	                            if (typeof e === 'string') {
	                                e = JSON.parse(e);
	                                e.point = correctPoint(e);
	                                pm.color = e.color;
	                            }

	                            // save reference to the old path
	                            pm.pushPath(pm.path);

	                            // make a new path
	                            pm.path = new paper.Path();

	                            // set path properties
	                            var path = pm.path;
	                            path.strokeColor = pm.color;

	                            path.add(e.point);

	                            if (opts && opts.emit) {
	                                emitter.sendData(opts.emit.eventName, Object.assign(e, { width: pm.width, color: pm.color }), true);
	                            }
	                        };
	                    },

	                    handleDrawPath: function handleDrawPath(pm, opts) {
	                        return function (e) {
	                            if (typeof e === 'string') {
	                                e = JSON.parse(e);
	                                e.point = correctPoint(e);
	                                pm.width = e.width;
	                                pm.color = e.color;
	                            }

	                            // there should already be a path on the pathmanager
	                            var path = pm.path;

	                            // if paint, adjust stroke width based on delta
	                            if (opts && opts.type === 'paint') {
	                                var k = 50;
	                                path.strokeWidth = k * pm.width / e.delta;
	                            } else {
	                                path.strokeWidth = pm.width;
	                            }

	                            path.add(e.point);

	                            // re-smooth path
	                            path.smooth();

	                            paper.view.draw();

	                            if (opts && opts.emit) {
	                                emitter.sendData(opts.emit.eventName, Object.assign(e, { width: pm.width, color: pm.color }));
	                            }
	                        };
	                    },

	                    handleDrawCursor: function handleDrawCursor(opts) {
	                        debugger;
	                        var width = opts.width;
	                        if (opts && (opts.type === 'pen' || opts.type === 'paint')) {
	                            cursor = new paper.Path.Circle(new paper.Point(0, 0), width / 2);
	                            cursor.fillColor = opts.color;
	                            cursor.strokeColor = opts.color;
	                        } else if (opts && opts.type === 'eraser') {
	                            cursor = new paper.Path.Circle({
	                                center: new paper.Point(0, 0),
	                                radius: width / 2
	                            });
	                            cursor.strokeColor = opts.black;
	                        }
	                        return function (e) {
	                            cursor.position = e.point;
	                        };
	                    }
	                };
	            }]);
	        }
	    }]);

	    return HandlerFactory;
	})();

	module.exports = HandlerFactory;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _SocketEmitter = __webpack_require__(2);

	var _SocketEmitter2 = _interopRequireDefault(_SocketEmitter);

	var SocketEmitterService = (function () {
	    function SocketEmitterService() {
	        _classCallCheck(this, SocketEmitterService);
	    }

	    _createClass(SocketEmitterService, null, [{
	        key: 'hasInstance',
	        value: function hasInstance() {
	            if (!this.$$instance) {
	                this.$$instance = true;
	                return false;
	            }
	            return true;
	        }
	    }, {
	        key: 'init',
	        value: function init(angular, socket) {

	            if (SocketEmitterService.hasInstance()) {
	                return;
	            }

	            angular.module('wb:service:socketemitter', []).factory('SocketEmitterService', ['$rootScope', function ($rootScope) {

	                var _instance = false;

	                return {
	                    getInstance: function getInstance() {
	                        if (!_instance) {
	                            _instance = new _SocketEmitter2['default'](socket);
	                        }
	                        return _instance;
	                    }
	                };
	            }]);
	        }
	    }]);

	    return SocketEmitterService;
	})();

	module.exports = SocketEmitterService;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _PathManager = __webpack_require__(1);

	var _PathManager2 = _interopRequireDefault(_PathManager);

	var PathManagerService = (function () {
	    function PathManagerService() {
	        _classCallCheck(this, PathManagerService);
	    }

	    _createClass(PathManagerService, null, [{
	        key: 'hasInstance',
	        value: function hasInstance() {
	            if (!this.$$instance) {
	                this.$$instance = true;
	                return false;
	            }
	            return true;
	        }
	    }, {
	        key: 'init',
	        value: function init(angular) {

	            if (PathManagerService.hasInstance()) {
	                return;
	            }

	            angular.module('wb:service:pathmanager', []).factory('PathManagerService', ['$rootScope', function ($rootScope) {

	                var client = false,
	                    socket = false;

	                return {
	                    getClient: function getClient() {
	                        if (!client) {
	                            client = new _PathManager2['default']();
	                        }
	                        return client;
	                    },
	                    getSocket: function getSocket() {
	                        if (!socket) {
	                            socket = new _PathManager2['default']();
	                        }
	                        return socket;
	                    }
	                };
	            }]);
	        }
	    }]);

	    return PathManagerService;
	})();

	module.exports = PathManagerService;

/***/ }
/******/ ]);