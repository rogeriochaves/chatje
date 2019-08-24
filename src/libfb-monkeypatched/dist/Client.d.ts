/// <reference types="node" />
import Session from './types/Session';
import Thread from './types/Thread';
import User from './types/User';
import { Readable } from 'stream';
import Message, { MessageOptions } from './types/Message';
import EventEmitter from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import ClientEvents from './ClientEvents';
import DeviceId from './types/DeviceId';
export interface ClientOptions {
    selfListen?: boolean;
    session?: Session;
    deviceId?: DeviceId;
}
declare const Client_base: new () => StrictEventEmitter<EventEmitter, ClientEvents, ClientEvents, "addEventListener" | "removeEventListener", "removeListener" | "on" | "addListener" | "once" | "emit">;
/**
 * Main client class
 */
export default class Client extends Client_base {
    private mqttApi;
    private httpApi;
    private readonly session;
    private seqId;
    loggedIn: boolean;
    private options;
    constructor(options?: ClientOptions);
    login(email: string, password: string): Promise<void>;
    private doLogin;
    getSession(): Session;
    sendMessage(threadId: string, message: string, options?: MessageOptions): Promise<{
        succeeded: boolean;
        errStr?: string; /**
         * Indicate that the user is currently present in the conversation.
         * Only relevant for non-group conversations
         */
    }>;
    /**
     * Indicate that the user is currently present in the conversation.
     * Only relevant for non-group conversations
     */
    sendPresenceState(recipientUserId: string, present: boolean): Promise<void>;
    /**
     * Send "User is typing" message.
     * In a non-group conversation, sendPresenceState() must be called first.
     */
    sendTypingState(threadOrRecipientUserId: string, present: boolean): Promise<void>;
    /**
     * Mark a message as read.
     */
    sendReadReceipt(message: Message): Promise<void>;
    getThreadList(count: number): Promise<Thread[]>;
    sendAttachmentFile(threadId: string, attachmentPath: string, extension?: string): Promise<any>;
    sendAttachmentStream(threadId: string, extension: string, attachment: Readable): Promise<any>;
    getAttachmentURL(messageId: string, attachmentId: string): Promise<string>;
    getAttachmentInfo(messageId: string, attachmentId: string): Promise<any>;
    getStickerURL(stickerId: number): Promise<string>;
    getThreadInfo(threadId: string): Promise<Thread>;
    getUserInfo(userId: string): Promise<User>;
    getMessages(threadId: string, count: number): Promise<Message>;
    private createQueue;
    private connectQueue;
    private handleMS;
    private handleMessage;
}
export {};
