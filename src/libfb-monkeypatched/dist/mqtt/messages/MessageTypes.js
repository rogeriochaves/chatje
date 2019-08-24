"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Connect"] = 1] = "Connect";
    MessageType[MessageType["ConnectAck"] = 2] = "ConnectAck";
    MessageType[MessageType["Publish"] = 3] = "Publish";
    MessageType[MessageType["PublishAck"] = 4] = "PublishAck";
    MessageType[MessageType["PublishRecorded"] = 5] = "PublishRecorded";
    MessageType[MessageType["PublishReleased"] = 6] = "PublishReleased";
    MessageType[MessageType["PubComp"] = 7] = "PubComp";
    MessageType[MessageType["Subscribe"] = 8] = "Subscribe";
    MessageType[MessageType["SubscribeAck"] = 9] = "SubscribeAck";
    MessageType[MessageType["Unsubscribe"] = 10] = "Unsubscribe";
    MessageType[MessageType["UnsubscribeAck"] = 11] = "UnsubscribeAck";
    MessageType[MessageType["Ping"] = 12] = "Ping";
    MessageType[MessageType["Pong"] = 13] = "Pong";
    MessageType[MessageType["Disconnect"] = 14] = "Disconnect";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
//# sourceMappingURL=MessageTypes.js.map