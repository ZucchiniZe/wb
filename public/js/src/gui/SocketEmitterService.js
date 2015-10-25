import SocketEmitter from '../SocketEmitter';

class SocketEmitterService {

    static hasInstance() {
        if (!this.$$instance) {
            this.$$instance = true;
            return false;
        }
        return true;
    }

    static init(angular, socket) {

        if (SocketEmitterService.hasInstance()) {
            return;
        }

        angular.module('wb:service:socketemitter', [])
            .factory('SocketEmitterService', ['$rootScope', function ($rootScope) {

                var _instance = false;

                return {
                    getInstance: function() {
                        if (!_instance) {
                            _instance = new SocketEmitter(socket);
                        }
                        return _instance;
                    }
                }
            }])
    }
}

module.exports = SocketEmitterService;