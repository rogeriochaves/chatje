/// <reference types="node" />
import MqttMessage from '../MqttMessage';
import MqttPacket from '../MqttPacket';
export interface PublishPacket {
    msgId: number;
    topic: string;
    data: Buffer;
}
/**
 * Assembles a mqtt publish message.
 */
export declare const encodePublish: (packet: PublishPacket) => MqttMessage;
export declare const decodePublish: (mqttPacket: MqttPacket) => PublishPacket;
