export interface RequestParams {
    [x: string]: string;
}
export interface RequestOptions {
    url: string;
    method: string;
    friendlyName: string;
    params: RequestParams;
}
/**
 * COntains all data used by custom facebook http logic.
 */
export default class HttpApiRequest {
    url: string;
    method: string;
    friendlyName: string;
    params: RequestParams;
    constructor(options: RequestOptions);
    readonly sortedKeys: string[];
    serializeParams(): string;
    sign(): void;
}
