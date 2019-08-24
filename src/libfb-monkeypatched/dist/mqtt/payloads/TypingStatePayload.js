"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Payload_1 = tslib_1.__importDefault(require("./Payload"));
const ThreadKey_1 = tslib_1.__importDefault(require("./ThreadKey"));
const thrift_1 = require("thrift");
const long_1 = tslib_1.__importDefault(require("long"));
class TypingStatePayload extends Payload_1.default {
    constructor(senderUserId, state, recipientUserOrThreadId) {
        super();
        this.sender = senderUserId.toString();
        this.state = state;
        if (recipientUserOrThreadId.toString().startsWith('100')) {
            this.recipient = recipientUserOrThreadId.toString();
        }
        else {
            this.threadKey = new ThreadKey_1.default(recipientUserOrThreadId.toString(), 1);
        }
    }
    encode(proto) {
        // Added explicitly outside of thrift code
        proto.writeByte(0);
        if (this.recipient != null) {
            proto.writeFieldBegin('recipient', thrift_1.Thrift.Type.I64, 1);
            proto.writeI64(new thrift_1.Int64(Buffer.from(long_1.default.fromString(this.recipient).toBytes())));
        }
        proto.writeFieldBegin('sender', thrift_1.Thrift.Type.I64, 2);
        proto.writeI64(new thrift_1.Int64(Buffer.from(long_1.default.fromString(this.sender).toBytes())));
        proto.writeFieldBegin('state', thrift_1.Thrift.Type.I32, 3);
        proto.writeI32(this.state ? 1 : 0);
        if (this.threadKey != null) {
            proto.writeFieldBegin('threadKey', thrift_1.Thrift.Type.STRUCT, 5);
            proto.writeStructBegin('threadKey');
            this.threadKey.encode(proto);
            proto.writeStructEnd();
            proto.writeFieldEnd();
        }
        // denotes end of object
        proto.writeByte(0);
        return null;
    }
    getTopic() {
        return '/t_st';
    }
}
exports.default = TypingStatePayload;
//# sourceMappingURL=TypingStatePayload.js.map