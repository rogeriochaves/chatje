"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parseFileAttachment_1 = tslib_1.__importDefault(require("./parseFileAttachment"));
const parseBlobAttachment_1 = tslib_1.__importDefault(require("./parseBlobAttachment"));
const parseXMAAttachment_1 = tslib_1.__importDefault(require("./parseXMAAttachment"));
function parseAttachments(attachments) {
    const result = {
        fileAttachments: [],
        mediaAttachments: []
    };
    for (let attachment of attachments) {
        if (attachment.mimeType)
            result.fileAttachments.push(parseFileAttachment_1.default(attachment));
        if (attachment.mimetype)
            result.fileAttachments.push(parseBlobAttachment_1.default(attachment));
        if (attachment.xmaGraphQL)
            result.mediaAttachments.push(parseXMAAttachment_1.default(JSON.parse(attachment.xmaGraphQL)));
        result.mediaAttachments.push(Object.assign({ type: 'Unknown' }, attachment));
    }
    return result;
}
exports.default = parseAttachments;
//# sourceMappingURL=parseAttachments.js.map