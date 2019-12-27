"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mime_types_1 = tslib_1.__importDefault(require("mime-types"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const length_stream_1 = tslib_1.__importDefault(require("length-stream"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const RandomIntGenerator_1 = tslib_1.__importDefault(require("../RandomIntGenerator"));
const Errors_1 = require("../types/Errors");
/**
 * @ignore
 */
const debugLog = debug_1.default('fblib');
/**
 * User agent spoofing the mobile Messenger app (version 148.0.0.20.381)
 */
const USER_AGENT = '[FBAN/Orca-Android;FBAV/220.0.0.20.121;]';
/**
 * ¯\\_(ツ)_/¯
 */
const APP_ID = '312713275593566';
/**
 * Base HTTP API class with generic POST method and sendImage helper
 */
class BaseHttpApi {
    post(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            request.params = Object.assign({}, request.params, { api_key: APP_ID, device_id: this.deviceId, fb_api_req_friendly_name: request.friendlyName, format: 'json', method: request.method, locale: 'en_EN' });
            request.sign();
            let extraHeaders = {};
            if (this.token) {
                extraHeaders['Authorization'] = 'OAuth ' + this.token;
            }
            const resp = yield node_fetch_1.default(request.url, {
                headers: Object.assign({ 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }, extraHeaders),
                method: 'POST',
                body: request.serializeParams(),
                compress: true
            });
            if (!resp.ok)
                throw new Errors_1.APIError(resp.statusText, yield resp.text());
            return resp.json();
        });
    }
    jsonPost(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            request.sign();
            let extraHeaders = {};
            if (this.token) {
                extraHeaders['Authorization'] = 'OAuth ' + this.token;
            }
            const resp = yield node_fetch_1.default(request.url, {
                headers: Object.assign({ 'User-Agent': USER_AGENT, 'Content-Type': 'application/json' }, extraHeaders),
                method: 'POST',
                body: JSON.stringify({
                    doc_id: request.params.query_id,
                    variables: JSON.parse(request.params.query_params)
                })
            });
            if (!resp.ok)
                throw new Errors_1.APIError(resp.statusText, yield resp.text());
            return resp.json();
        });
    }
    sendImage(readStream, extension, from, to, streamLength) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let randId = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 51; i++) {
                randId += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            const mimeType = extension.includes('/') ? extension : mime_types_1.default.lookup(extension);
            if (mimeType === extension)
                extension = mime_types_1.default.extension(mimeType);
            debugLog({ mimeType, extension });
            const len = streamLength || (yield this.streamLength(readStream));
            const resp = yield node_fetch_1.default('https://rupload.facebook.com/messenger_image/' + randId, {
                headers: {
                    'User-Agent': USER_AGENT,
                    Authorization: 'OAuth ' + this.token,
                    device_id: this.deviceId,
                    'X-Entity-Name': 'mediaUpload.' + extension,
                    is_preview: '1',
                    attempt_id: RandomIntGenerator_1.default.generate().toString(),
                    send_message_by_server: '1',
                    app_id: APP_ID,
                    'Content-Type': 'application/octet-stream',
                    image_type: 'FILE_ATTACHMENT',
                    offline_threading_id: RandomIntGenerator_1.default.generate().toString(),
                    'X-FB-Connection-Quality': 'EXCELLENT',
                    'X-Entity-Type': mimeType,
                    ttl: '0',
                    Offset: '0',
                    'X-FB-Friendly-Name': 'post_resumable_upload_session',
                    sender_fbid: from,
                    to,
                    'X-FB-HTTP-Engine': 'Liger',
                    original_timestamp: '' + Date.now(),
                    'Content-Length': len,
                    'X-Entity-Length': len,
                    client_tags: '{"trigger": "2:thread_view_messages_fragment_unknown"}'
                },
                method: 'POST',
                body: readStream
            });
            if (!resp.ok)
                throw new Errors_1.UploadAPIError((yield resp.json()).debug_info);
            return resp.json();
        });
    }
    streamLength(stream) {
        // it's actually number but node-fetch enforces strings and Facebook doesn't handle them properly?? what
        return new Promise(resolve => stream.pipe(length_stream_1.default(resolve)));
    }
}
exports.default = BaseHttpApi;
//# sourceMappingURL=BaseHttpApi.js.map