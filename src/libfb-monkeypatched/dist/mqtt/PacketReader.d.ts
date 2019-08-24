/// <reference types="node" />
import MqttPacket from './MqttPacket';
export default class PacketReader {
    packet: MqttPacket;
    pos: number;
    constructor(packet: MqttPacket);
    readU8(): number;
    readU16(): number;
    readData(): Buffer;
    readRaw(): Buffer;
}
