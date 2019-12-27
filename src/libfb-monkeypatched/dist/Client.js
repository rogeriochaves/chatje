"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const FacebookDeviceId_1 = tslib_1.__importDefault(require("./FacebookDeviceId"));
const HttpApi_1 = tslib_1.__importDefault(require("./http/HttpApi"));
const MqttApi_1 = tslib_1.__importDefault(require("./mqtt/MqttApi"));
const Thread_1 = require("./types/Thread");
const User_1 = require("./types/User");
const debug_1 = tslib_1.__importDefault(require("debug"));
const Message_1 = require("./types/Message");
const parseDeltaEvent_1 = tslib_1.__importDefault(require("./types/events/parseDeltaEvent"));
const events_1 = tslib_1.__importDefault(require("events"));
const Errors_1 = require("./types/Errors");
const Payloads = tslib_1.__importStar(require("./mqtt/payloads"));
const debugLog = debug_1.default('fblib');
// 🥖
/**
 * Main client class
 */
class Client extends events_1.default {
    constructor(options = { selfListen: false, session: null }) {
        super();
        this.seqId = '';
        this.loggedIn = false;
        this.options = options;
        this.mqttApi = new MqttApi_1.default();
        this.httpApi = new HttpApi_1.default();
        let session = options.session;
        if (!session) {
            session = { tokens: null, deviceId: null };
        }
        if (options.deviceId) {
            session.deviceId = options.deviceId;
        }
        if (!session.deviceId) {
            const deviceId = FacebookDeviceId_1.default();
            session.deviceId = deviceId;
            this.httpApi.deviceId = deviceId.deviceId;
        }
        if (session.tokens) {
            this.httpApi.token = session.tokens.access_token;
        }
        this.session = session;
    }
    login(email, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // trim to check for spaces (which are truthy)
            if (this.loggedIn)
                throw new Error('Already logged in!');
            if (!email || typeof email !== 'string' || !email.trim() ||
                !password || typeof password !== 'string' || !password.trim())
                throw new Error('Wrong username/password!');
            yield this.doLogin(email, password);
            this.loggedIn = true;
        });
    }
    doLogin(login, password) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.session.tokens) {
                let tokens;
                try {
                    tokens = yield this.httpApi.auth(login, password);
                }
                catch (err) {
                    return reject(err);
                }
                this.httpApi.token = tokens.access_token;
                this.session.tokens = tokens;
            }
            this.mqttApi.on('publish', (publish) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                debugLog(publish.topic);
                if (publish.topic === '/send_message_response') {
                    const response = JSON.parse(publish.data.toString('utf8'));
                    debugLog(response);
                    this.mqttApi.emit('sentMessage:' + response.msgid, response);
                }
                if (publish.topic === '/t_ms')
                    this.handleMS(publish.data.toString('utf8'));
            }));
            this.mqttApi.on('connected', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let viewer;
                try {
                    ({ viewer } = yield this.httpApi.querySeqId());
                }
                catch (err) {
                    return reject(err);
                }
                const seqId = viewer.message_threads.sync_sequence_id;
                this.seqId = seqId;
                resolve();
                if (!this.session.tokens.syncToken) {
                    yield this.createQueue(seqId);
                    return;
                }
                yield this.createQueue(seqId);
            }));
            try {
                yield this.mqttApi.connect(this.session.tokens, this.session.deviceId);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    getSession() {
        return this.session;
    }
    sendMessage(threadId, message, options) {
        return this.mqttApi.sendMessage(threadId, message, options);
    }
    /**
     * Indicate that the user is currently present in the conversation.
     * Only relevant for non-group conversations
     */
    sendPresenceState(recipientUserId, present) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = new Payloads.PresenceState(recipientUserId, present);
            return this.mqttApi.sendPublish(payload.getTopic(), yield Payloads.encodePayload(payload));
        });
    }
    /**
     * Send "User is typing" message.
     * In a non-group conversation, sendPresenceState() must be called first.
     */
    sendTypingState(threadOrRecipientUserId, present) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = new Payloads.TypingState(this.session.tokens.uid, present, threadOrRecipientUserId);
            return this.mqttApi.sendPublish(payload.getTopic(), yield Payloads.encodePayload(payload));
        });
    }
    /**
     * Mark a message as read.
     */
    sendReadReceipt(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = new Payloads.ReadReceipt(message);
            return this.mqttApi.sendPublish(payload.getTopic(), yield Payloads.encodePayload(payload));
        });
    }
    getThreadList(count) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const threads = yield this.httpApi.threadListQuery(count);
            return threads.viewer.message_threads.nodes.map(Thread_1.parseThread);
        });
    }
    sendAttachmentFile(threadId, attachmentPath, extension) {
        if (!fs_1.default.existsSync(attachmentPath))
            throw new Errors_1.AttachmentNotFoundError(attachmentPath);
        const stream = fs_1.default.createReadStream(attachmentPath);
        if (!extension)
            extension = path_1.default.parse(attachmentPath).ext;
        const length = fs_1.default.statSync(attachmentPath).size.toString();
        return this.httpApi.sendImage(stream, extension, this.session.tokens.uid, threadId, length);
    }
    sendAttachmentStream(threadId, extension, attachment) {
        return this.httpApi.sendImage(attachment, extension, this.session.tokens.uid, threadId);
    }
    getAttachmentURL(messageId, attachmentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const attachment = yield this.httpApi.getAttachment(messageId, attachmentId);
            if (!attachment.redirect_uri)
                throw new Errors_1.AttachmentURLMissingError(attachment);
            return attachment.redirect_uri;
        });
    }
    getAttachmentInfo(messageId, attachmentId) {
        return this.httpApi.getAttachment(messageId, attachmentId);
    }
    getStickerURL(stickerId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sticker = yield this.httpApi.getSticker(stickerId);
            return sticker[stickerId.toString()].thread_image.uri;
        });
    }
    getThreadInfo(threadId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpApi.threadQuery(threadId);
            const thread = res[threadId];
            if (!thread)
                return null;
            return Thread_1.parseThread(thread);
        });
    }
    getUserInfo(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpApi.userQuery(userId);
            const user = res[userId];
            if (!user)
                return null;
            return User_1.parseUser(user);
        });
    }
    getMessages(threadId, count) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.httpApi.threadMessagesQuery(threadId, count);
            const thread = res[threadId];
            if (!thread)
                return [];
            return thread.messages.nodes.map(message => Message_1.parseThreadMessage(threadId, message));
        });
    }
    async searchUsers(query) {
        const res = await this.httpApi.searchUsers(query);
        return res.data.entities_named.search_results.edges;
    }
    createQueue(seqId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // sync_api_version 3: You receive /t_ms payloads as json
            // sync_api_version 10: You receiove /t_ms payloads as thrift,
            // and connectQueue() does not have to be called.
            // Note that connectQueue() should always use 10 instead.
            const obj = ({
                initial_titan_sequence_id: seqId,
                delta_batch_size: 125,
                device_params: {
                    image_sizes: {
                        0: '4096x4096',
                        4: '312x312',
                        1: '768x768',
                        2: '420x420',
                        3: '312x312'
                    },
                    animated_image_format: 'WEBP,GIF',
                    animated_image_sizes: {
                        0: '4096x4096',
                        4: '312x312',
                        1: '768x768',
                        2: '420x420',
                        3: '312x312'
                    }
                },
                entity_fbid: this.session.tokens.uid,
                sync_api_version: 3,
                encoding: 'JSON',
                queue_params: {
                    // Array of numbers -> Some bitwise encoding scheme -> base64. Numbers range from 0 to 67
                    // Decides what type of /t_ms delta messages you get. Flags unknown, copy-pasted from app.
                    client_delta_sync_bitmask: 'Amvr2dBlf7PNgA',
                    graphql_query_hashes: {
                        xma_query_id: '306810703252313'
                    },
                    graphql_query_params: {
                        306810703252313: {
                            xma_id: '<ID>',
                            small_preview_width: 624,
                            small_preview_height: 312,
                            large_preview_width: 1536,
                            large_preview_height: 768,
                            full_screen_width: 4096,
                            full_screen_height: 4096,
                            blur: 0.0,
                            nt_context: {
                                styles_id: 'fe1fd5357bb40c81777dc915dfbd6aa4',
                                pixel_ratio: 3.0
                            }
                        }
                    }
                }
            });
            yield this.mqttApi.sendPublish('/messenger_sync_create_queue', JSON.stringify(obj));
        });
    }
    connectQueue(seqId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // If createQueue() uses sync_api_version 10, this does not need to be called, and you will not receive json payloads.
            // If this does not use sync_api_version 10, you will not receive all messages (e.g. reactions )
            // Send the thrift-equivalent payload to /t_ms_gd and you will receive mostly thrift-encoded payloads instead.
            const obj = {
                delta_batch_size: 125,
                max_deltas_able_to_process: 1250,
                sync_api_version: 10,
                encoding: 'JSON',
                last_seq_id: seqId,
                sync_token: this.session.tokens.syncToken
            };
            yield this.mqttApi.sendPublish('/messenger_sync_get_diffs', JSON.stringify(obj));
        });
    }
    handleMS(ms) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                data = JSON.parse(ms.replace('\u0000', ''));
            }
            catch (err) {
                console.error('Error while parsing the following message:');
                console.error(ms);
                return;
            }
            // Handled on queue creation
            if (data.syncToken) {
                this.session.tokens.syncToken = data.syncToken;
                yield this.connectQueue(this.seqId);
                return;
            }
            if (!data.deltas || !Array.isArray(data.deltas))
                return;
            data.deltas.forEach(delta => {
                debugLog(delta);
                this.handleMessage(delta);
            });
        });
    }
    handleMessage(event) {
        if (event.deltaNewMessage) {
            const message = Message_1.parseDeltaMessage(event.deltaNewMessage);
            if (!message || message.authorId === this.session.tokens.uid && !this.options.selfListen)
                return;
            this.emit('message', message);
        }
        const deltaEvent = parseDeltaEvent_1.default(event);
        if (!deltaEvent)
            return;
        this.emit('event', deltaEvent);
        // @ts-ignore TypeScript somehow doesn't recognize that EventType is compatible with the properties defined in ClientEvents
        this.emit(deltaEvent.type, deltaEvent.event);
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map