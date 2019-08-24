/// <reference types="node" />
import { EventEmitter } from 'events';
import AuthTokens from '../types/AuthTokens';
import DeviceId from '../types/DeviceId';
import { PublishPacket } from './messages/Publish';
import MqttConnection from './MqttConnection';
import MqttMessage from './MqttMessage';
import MqttPacket from './MqttPacket';
import { MessageOptions } from '..';
/**
 * Handles decoding and sending all sorts of messages used by Facebook Messenger.
 * It utilizes all network primitives defined in the MqttConnection class.
 */
export default class MqttApi extends EventEmitter {
    connection: MqttConnection;
    lastMsgId: number;
    tokens: AuthTokens;
    lastPingMilis: number;
    deviceId: DeviceId;
    constructor();
    sendSubscribe(msg: MqttMessage): Promise<number | void>;
    /**
     * Connects the MQTT socket and binds listeners for receiving messages.
     * @param tokens
     * @param deviceId
     */
    connect(tokens: AuthTokens, deviceId: DeviceId): Promise<void>;
    reconnect(): Promise<void>;
    sendPing: () => Promise<number | void>;
    /**
     * Sends a CONNECT mqtt message
     */
    sendConnectMessage(): Promise<void>;
    sendPublish(topic: string, data: Buffer | string): Promise<void>;
    waitForAck(type: string): Promise<unknown>;
    /**
     * Sends a facebook messenger message to someone.
     */
    sendMessage(threadId: string, message: string, options?: MessageOptions): Promise<{
        succeeded: boolean;
        errStr?: string;
    }>;
    sendPublishConfirmation(flags: number, publish: PublishPacket): Promise<number | void>;
    parsePacket(packet: MqttPacket): Promise<void>;
}
