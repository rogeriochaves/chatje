"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Payload_1 = tslib_1.__importDefault(require("./Payload"));
const thrift_1 = require("thrift");
const RandomIntGenerator_1 = tslib_1.__importDefault(require("../../RandomIntGenerator"));
const long_1 = tslib_1.__importDefault(require("long"));
class ReadReceiptPayload extends Payload_1.default {
    constructor(message) {
        super();
        if (message.authorId.toString() === message.threadId.toString()) {
            // If author id equals thread id, then this is not a group convo
            this.otherUserFbId = message.authorId.toString();
        }
        else {
            // Otherwise it is
            this.threadFbId = message.threadId.toString();
        }
        this.watermarkTimestamp = message.timestamp;
    }
    encode(proto) {
        /////////////////////
        // thrift header?
        /////////////////////
        // Always completely empty.
        proto.writeByte(0);
        // Note lack of end-of-object null
        /////////////////////
        // Typing presence
        /////////////////////
        proto.writeFieldBegin('mark', thrift_1.Thrift.Type.STRING, 1);
        proto.writeString('read');
        proto.writeFieldBegin('state', thrift_1.Thrift.Type.BOOL, 2);
        proto.writeBool(true);
        if (this.threadFbId != null) {
            proto.writeFieldBegin('threadFbId', thrift_1.Thrift.Type.I64, 6);
            proto.writeI64(new thrift_1.Int64(Buffer.from(long_1.default.fromString(this.threadFbId).toBytes())));
        }
        else if (this.otherUserFbId != null) {
            proto.writeFieldBegin('otherUserFbId', thrift_1.Thrift.Type.I64, 7);
            proto.writeI64(new thrift_1.Int64(Buffer.from(long_1.default.fromString(this.otherUserFbId).toBytes())));
        }
        else {
            // Throw?
        }
        proto.writeFieldBegin('watermarkTimestamp', thrift_1.Thrift.Type.I64, 9);
        proto.writeI64(this.watermarkTimestamp);
        proto.writeFieldBegin('attemptId', thrift_1.Thrift.Type.I64, 13);
        proto.writeI64(new thrift_1.Int64(Buffer.from(RandomIntGenerator_1.default.getAttemptId().toBytes())));
        // denotes end of object
        proto.writeByte(0);
        return null;
    }
    getTopic() {
        return '/t_mt_req';
    }
}
exports.default = ReadReceiptPayload;
//# sourceMappingURL=ReadReceiptPayload.js.map