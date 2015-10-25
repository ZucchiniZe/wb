import SocketEmitterService from './SocketEmitterService';

class HandlerFactory {

    static hasInstance() {
        if (!this.$$instance) {
            this.$$instance = true;
            return false;
        }
        return true;
    }

    static init(angular, socket) {

        if (HandlerFactory.hasInstance()) {
            return;
        }

        SocketEmitterService.init(angular, socket);

        angular.module('wb:handler', ['wb:service:socketemitter'])
            .factory('HandlerFactory', ['$rootScope', 'SocketEmitterService', function ($rootScope, SocketEmitter) {

                var correctPoint = function(e) {
                    return new paper.Point(e.point[1], e.point[2]);
                };

                var emitter = SocketEmitter.getInstance(),
                    cursor;

                return {
                    handleNewPath: function(pm, opts) {
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
                                emitter.sendData(opts.emit.eventName, Object.assign(e, {width: pm.width, color: pm.color}), true);
                            }
                        }
                    },

                    handleDrawPath: function(pm, opts) {
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
                                let k = 50;
                                path.strokeWidth = k * pm.width / e.delta;
                            }
                            else {
                                path.strokeWidth = pm.width;
                            }

                            path.add(e.point);

                            // re-smooth path
                            path.smooth();

                            paper.view.draw();

                            if (opts && opts.emit) {
                                emitter.sendData(opts.emit.eventName, Object.assign(e, {width: pm.width, color: pm.color}));
                            }
                        }
                    },

                    handleDrawCursor: function(opts) {
                        debugger;
                        var width = opts.width;
                        if (opts && (opts.type === 'pen' || opts.type === 'paint')) {
                            cursor = new paper.Path.Circle(new paper.Point(0,0), width / 2);
                            cursor.fillColor = opts.color;
                            cursor.strokeColor = opts.color;
                        }
                        else if (opts && opts.type === 'eraser') {
                            cursor = new paper.Path.Circle({
                                center: new paper.Point(0,0),
                                radius: width / 2
                            });
                            cursor.strokeColor = opts.black;
                        }
                        return function(e) {
                            cursor.position = e.point;
                        }
                    }
                }
            }])
    }
}

module.exports = HandlerFactory;