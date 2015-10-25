export default class Users {

    static hasInstance() {
        if (!this.$$instance) {
            this.$$instance = true;
            return false;
        }
        return true;
    }

    static init(angular, socket) {

        if (Users.hasInstance()) {
            return;
        }

        angular.module('wb:users', [])
            .factory('UsersService', ['$rootScope', function ($rootScope) {
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
                    }
                    else if (data.nickname) {
                        users[data.uid].nickname = data.nickname;
                    }
                    else if (data.color) {
                        users[data.uid].color = data.color;
                    }

                    $rootScope.$apply();
                });

                return {
                    users: users
                };
            }]);
    }
};
