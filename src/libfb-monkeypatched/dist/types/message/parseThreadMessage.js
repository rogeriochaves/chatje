"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parseXMAAttachment_1 = tslib_1.__importDefault(require("../attachments/parseXMAAttachment"));
const parseBlobAttachment_1 = tslib_1.__importDefault(require("../attachments/parseBlobAttachment"));
function parseThreadMessage(threadId, message) {
    const { fileAttachments, mediaAttachments } = parseAttachments(message);
    return {
        id: message.message_id,
        timestamp: Number(message.timestamp_precise),
        authorId: message.message_sender ? message.message_sender.messaging_actor.id : '',
        threadId,
        message: message.message ? message.message.text : '',
        fileAttachments,
        mediaAttachments,
        stickerId: message.sticker
    };
}
exports.default = parseThreadMessage;
function parseAttachments(message) {
    const fileAttachments = message.blob_attachments ? message.blob_attachments.map(parseBlobAttachment_1.default) : [];
    // const attachments = message.blob_attachments ? message.blob_attachments : []
    const xma = message.extensible_attachment;
    const mediaAttachments = [];
    if (xma)
        mediaAttachments.push(parseXMAAttachment_1.default({ [xma.id]: xma }));
    return { fileAttachments, mediaAttachments };
}
//# sourceMappingURL=parseThreadMessage.js.map