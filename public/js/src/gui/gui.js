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

        Users.init(angular,socket);
        Tool.init(angular,socket);

        angular.module('wb:gui', ['wb:users', 'wb:tool'])
            .controller('gui', [
                '$scope',
                'UsersService',
                'ToolService',
                function($scope, UsersService, Tool) {

                    /**
                     * Scope fns
                     */

                    // Called as selectSize.call(toolObject, selectedSize);
                    $scope.selectSize = function(size) {
                        this.selectedSize = size;
                        Tool.setSize(this.type);
                    };

                    // Called as activate.call(toolObject);
                    $scope.activate = function() {
                        this.activate();
                    };

                    /**
                     * Scope watch objects
                     */

                    $scope.users = UsersService.users;

                    $scope.pen = Object.assign(Tool.make({
                        type: 'pen',
                        color: 'black',
                        width: 2.5
                    }), {
                        type: 'pen',
                        selectedSize: 2.5,
                        sizes: [2.5,5,10]
                    });
                    $scope.activate.call($scope.pen);

                    $scope.eraser = {
                        type: 'eraser',
                        sizes: [5,10,20]
                    };
                    $scope.paintbrush = {
                        type: 'paint',
                        sizes: [2.5,5,10]
                    };
                }
            ]);

    }
}

module.exports = GUI;