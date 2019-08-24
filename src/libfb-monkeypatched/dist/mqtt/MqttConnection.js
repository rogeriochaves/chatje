"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const events_1 = require("events");
const tls_1 = require("tls");
const debugLog = debug_1.default('fblib');
/**
 * Represents an encrypted real-time connection with facebook servers.
 * This class encapsulates all logic which handles communication using the propietary MQTT-like protocol.
 */
class MqttConnection extends events_1.EventEmitter {
    constructor() {
        super();
        this.socket = null;
        this.lastHeader = null;
        this.decodeBuffer = Buffer.alloc(0);
        this._connected = false;
        this.queue = [];
        this.on('reconnect', () => {
            if (this.queue.length) {
                const s = setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (!this.queue.length)
                        return clearInterval(s);
                    yield this.writeMessage(this.queue.shift());
                }), 200);
            }
        });
    }
    /**
     * Connects to Facebook mqtt servers. The promise is resolved when a secure TLS handshake is established. No CONNECT message is sent yet.
     */
    connect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                this.socket = tls_1.connect({
                    host: 'mqtt.facebook.com',
                    port: 443
                });
                this.socket.on('secureConnect', resolve);
                this.socket.on('error', reject);
            });
            this._connected = true;
            this.lastConnectTimestamp = new Date();
            this.socket.on('data', data => {
                debugLog('');
                debugLog('Data received!');
                this.readBuffer(data);
            });
            this.socket.on('close', () => {
                this._connected = false;
                debugLog('close');
                debugLog(Date.now() - this.lastConnectTimestamp.getTime());
                if (Date.now() - this.lastConnectTimestamp.getTime() < 1000) {
                    debugLog('failed');
                    this.emit('failed');
                    return;
                }
                this.emit('close');
                // throw new Error('Connection closed.')
            });
        });
    }
    // 🥖
    readBuffer(data) {
        if (!this.lastHeader) {
            this.lastHeader = MqttConnection.readHeader(data);
        }
        debugLog('Last header size:', this.lastHeader.size);
        const packetSize = this.lastHeader.i + this.lastHeader.size;
        debugLog('Packet size:', packetSize);
        debugLog('Current buffer size:', this.decodeBuffer.length);
        debugLog('Received buffer size:', data.length);
        this.decodeBuffer = Buffer.concat([
            this.decodeBuffer,
            data.slice(0, packetSize)
        ]);
        if (this.decodeBuffer.length < packetSize)
            return; // current data is less than we need; wait for more
        else if (this.decodeBuffer.length > packetSize) { // current data is more than we need; use it as another packet
            this.emitPacket();
            this.lastHeader = null;
            this.readBuffer(data.slice(packetSize, data.length));
        }
        else { // current data is exactly the amount of data we need; just parse it
            this.emitPacket();
            this.lastHeader = null;
        }
    }
    emitPacket() {
        const header = this.lastHeader;
        const packet = {
            type: this.decodeBuffer[0] >> 4,
            flag: this.decodeBuffer[0] & 0x0f,
            content: this.decodeBuffer.slice(header.i, header.i + header.size)
        };
        this.emit('packet', packet);
        this.decodeBuffer = Buffer.alloc(0);
    }
    writeMessage(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._connected)
                return this.queue.push(message);
            let size = message.toSend.byteLength;
            let result = Buffer.alloc(1);
            let byte = ((message.type & 0x0f) << 4) | (message.flags & 0x0f);
            result.writeUInt8(byte, 0);
            do {
                let byte = size & 0x7f;
                size >>= 7;
                if (size > 0)
                    byte |= 0x80;
                let buf = Buffer.alloc(1);
                buf.writeUInt8(byte, 0);
                result = Buffer.concat([result, buf]);
            } while (size > 0);
            return new Promise((resolve, reject) => {
                if (this.socket.destroyed)
                    return;
                this.socket.write(Buffer.concat([result, message.toSend]), err => {
                    if (err)
                        return reject(err);
                    resolve();
                });
            });
        });
    }
    /**
     * Parses a MQTT header.
     * @param data The binary data representing the header.
     */
    static readHeader(data) {
        let size = 0;
        let m = 1;
        let i = 1;
        let byte = 0;
        do {
            if (data.length < i + 1) {
                throw new Error("Header couldn't be parsed.");
            }
            byte = data[i];
            size += (byte & 0x7f) * m;
            m <<= 7;
            i++;
        } while ((byte & 0x80) !== 0);
        return { size, i };
    }
}
exports.default = MqttConnection;
//# sourceMappingURL=MqttConnection.js.map