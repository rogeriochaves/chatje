"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const zlib_1 = tslib_1.__importDefault(require("zlib"));
const MqttMessage_1 = tslib_1.__importDefault(require("../MqttMessage"));
const MqttTypes_1 = require("../MqttTypes");
const PacketReader_1 = tslib_1.__importDefault(require("../PacketReader"));
const MessageTypes_1 = require("./MessageTypes");
/**
 * Assembles a mqtt publish message.
 */
exports.encodePublish = (packet) => {
    return new MqttMessage_1.default(MessageTypes_1.MessageType.Publish)
        .setFlags(MqttTypes_1.MqttMessageFlag.QoS1)
        .writeString(packet.topic)
        .writeU16(packet.msgId)
        .writeRaw(zlib_1.default.deflateSync(packet.data));
};
exports.decodePublish = (mqttPacket) => {
    const reader = new PacketReader_1.default(mqttPacket);
    const result = {};
    result.topic = reader.readData().toString('utf8');
    result.msgId = 0;
    if (mqttPacket.flag & MqttTypes_1.MqttMessageFlag.QoS1 ||
        mqttPacket.flag & MqttTypes_1.MqttMessageFlag.QoS2) {
        result.msgId = reader.readU16();
    }
    result.data = zlib_1.default.inflateSync(reader.readRaw());
    return result;
};
//# sourceMappingURL=Publish.js.map