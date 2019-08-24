"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Payload_1 = tslib_1.__importDefault(require("./Payload"));
const thrift_1 = require("thrift");
const FacebookCapFlags_1 = tslib_1.__importDefault(require("../../types/FacebookCapFlags"));
const long_1 = tslib_1.__importDefault(require("long"));
class ConnectRequest extends Payload_1.default {
    constructor(deviceId, tokens, userAgent) {
        super();
        this.deviceId = deviceId;
        this.tokens = tokens;
        this.userAgent = userAgent;
    }
    encode(proto) {
        proto.writeFieldBegin('clientIdentifier', thrift_1.Thrift.Type.STRING, 1);
        proto.writeString(this.deviceId.clientId);
        proto.writeFieldBegin('clientInfo', thrift_1.Thrift.Type.STRUCT, 4);
        proto.writeStructBegin('clientInfo');
        // Write user id
        proto.writeFieldBegin('userId', thrift_1.Thrift.Type.I64, 1);
        proto.writeI64(new thrift_1.Int64(Buffer.from(long_1.default.fromString(this.tokens.uid.toString()).toBytes())));
        // Write information
        proto.writeFieldBegin('userAgent', thrift_1.Thrift.Type.STRING, 2);
        proto.writeString(this.userAgent);
        // Write some random int (?)
        proto.writeFieldBegin('clientCapabilities', thrift_1.Thrift.Type.I64, 3);
        proto.writeI64(FacebookCapFlags_1.default.FB_CP_ACKNOWLEDGED_DELIVERY |
            FacebookCapFlags_1.default.FB_CP_PROCESSING_LASTACTIVE_PRESENCEINFO |
            FacebookCapFlags_1.default.FB_CP_EXACT_KEEPALIVE |
            FacebookCapFlags_1.default.FB_CP_LARGE_PAYLOAD_SUPPORTED |
            FacebookCapFlags_1.default.FB_CP_DELTA_SENT_MESSAGE_ENABLED);
        proto.writeFieldBegin('endpointCapabilities', thrift_1.Thrift.Type.I64, 4);
        proto.writeI64(26); // 0011010 libfb default
        // proto.writeI64(90)       // 1011010 used by app
        // 1: ZLIB
        // 2: ZLIB_OPTIONAL
        // 3: RAW
        proto.writeFieldBegin('publishFormat', thrift_1.Thrift.Type.I32, 5);
        proto.writeI32(1);
        // Write no_auto_fg boolean
        proto.writeFieldBegin('noAutomaticForeground', thrift_1.Thrift.Type.BOOL, 6);
        proto.writeBool(false);
        // Write visibility state
        proto.writeFieldBegin('makeUserAvailableInForeground', thrift_1.Thrift.Type.BOOL, 7);
        proto.writeBool(true);
        // Write device id
        proto.writeFieldBegin('deviceId', thrift_1.Thrift.Type.STRING, 8);
        proto.writeString(this.deviceId.deviceId);
        // Write fg boolean
        proto.writeFieldBegin('isInitiallyForeground', thrift_1.Thrift.Type.BOOL, 9);
        proto.writeBool(true);
        // nwt int
        proto.writeFieldBegin('networkType', thrift_1.Thrift.Type.I32, 10);
        proto.writeI32(1);
        // nwst int
        proto.writeFieldBegin('networkSubtype', thrift_1.Thrift.Type.I32, 11);
        proto.writeI32(0);
        // write mqtt id
        proto.writeFieldBegin('clientMqttSessionId', thrift_1.Thrift.Type.I64, 12);
        proto.writeI64(this.deviceId.mqttId);
        // Topics subscribed to by the app.
        // libfb sends a separate subscribe message later, so this is effectively unused.
        // const topics = [155, 107, 150, 140, 174, 34, 59, 195, 92, 131, 75, 103, 90, 62, 98, 72, 85, 100, 86, 65, 63];
        const topics = [];
        proto.writeFieldBegin('subscribeTopics', thrift_1.Thrift.Type.LIST, 14);
        proto.writeListBegin(thrift_1.Thrift.Type.I32, topics.length);
        {
            for (const topic of topics) {
                proto.writeI32(topic);
            }
        }
        // Meaning of value not known
        proto.writeFieldBegin('clientType', thrift_1.Thrift.Type.STRING, 15);
        proto.writeString('');
        // Meaning of value not known
        // proto.writeFieldBegin('regionPreference', Thrift.Type.STRING, 19)
        // proto.writeString('ATN')
        // Meaning of value not known
        proto.writeFieldBegin('deviceSecret', thrift_1.Thrift.Type.STRING, 20);
        proto.writeString('');
        // Meaning of value not known
        // proto.writeFieldBegin('clientStack', Thrift.Type.BYTE, 21)
        // proto.writeByte(4)
        // Meaning of value not known
        // proto.writeFieldBegin('networkTypeInfo', Thrift.Type.I32, 27)
        // proto.writeI32(7)
        // End of object
        proto.writeByte(0);
        proto.writeStructEnd();
        proto.writeFieldBegin('password', thrift_1.Thrift.Type.STRING, 5);
        proto.writeString(this.tokens.access_token);
        proto.writeFieldBegin('combinedPublishes', thrift_1.Thrift.Type.LIST, 8);
        proto.writeListBegin(thrift_1.Thrift.Type.STRUCT, 0);
        proto.writeFieldBegin('phpOverride', thrift_1.Thrift.Type.STRUCT, 11);
        proto.writeStructBegin('phpOverride');
        proto.writeFieldBegin('port', thrift_1.Thrift.Type.I32, 2);
        proto.writeI32(0);
        // End of object
        proto.writeByte(0);
        proto.writeStructEnd();
        proto.writeByte(0);
        return null;
    }
}
exports.default = ConnectRequest;
//# sourceMappingURL=ConnectPayload.js.map