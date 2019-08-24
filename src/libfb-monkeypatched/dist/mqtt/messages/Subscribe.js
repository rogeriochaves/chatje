"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MqttMessage_1 = tslib_1.__importDefault(require("../MqttMessage"));
const MqttTypes_1 = require("../MqttTypes");
const MessageTypes_1 = require("./MessageTypes");
/**
 * Assembles a subscribe message sent just after mqtt connection that subscribes to given topics.
 */
exports.encodeSubscribeMessage = (msgId) => {
    const topics = [
        '/inbox',
        '/messaging_events',
        '/t_ms',
        '/t_rtc',
        '/webrtc',
        '/webrtc_response'
    ];
    const message = new MqttMessage_1.default(MessageTypes_1.MessageType.Subscribe)
        .setFlags(MqttTypes_1.MqttMessageFlag.Dup)
        .writeU16(msgId);
    for (const topic of topics) {
        message
            .writeString(topic)
            .writeU8(0);
    }
    return message;
};
//# sourceMappingURL=Subscribe.js.map