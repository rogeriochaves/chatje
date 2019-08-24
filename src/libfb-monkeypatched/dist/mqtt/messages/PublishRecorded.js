"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MqttMessage_1 = tslib_1.__importDefault(require("../MqttMessage"));
const MqttTypes_1 = require("../MqttTypes");
const MessageTypes_1 = require("./MessageTypes");
/**
 * Assembles a subscribe message sent just after mqtt connection that subscribes to given topics.
 */
exports.encodePublishRecorded = (msgId) => {
    return new MqttMessage_1.default(MessageTypes_1.MessageType.PublishRecorded)
        .setFlags(MqttTypes_1.MqttMessageFlag.QoS0)
        .writeU16(msgId);
};
//# sourceMappingURL=PublishRecorded.js.map