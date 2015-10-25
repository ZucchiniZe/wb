import PathManager from '../PathManager';

class PathManagerService {

    static hasInstance() {
        if (!this.$$instance) {
            this.$$instance = true;
            return false;
        }
        return true;
    }

    static init(angular) {

        if (PathManagerService.hasInstance()) {
            return;
        }

        angular.module('wb:service:pathmanager', [])
            .factory('PathManagerService', ['$rootScope', function ($rootScope) {

                var client = false,
                    socket = false;

                return {
                    getClient: function() {
                        if (!client) {
                            client = new PathManager();
                        }
                        return client;
                    },
                    getSocket: function() {
                        if (!socket) {
                            socket = new PathManager();
                        }
                        return socket;
                    }
                }
            }])
    }
}

module.exports = PathManagerService;