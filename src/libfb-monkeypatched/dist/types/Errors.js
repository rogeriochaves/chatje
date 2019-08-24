"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthAPIError extends Error {
}
exports.AuthAPIError = AuthAPIError;
class UploadAPIError extends Error {
    constructor(debugInfo) {
        super('Error occured while uploading');
        this.debugInfo = debugInfo;
    }
}
exports.UploadAPIError = UploadAPIError;
class APIError extends Error {
    constructor(status, details) {
        super(status);
        this.details = details;
    }
}
exports.APIError = APIError;
class AttachmentNotFoundError extends Error {
    constructor(path) {
        super('Attachment not found!');
        this.path = path;
    }
}
exports.AttachmentNotFoundError = AttachmentNotFoundError;
class AttachmentURLMissingError extends Error {
    constructor(attachment) {
        super('Attachment URL missing!');
        this.attachment = attachment;
    }
}
exports.AttachmentURLMissingError = AttachmentURLMissingError;
//# sourceMappingURL=Errors.js.map