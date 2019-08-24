"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const parseDeltaEvent_1 = require("./parseDeltaEvent");
const parsePollEvent_1 = tslib_1.__importDefault(require("./parsePollEvent"));
const parsePlanEvent_1 = tslib_1.__importDefault(require("./parsePlanEvent"));
function parseAdminMessage(delta) {
    if (delta.type.startsWith('lightweight_event_'))
        return parsePlanEvent_1.default(delta);
    if (delta.type === 'group_poll')
        return parsePollEvent_1.default(delta);
    if (delta.type === 'change_thread_nickname') {
        return {
            type: 'changeThreadNicknameEvent',
            event: Object.assign({}, parseDeltaEvent_1.getEventMetadata(delta), { participantId: delta.untypedData.participant_id, nickname: delta.untypedData.nickname })
        };
    }
    if (delta.type === 'change_thread_admins') {
        return {
            type: 'addThreadAdminsEvent',
            event: Object.assign({}, parseDeltaEvent_1.getEventMetadata(delta), { participantId: delta.untypedData.TARGET_ID })
        };
    }
    if (delta.type === 'change_thread_icon') {
        return {
            type: 'changeThreadIconEvent',
            event: Object.assign({}, parseDeltaEvent_1.getEventMetadata(delta), { threadIcon: delta.untypedData.thread_icon, threadIconURL: delta.untypedData.thread_icon_url })
        };
    }
    if (delta.type === 'change_thread_theme') {
        return {
            type: 'changeThreadThemeEvent',
            event: Object.assign({}, parseDeltaEvent_1.getEventMetadata(delta), { color: delta.untypedData.theme_color })
        };
    }
}
exports.default = parseAdminMessage;
//# sourceMappingURL=parseAdminMessage.js.map