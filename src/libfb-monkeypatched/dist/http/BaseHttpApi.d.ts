/// <reference types="node" />
import { Readable } from 'stream';
import HttpApiRequest from './HttpApiRequest';
/**
 * Base HTTP API class with generic POST method and sendImage helper
 */
export default class BaseHttpApi {
    deviceId: string;
    token: string;
    post(request: HttpApiRequest): Promise<any>;
    sendImage(readStream: Readable, extension: string, from: string, to: string, streamLength?: string): Promise<any>;
    streamLength(stream: any): Promise<string>;
}
