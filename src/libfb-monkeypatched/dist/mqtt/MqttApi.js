"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const buffer_hexdump_1 = tslib_1.__importDefault(require("buffer-hexdump"));
const events_1 = require("events");
const MessageTypes_1 = require("./messages/MessageTypes");
const Connect_1 = require("./messages/Connect");
const Ping_1 = require("./messages/Ping");
const Publish_1 = require("./messages/Publish");
const PublishAck_1 = require("./messages/PublishAck");
const PublishRecorded_1 = require("./messages/PublishRecorded");
const Subscribe_1 = require("./messages/Subscribe");
const Unsubscribe_1 = require("./messages/Unsubscribe");
const MqttConnection_1 = tslib_1.__importDefault(require("./MqttConnection"));
const MqttTypes_1 = require("./MqttTypes");
const debug_1 = tslib_1.__importDefault(require("debug"));
const RandomIntGenerator_1 = tslib_1.__importDefault(require("../RandomIntGenerator"));
const debugLog = debug_1.default('fblib');
/**
 * Handles decoding and sending all sorts of messages used by Facebook Messenger.
 * It utilizes all network primitives defined in the MqttConnection class.
 */
class MqttApi extends events_1.EventEmitter {
    constructor() {
        super();
        this.lastMsgId = 1;
        this.lastPingMilis = -1;
        this.sendPing = () => {
            if (this.lastPingMilis < 0 || (this.lastPingMilis) < (60 * 1000) + new Date().getTime()) {
                return this.connection.writeMessage(Ping_1.encodePing());
            }
            else {
                // Attempt to reconnect
                return this.reconnect();
            }
        };
        this.connection = new MqttConnection_1.default();
    }
    sendSubscribe(msg) {
        this.lastMsgId = this.lastMsgId + 1;
        return this.connection.writeMessage(msg);
    }
    /**
     * Connects the MQTT socket and binds listeners for receiving messages.
     * @param tokens
     * @param deviceId
     */
    connect(tokens, deviceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.tokens = tokens;
            this.deviceId = deviceId;
            yield this.connection.connect();
            this.connection.on('packet', packet => this.parsePacket(packet));
            yield this.sendConnectMessage();
            this.connection.on('close', () => this.reconnect());
        });
    }
    reconnect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debugLog('reconnecting...');
            yield this.connection.connect();
            yield this.sendConnectMessage();
            this.connection.emit('reconnect');
        });
    }
    /**
     * Sends a CONNECT mqtt message
     */
    sendConnectMessage() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            setInterval(this.sendPing, 60 * 1000);
            debugLog('sending connect message');
            if (!this.connection._connected)
                throw new Error('MQTT could not connect');
            const connectMessage = yield Connect_1.encodeConnectMessage(this.tokens, this.deviceId);
            yield this.connection.writeMessage(connectMessage);
            yield this.waitForAck('Connect');
            yield this.sendPublish('/foreground_state', '{"foreground":true,"keepalive_timeout":60}');
            yield this.sendSubscribe(Subscribe_1.encodeSubscribeMessage(this.lastMsgId));
            yield this.waitForAck('Subscribe');
            yield this.sendSubscribe(Unsubscribe_1.encodeUnsubscribe(this.lastMsgId));
            yield this.waitForAck('Unsubscribe');
            debugLog('Connected.');
            this.emit('connected');
        });
    }
    sendPublish(topic, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let dataBuffer;
            if (data instanceof Buffer) {
                dataBuffer = data;
            }
            else {
                dataBuffer = Buffer.from(data);
            }
            const packet = Publish_1.encodePublish({
                msgId: this.lastMsgId,
                topic,
                data: dataBuffer
            });
            this.lastMsgId += 1;
            yield this.connection.writeMessage(packet);
            yield this.waitForAck('Publish');
        });
    }
    waitForAck(type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function onFailed() { reject(new Error('MQTT connection failed')); }
                this.connection.once('failed', onFailed);
                this.once(type + 'Ack', () => {
                    this.connection.removeListener('failed', onFailed);
                    resolve();
                });
            });
        });
    }
    /**
     * Sends a facebook messenger message to someone.
     */
    sendMessage(threadId, message, options) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const milliseconds = Math.floor(new Date().getTime() / 1000);
            const rand = RandomIntGenerator_1.default.generate();
            const msgid = Math.abs((rand & 0x3fffff) | (milliseconds << 22));
            const msg = {
                body: message,
                msgid,
                sender_fbid: this.tokens.uid,
                to: (threadId.startsWith('100') || threadId.length < 16) ? threadId : `tfbid_${threadId}`
            };
            if (options && options.mentions && options.mentions.length) {
                msg.generic_metadata = {
                    prng: JSON.stringify(options.mentions.map(mention => ({
                        o: mention.offset,
                        l: mention.length,
                        i: mention.id,
                        t: 'p'
                    })))
                };
            }
            this.once('sentMessage:' + msgid.toString(), resolve);
            yield this.sendPublish('/send_message2', JSON.stringify(msg));
        }));
    }
    sendPublishConfirmation(flags, publish) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (publish.msgId === 0)
                return;
            const qos1 = (flags & MqttTypes_1.MqttMessageFlag.QoS1) === MqttTypes_1.MqttMessageFlag.QoS1;
            const qos2 = (flags & MqttTypes_1.MqttMessageFlag.QoS2) === MqttTypes_1.MqttMessageFlag.QoS2;
            let message;
            if (qos1) {
                message = PublishAck_1.encodePublishAck(publish.msgId);
            }
            if (qos2) {
                message = PublishRecorded_1.encodePublishRecorded(publish.msgId);
            }
            return this.connection.writeMessage(message);
        });
    }
    parsePacket(packet) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (packet.type) {
                case MessageTypes_1.MessageType.ConnectAck:
                    debugLog('Packet type: ConnectAck');
                    this.emit('ConnectAck');
                    break;
                case MessageTypes_1.MessageType.Publish:
                    debugLog('Packet type: Publish');
                    const publish = Publish_1.decodePublish(packet);
                    this.emit('publish', publish);
                    yield this.sendPublishConfirmation(packet.flag, publish);
                    break;
                case MessageTypes_1.MessageType.SubscribeAck:
                    debugLog('Packet type: SubscribeAck');
                    this.emit('SubscribeAck');
                    break;
                case MessageTypes_1.MessageType.PublishAck:
                    debugLog('Packet type: PublishAck');
                    this.emit('PublishAck');
                    break;
                case MessageTypes_1.MessageType.UnsubscribeAck:
                    debugLog('Packet type: UnsubscribeAck');
                    this.emit('UnsubscribeAck');
                    break;
                case MessageTypes_1.MessageType.Pong:
                    debugLog('Packet type: Pong');
                    this.lastPingMilis = new Date().getTime();
                    break;
                default:
                    debugLog('Packet type:', packet.type);
                    debugLog(buffer_hexdump_1.default(packet.content));
            }
        });
    }
}
exports.default = MqttApi;
//# sourceMappingURL=MqttApi.js.map