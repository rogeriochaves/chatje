"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Payload_1 = tslib_1.__importDefault(require("./Payload"));
const thrift_1 = require("thrift");
const long_1 = tslib_1.__importDefault(require("long"));
class PresenceStatePayload extends Payload_1.default {
    constructor(recipientId, state) {
        super();
        this.recipient = recipientId.toString();
        this.sender = 0;
        this.state = state;
    }
    encode(proto) {
        /////////////////////
        // Tracking info
        /////////////////////
        proto.writeFieldBegin('traceInfo', thrift_1.Thrift.Type.STRING, 1);
        proto.writeString(''); // Empty string in our case
        // Note lack of end-of-object null
        /////////////////////
        // Typing presence
        /////////////////////
        proto.writeFieldBegin('recipient', thrift_1.Thrift.Type.I64, 1);
        proto.writeI64(new thrift_1.Int64(Buffer.from(long_1.default.fromString(this.recipient).toBytes())));
        // sender always 0
        proto.writeFieldBegin('sender', thrift_1.Thrift.Type.I64, 2);
        proto.writeI64(this.sender);
        proto.writeFieldBegin('state', thrift_1.Thrift.Type.I32, 3);
        proto.writeI32(this.state ? 1 : 0);
        // denotes end of object
        proto.writeByte(0);
        return null;
    }
    getTopic() {
        return '/t_stp';
    }
}
exports.default = PresenceStatePayload;
//# sourceMappingURL=PresenceStatePayload.js.map