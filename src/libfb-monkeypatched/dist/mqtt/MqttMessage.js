"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an outgoing message. This class allows to buffer different kinds of binary data so that messages can be assembled.
 */
class MqttMessage {
    constructor(type) {
        this.toSend = Buffer.alloc(0);
        if (type)
            this.type = type;
    }
    setFlags(flags) {
        this.flags = flags;
        return this;
    }
    writeU16(data) {
        const newBuf = Buffer.alloc(2);
        newBuf.writeUInt16BE(data, 0);
        this.toSend = Buffer.concat([this.toSend, newBuf]);
        return this;
    }
    writeU32(data) {
        const newBuf = Buffer.alloc(4);
        newBuf.writeUInt32BE(data, 0);
        this.toSend = Buffer.concat([this.toSend, newBuf]);
        return this;
    }
    writeU8(data) {
        const newBuf = Buffer.alloc(1);
        newBuf.writeUInt8(data, 0);
        this.toSend = Buffer.concat([this.toSend, newBuf]);
        return this;
    }
    writeString(strToAdd) {
        this.writeU16(strToAdd.length);
        const newBuf = Buffer.from(strToAdd, 'utf8');
        this.toSend = Buffer.concat([this.toSend, newBuf]);
        return this;
    }
    writeRawString(strToAdd) {
        const newBuf = Buffer.from(strToAdd, 'utf8');
        this.toSend = Buffer.concat([this.toSend, newBuf]);
        return this;
    }
    writeRaw(raw) {
        this.toSend = Buffer.concat([this.toSend, raw]);
        return this;
    }
}
exports.default = MqttMessage;
//# sourceMappingURL=MqttMessage.js.map