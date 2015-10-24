var wb;
(function(wb) {

    wb.SocketEmitter = (function() {
        var pm = function(socket) {
            this.socket = socket;
            this.lastData = null;
            this.dataToSend = null;
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