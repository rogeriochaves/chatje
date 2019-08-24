export declare class AuthAPIError extends Error {
    code?: number;
    errorData?: any;
    requestArgs?: any;
}
export declare class UploadAPIError extends Error {
    debugInfo: {
        retriable: boolean;
        type: string;
        message: string;
    };
    constructor(debugInfo: any);
}
export declare class APIError extends Error {
    details: any;
    constructor(status: any, details: any);
}
export declare class AttachmentNotFoundError extends Error {
    path: string;
    constructor(path: any);
}
export declare class AttachmentURLMissingError extends Error {
    attachment: any;
    constructor(attachment: any);
}
