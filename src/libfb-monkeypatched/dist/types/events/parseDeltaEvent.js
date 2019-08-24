"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parseAdminMessage_1 = tslib_1.__importDefault(require("./parseAdminMessage"));
const Message_1 = require("../Message");
function parseDeltaEvent(event) {
    if (event.deltaAdminTextMessage)
        return parseAdminMessage_1.default(event.deltaAdminTextMessage);
    if (event.deltaReplaceMessage) {
        const delta = event.deltaReplaceMessage;
        if (delta.newMessage.messageMetadata.unsendType) {
            return {
                type: 'messageRemoveEvent',
                event: getEventMetadata(delta.newMessage)
            };
        }
    }
    if (event.deltaThreadName) {
        const delta = event.deltaThreadName;
        return {
            type: 'threadNameEvent',
            event: Object.assign({}, getEventMetadata(delta), { name: delta.name })
        };
    }
    if (event.deltaDeliveryReceipt) {
        const delta = event.deltaDeliveryReceipt;
        return {
            type: 'deliveryReceiptEvent',
            event: {
                threadId: Message_1.getThreadId(delta),
                receiverId: delta.actorFbId ? delta.actorFbId.toString() : Message_1.getThreadId(delta)
            }
        };
    }
    if (event.deltaReadReceipt) {
        const delta = event.deltaReadReceipt;
        return {
            type: 'readReceiptEvent',
            event: {
                threadId: Message_1.getThreadId(delta),
                receiverId: delta.actorFbId ? delta.actorFbId.toString() : Message_1.getThreadId(delta)
            }
        };
    }
    if (event.deltaParticipantsAddedToGroupThread) {
        const delta = event.deltaParticipantsAddedToGroupThread;
        return {
            type: 'participantsAddedToGroupThreadEvent',
            event: Object.assign({}, getEventMetadata(delta), { participantIds: delta.addedParticipants.map(user => user.userFbId) })
        };
    }
    if (event.deltaParticipantLeftGroupThread) {
        const delta = event.deltaParticipantLeftGroupThread;
        return {
            type: 'participantLeftGroupThreadEvent',
            event: Object.assign({}, getEventMetadata(delta), { participantId: delta.leftParticipantFbId })
        };
    }
}
exports.default = parseDeltaEvent;
function getEventMetadata(delta) {
    return {
        id: delta.messageMetadata.messageId,
        threadId: Message_1.getThreadId(delta),
        authorId: delta.messageMetadata.actorFbId.toString(),
        message: delta.messageMetadata.adminText
    };
}
exports.getEventMetadata = getEventMetadata;
//# sourceMappingURL=parseDeltaEvent.js.map