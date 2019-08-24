/// <reference types="node" />
import { EventEmitter } from 'events';
import { TLSSocket } from 'tls';
import MqttMessage from './MqttMessage';
import { MqttHeader } from './MqttPacket';
/**
 * Represents an encrypted real-time connection with facebook servers.
 * This class encapsulates all logic which handles communication using the propietary MQTT-like protocol.
 */
export default class MqttConnection extends EventEmitter {
    toSend: Buffer;
    socket: TLSSocket | null;
    lastHeader: MqttHeader | null;
    decodeBuffer: Buffer;
    connectMsg: any;
    _connected: boolean;
    queue: MqttMessage[];
    lastConnectTimestamp: Date;
    constructor();
    /**
     * Connects to Facebook mqtt servers. The promise is resolved when a secure TLS handshake is established. No CONNECT message is sent yet.
     */
    connect(): Promise<void>;
    readBuffer(data: Buffer): void;
    emitPacket(): void;
    writeMessage(message: MqttMessage): Promise<number | void>;
    /**
     * Parses a MQTT header.
     * @param data The binary data representing the header.
     */
    static readHeader(data: Buffer): MqttHeader;
}
