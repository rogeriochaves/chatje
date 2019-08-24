"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseFileAttachment(attachment) {
    const attach = {
        type: 'FileAttachment',
        id: attachment.id,
        mimeType: attachment.mimeType,
        filename: attachment.filename,
        size: attachment.fileSize
    };
    if (['image/jpeg', 'image/png', 'image/gif'].includes(attachment.mimeType)) {
        return Object.assign({}, attach, { type: 'ImageAttachment', url: attachment.imageMetadata.rawImageURI, metadata: attachment.imageMetadata });
    }
    if (attachment.mimeType === 'video/mp4') {
        return Object.assign({}, attach, { type: 'VideoAttachment', url: attachment.videoMetadata.videoUri, metadata: attachment.videoMetadata });
    }
    if (['audio/mpeg', 'audio/aac'].includes(attachment.mimeType)) {
        return Object.assign({}, attach, { type: 'AudioAttachment', metadata: attachment.audioMetadata });
    }
    return attach;
}
exports.default = parseFileAttachment;
//# sourceMappingURL=parseFileAttachment.js.map