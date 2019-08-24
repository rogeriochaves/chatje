"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_1 = require("thrift");
class Payload {
    /**
     * Write this payload into the specified stream
     */
    encode(proto) {
        return null;
    }
    /**
     * Decodes thrift buffer into this payload
     */
    decode(data) {
        return null;
    }
    /**
     * Get topic this payload should published to
     * Only single-level topics have been observed,
     * but mqtt works with multiple, possibly dynamically
     * generated topics.
     */
    getTopic() {
        // Maybe thrown?
        return null;
    }
    /**
     * Static convenience method for writing a payload to a
     * buffered transport and returning it as a buffer
     */
    static encodePayload(payload) {
        return new Promise((resolve, reject) => {
            const trans = new thrift_1.TBufferedTransport(null, (msg, seqid) => {
                resolve(msg);
            });
            const proto = new thrift_1.TCompactProtocol(trans);
            payload.encode(proto);
            proto.flush();
        });
    }
}
exports.default = Payload;
//# sourceMappingURL=Payload.js.map