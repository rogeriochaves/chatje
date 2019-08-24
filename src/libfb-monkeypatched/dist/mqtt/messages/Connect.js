"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const zlib = tslib_1.__importStar(require("zlib"));
const MqttMessage_1 = tslib_1.__importDefault(require("../MqttMessage"));
const MqttTypes_1 = require("../MqttTypes");
const Payloads = tslib_1.__importStar(require("../payloads"));
const MessageTypes_1 = require("./MessageTypes");
const USER_AGENT = '[FBAN/Orca-Android;FBAV/220.0.0.20.121;]';
/**
 * Assembles a connect messages sent just after a TLS connection is established.
 */
exports.encodeConnectMessage = (tokens, deviceId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const payload = new Payloads.Connect(deviceId, tokens, USER_AGENT);
    const flags = MqttTypes_1.MqttConnectFlag.User |
        MqttTypes_1.MqttConnectFlag.Pass |
        MqttTypes_1.MqttConnectFlag.Clr |
        MqttTypes_1.MqttConnectFlag.QoS1;
    return new MqttMessage_1.default(MessageTypes_1.MessageType.Connect)
        .setFlags(MqttTypes_1.MqttConnectFlag.QoS0)
        .writeString('MQTToT')
        .writeU8(3)
        .writeU8(flags)
        .writeU16(60) // KEEP ALIVE
        .writeRaw(zlib.deflateSync(yield Payloads.encodePayload(payload)));
});
//# sourceMappingURL=Connect.js.map