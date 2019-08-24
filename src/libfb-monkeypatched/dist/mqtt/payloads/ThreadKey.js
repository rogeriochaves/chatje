"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Payload_1 = tslib_1.__importDefault(require("./Payload"));
const thrift_1 = require("thrift");
class ThreadKeyPayload extends Payload_1.default {
    constructor(threadId, threadType) {
        super();
        this.threadId = threadId.toString();
        this.threadType = threadType;
    }
    encode(proto) {
        proto.writeFieldBegin('threadId', thrift_1.Thrift.Type.STRING, 1);
        proto.writeString(this.threadId);
        proto.writeFieldBegin('threadType', thrift_1.Thrift.Type.I32, 2);
        proto.writeI64(this.threadType);
        // denotes end of object
        proto.writeByte(0);
        return null;
    }
    getTopic() {
        return null;
    }
}
exports.default = ThreadKeyPayload;
//# sourceMappingURL=ThreadKey.js.map