"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseBlobAttachment(attachment) {
    const type = attachment.__type__.name;
    const metadata = {
        id: attachment.attachment_fbid,
        mimeType: attachment.mimetype,
        filename: attachment.filename,
        size: attachment.filesize
    };
    const dimensions = () => ({
        width: attachment.original_dimensions.x,
        height: attachment.original_dimensions.y
    });
    if (type === 'MessageVideo') {
        return Object.assign({ type: 'VideoAttachment' }, metadata, { url: attachment.video_url, metadata: Object.assign({}, dimensions(), { durationMs: attachment.playable_duration_in_ms, thumbnailUri: attachment.streamingImageThumbnail.uri, rotation: attachment.rotation }) });
    }
    if (type === 'MessageImage') {
        return Object.assign({ type: 'ImageAttachment' }, metadata, { url: attachment.image_full_screen.uri, metadata: dimensions() });
    }
    if (type === 'MessageAnimatedImage') {
        return Object.assign({ type: 'ImageAttachment' }, metadata, { url: attachment.animated_image_full_screen.uri, metadata: {
                width: attachment.animated_image_original_dimensions.x,
                height: attachment.animated_image_original_dimensions.y
            } });
    }
    if (type === 'MessageAudio') {
        return Object.assign({ type: 'AudioAttachment' }, metadata, { metadata: {
                durationMs: attachment.playable_duration_in_ms,
                isVoicemail: 0,
                callId: ''
            } });
    }
    if (type === 'MessageFile') {
        return Object.assign({ type: 'FileAttachment' }, metadata);
    }
    return attachment;
}
exports.default = parseBlobAttachment;
//# sourceMappingURL=parseBlobAttachment.js.map