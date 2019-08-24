"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const url_1 = require("url");
const vm_1 = tslib_1.__importDefault(require("vm"));
function parseXMAAttachment(xma) {
    const attach = xma[Object.keys(xma)[0]].story_attachment;
    if (!attach.target || !attach.target.__type__) {
        return {
            type: 'UnavailableXMA',
            message: attach.description ? attach.description.text : 'Attachment unavailable',
            attach: xma
        };
    }
    const type = attach.target.__type__.name;
    if (type === 'Story') {
        return {
            type: 'StoryXMA',
            url: attach.url
        };
    }
    if (type === 'ExternalUrl') {
        return {
            type: 'ExternalUrlXMA',
            url: cleanURL(attach.url)
        };
    }
    if (type === 'MessengerBusinessMessage') {
        return {
            type: 'AdvertXMA',
            message: attach.title,
            url: attach.url ? cleanURL(attach.url) : null
        };
    }
    if (type === 'MessengerEventReminder') {
        return {
            type: 'EventReminderXMA',
            message: attach.title,
            description: attach.description.text
        };
    }
    if (type === 'InstantGamesLeaderboardUpdateStoryAttachment') {
        return {
            type: 'LeaderboardUpdateXMA',
            message: attach.title,
            imageURL: attach.subattachments.filter(a => a.media && a.media.__type__.name === 'BestEffortImageAttachmentMedia')[0].media.image.uri
        };
    }
    if (type === 'MessageLiveLocation') {
        return {
            type: 'LiveLocationXMA',
            url: cleanURL(attach.url)
        };
    }
    if (type === 'MessageLocation') {
        return {
            type: 'LocationXMA',
            url: cleanURL(attach.url)
        };
    }
    if (type === 'Group') {
        return {
            type: 'GroupXMA',
            url: attach.url
        };
    }
    if (type === 'LightweightAction') {
        return {
            type: 'LightweightActionXMA',
            message: attach.title
        };
    }
    if (type === 'Page') {
        return {
            type: 'PageXMA',
            url: attach.url
        };
    }
    if (type === 'GroupCommerceProductItem') {
        return {
            type: 'ProductXMA',
            url: attach.url
        };
    }
    if (type === 'MontageShare') {
        return {
            type: 'MontageXMA'
        };
    }
    if (type === 'InstagramMediaAttachmentLink') {
        return {
            type: 'InstagramXMA',
            url: attach.url
        };
    }
}
exports.default = parseXMAAttachment;
function cleanURL(url) {
    const { query } = url_1.parse(url, true);
    if (url.startsWith('https:\\/\\/'))
        return cleanURL(vm_1.default.runInContext(url, vm_1.default.createContext()));
    if (url.startsWith('fbrpc:'))
        return cleanURL(query.target_url);
    if (url.includes('l.facebook.com/l.php'))
        return cleanURL(query.u);
    if (url.match(/http[s]?:\/\/(www.)?google\.[a-z.]{2,7}\/url\?/))
        return cleanURL(query.url);
    return url;
}
//# sourceMappingURL=parseXMAAttachment.js.map