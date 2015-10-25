import HandlerFactory from './HandlerFactory';
import PathManagerService from './PathManagerService';

class Tool {

    static hasInstance() {
        if (!this.$$instance) {
            this.$$instance = true;
            return false;
        }
        return true;
    }

    static init(angular, socket) {

        if (Tool.hasInstance()) {
            return;
        }

        HandlerFactory.init(angular, socket);
        PathManagerService.init(angular);

        angular.module('wb:tool', ['wb:handler', 'wb:service:socketemitter', 'wb:service:pathmanager'])
            .factory('ToolService', [
                '$rootScope',
                'HandlerFactory',
                'PathManagerService',
                'SocketEmitterService',
                function ($rootScope, Handler, PathManager, SocketEmitter) {

                var emitter = SocketEmitter.getInstance();

                var stopDataSend = function() {
                    clearInterval(emitter.dataSendFn);
                    emitter.dataSendActive = false;
                };

                var tools = {};

                return {

                    get: function(type) {
                        if (type) {
                            return tools[type];
                        }
                    },

                    make: function(opts) {
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
                }
            }])
    }
}

module.exports = Tool;