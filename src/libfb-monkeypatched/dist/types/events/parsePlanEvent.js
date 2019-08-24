"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseDeltaEvent_1 = require("./parseDeltaEvent");
function parsePlanEvent(delta) {
    const { untypedData } = delta;
    const event = Object.assign({}, parseDeltaEvent_1.getEventMetadata(delta), { creatorId: untypedData.event_creator_id, title: untypedData.event_title, time: new Date(untypedData.event_time * 1000), location: untypedData.event_location_name, guests: JSON.parse(untypedData.guest_state_list).map(guest => ({
            state: guest.guest_list_state,
            id: guest.node.id
        })) });
    if (delta.type === 'lightweight_event_create') {
        return {
            type: 'planCreateEvent',
            event: event
        };
    }
    if (delta.type === 'lightweight_event_update_title') {
        return {
            type: 'planUpdateTitleEvent',
            event: event
        };
    }
    if (delta.type === 'lightweight_event_update_time') {
        return {
            type: 'planUpdateTimeEvent',
            event: event
        };
    }
    if (delta.type === 'lightweight_event_update_location') {
        return {
            type: 'planUpdateLocationEvent',
            event: event
        };
    }
    if (delta.type === 'lightweight_event_rsvp') {
        return {
            type: 'planRsvpEvent',
            event: Object.assign({}, event, { guestId: delta.untypedData.guest_id, status: delta.untypedData.guest_status })
        };
    }
    if (delta.type === 'lightweight_event_delete') {
        return {
            type: 'planDeleteEvent',
            event: event
        };
    }
}
exports.default = parsePlanEvent;
//# sourceMappingURL=parsePlanEvent.js.map