"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Attachment_1 = require("../Attachment");
function parseDeltaMessage(delta) {
    const { fileAttachments, mediaAttachments } = Attachment_1.parseAttachments(delta.attachments || []);
    return {
        threadId: getThreadId(delta),
        fileAttachments,
        mediaAttachments,
        authorId: delta.messageMetadata.actorFbId,
        id: delta.messageMetadata.messageId,
        timestamp: delta.messageMetadata.timestamp,
        message: delta.body || '',
        stickerId: delta.stickerId,
        mentions: (delta.data && delta.data.prng) ? parseMentions(delta.data.prng) : []
    };
}
exports.default = parseDeltaMessage;
function parseMentions(prng) {
    return JSON.parse(prng).map(mention => ({
        offset: mention.o,
        length: mention.l,
        id: mention.i
    }));
}
function getThreadId(delta) {
    const { threadKey } = delta.messageMetadata || delta;
    return (threadKey.threadFbId || threadKey.otherUserFbId).toString();
}
exports.getThreadId = getThreadId;
//# sourceMappingURL=parseDeltaMessage.js.map