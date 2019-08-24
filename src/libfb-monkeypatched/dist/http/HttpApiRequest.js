"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
/**
 * COntains all data used by custom facebook http logic.
 */
class HttpApiRequest {
    constructor(options) {
        this.url = options.url;
        this.method = options.method;
        this.friendlyName = options.friendlyName;
        this.params = options.params;
    }
    get sortedKeys() {
        const keys = Object.keys(this.params);
        keys.sort();
        return keys;
    }
    serializeParams() {
        return this.sortedKeys
            .map(k => encodeURIComponent(k) +
            '=' +
            encodeURIComponent(this.params[k]))
            .join('&');
    }
    sign() {
        let data = this.sortedKeys
            .map(k => k + '=' + this.params[k])
            .join(''); // This isn't the same as request.serializeParams(), because no & sign and no escaping. Thanks ZUCC
        data += 'd2901dc6cb685df3b074b30b56b78d28'; // api secret
        this.params.sig = crypto_1.createHash('md5')
            .update(data)
            .digest('hex');
    }
}
exports.default = HttpApiRequest;
//# sourceMappingURL=HttpApiRequest.js.map