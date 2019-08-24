"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MqttMessage_1 = tslib_1.__importDefault(require("../MqttMessage"));
const MessageTypes_1 = require("./MessageTypes");
const MqttTypes_1 = require("../MqttTypes");
/**
 * Assembles a ping message.
 */
exports.encodePing = () => {
    return new MqttMessage_1.default(MessageTypes_1.MessageType.Ping)
        .setFlags(MqttTypes_1.MqttMessageFlag.QoS0);
};
//# sourceMappingURL=Ping.js.map