"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MqttMessage_1 = tslib_1.__importDefault(require("../MqttMessage"));
const MqttTypes_1 = require("../MqttTypes");
const MessageTypes_1 = require("./MessageTypes");
/**
 * Assembles a subscribe message sent just after mqtt connection that subscribes to given topics.
 */
exports.encodeUnsubscribe = (msgId) => {
    return new MqttMessage_1.default(MessageTypes_1.MessageType.Unsubscribe)
        .setFlags(MqttTypes_1.MqttMessageFlag.Dup)
        .writeU16(msgId)
        .writeString('/orca_message_notifications');
};
//# sourceMappingURL=Unsubscribe.js.map