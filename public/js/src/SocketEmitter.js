var wb;
(function(wb) {

    wb.SocketEmitter = (function() {
        var pm = function(socket) {
            this.socket = socket;
            this.lastData = null;
            this.nextData = null;
            this.dataSendActive = false;
            this.dataSendFn = null;
        };

        pm.prototype.setData = function(data) {
            this.dataToSend = data;
        };

        pm.prototype.sendData = function(eventName, data, once) {
            var self = this;

            self.setData({
                eventName: eventName,
                point: data.point
            });

            if (once) {
                socket.emit(self.dataToSend.eventName, JSON.stringify(self.dataToSend));
            }
            else if (!self.dataSendActive) {
                self.dataSendFn = setInterval(function emit() {
                    socket.emit(self.dataToSend.eventName, JSON.stringify(self.dataToSend));
                }, 25);
                self.dataSendActive = true;
            }
        };

        return pm;
    })

})(wb || (wb = {}));

class SocketEmitter {

    constructor(socket) {
        this.socket = socket;
        this.$$lastData = null;
        this.$$nextData = null;
        this.dataSendActive = false;
        this.dataSendFn = null;
    }

    get lastData() {
        return this.$$lastData;
    }

    set lastData(data) {
        this.$$lastData = data;
    }

    get nextData() {
        return this.$$nextData;
    }

    set nextData(data) {
        this.$$nextData = data;
    }

    sendData(eventName, data, once = false) {
        var self = this;

        self.$$nextData = {
            eventName: eventName,
            point: data.point
        };

        if (once) {
            self.socket.emit(self.$$nextData.eventName, JSON.stringify(self.$$nextData));
        }
        else if (!self.dataSendActive) {
            self.dataSendFn = setInterval(function emit() {
                self.socket.emit(self.$$nextData.eventName, JSON.stringify(self.$$nextData));
            }, 25);
            self.dataSendActive = true;
        }
    }

}

module.exports = SocketEmitter;