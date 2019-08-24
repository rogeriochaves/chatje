/// <reference types="node" />
import { MessageType } from './messages/MessageTypes';
/**
 * Represents an outgoing message. This class allows to buffer different kinds of binary data so that messages can be assembled.
 */
export default class MqttMessage {
    toSend: Buffer;
    type: MessageType;
    flags: number;
    constructor(type?: MessageType);
    setFlags(flags: number): this;
    writeU16(data: number): this;
    writeU32(data: number): this;
    writeU8(data: number): this;
    writeString(strToAdd: string): this;
    writeRawString(strToAdd: string): this;
    writeRaw(raw: Buffer): this;
}
