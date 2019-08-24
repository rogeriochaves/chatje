"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseDeltaEvent_1 = require("./parseDeltaEvent");
function parsePollEvent(delta) {
    const { untypedData } = delta;
    const type = untypedData.event_type;
    const question = JSON.parse(untypedData.question_json);
    const event = Object.assign({}, parseDeltaEvent_1.getEventMetadata(delta), { title: question.text, options: question.options.map(option => ({
            id: option.id,
            title: option.text,
            voteCount: option.total_count,
            voters: option.voters,
            viewerHasVoted: option.viewer_has_voted === 'true'
        })) });
    if (type === 'question_creation') {
        return {
            type: 'pollCreateEvent',
            event: event
        };
    }
    if (type === 'update_vote') {
        return {
            type: 'pollUpdateVoteEvent',
            event: event
        };
    }
}
exports.default = parsePollEvent;
//# sourceMappingURL=parsePollEvent.js.map