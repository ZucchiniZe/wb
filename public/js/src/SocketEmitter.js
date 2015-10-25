class SocketEmitter {

    constructor(socket) {
        this.socket = socket;
        this.$$lastData = null;
        this.$$nextData = null;
        this.dataSendActive = false;
        this.dataSendFn = null;
        this.$$interval = 15;
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

    static $$dataEquals(d1,d2) {
        if (d1.point && d2.point) {
            return d1.point.equals(d2.point);
        }
    }

    sendData(eventName, data, once = false) {
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
        }
        else if (!self.dataSendActive) {
            self.dataSendFn = setInterval(function emit() {
                if (!SocketEmitter.$$dataEquals(self.$$lastData,self.$$nextData)) {
                    self.$$lastData = self.$$nextData;
                    self.socket.emit(self.$$nextData.eventName, JSON.stringify(self.$$nextData));
                }
            }, self.$$interval);
            self.dataSendActive = true;
        }
    }

}

module.exports = SocketEmitter;