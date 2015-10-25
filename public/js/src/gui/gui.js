import Users from './Users';
import Tool from './Tool';

class GUI {

    static hasInstance() {
        if (!this.$$instance) {
            this.$$instance = true;
            return false;
        }
        return true;
    }

    static init(angular, socket) {

        if (GUI.hasInstance()) {
            return;
        }

        Users.init(angular, socket);
        Tool.init(angular, socket);

        angular.module('wb:gui', ['wb:users', 'wb:tool', 'wb:service:pathmanager'])
            .controller('gui', [
                '$scope',
                'UsersService',
                'ToolService',
                'PathManagerService',
                '$window',
                function ($scope, UsersService, Tool, PathManager, $window) {

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

                    var makeScopeTool = function (type) {
                        clientPath.color = userColor;
                        return Tool.make({
                            type: type
                        });
                    };

                    /**
                     * Scope fns
                     */
                    var randomHex = (Math.floor((Math.random() * Math.pow(16, 6)))).toString(16); // random for testing purposes, really get this from UsersService
                    var userColor = '#',
                        i = randomHex.length;
                    while (i-- < 6) {
                        userColor += '0';
                    }
                    userColor += randomHex;

                    $scope.clear = function() {
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

                }
            ]);
    }

}

module.exports = GUI;