/// <reference types="node" />
import { TCompactProtocol } from 'thrift';
export default abstract class Payload {
    /**
     * Write this payload into the specified stream
     */
    encode(proto: TCompactProtocol): Promise<void>;
    /**
     * Decodes thrift buffer into this payload
     */
    decode(data: Buffer): Promise<void>;
    /**
     * Get topic this payload should published to
     * Only single-level topics have been observed,
     * but mqtt works with multiple, possibly dynamically
     * generated topics.
     */
    getTopic(): string;
    /**
     * Static convenience method for writing a payload to a
     * buffered transport and returning it as a buffer
     */
    static encodePayload(payload: Payload): Promise<Buffer>;
}
