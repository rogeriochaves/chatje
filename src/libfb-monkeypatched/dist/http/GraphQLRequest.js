"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpApiRequest_1 = tslib_1.__importDefault(require("./HttpApiRequest"));
const queryTypes = {
    UsersQuery: '10153915107411729',
    FetchContactsFullQuery: '10154444360806729',
    FetchContactsFullWithAfterQuery: '10154444360816729',
    FetchContactsDeltaQuery: '10154444360801729',
    ThreadListQuery: '2000270246651497',
    ThreadQuery: '10153919752036729',
    SeqIdQuery: '10155268192741729',
    UnreadThreadListQuery: '10153919752026729',
    FetchStickersWithPreviewsQuery: '10152877994321729',
    SearchUsers: '2530922320303835',
};
class GraphQLRequest extends HttpApiRequest_1.default {
    constructor(options) {
        const params = {
            query_id: queryTypes[options.name],
            query_params: JSON.stringify(options.params)
        };
        super({
            url: 'https://graph.facebook.com/graphql',
            method: 'get',
            friendlyName: options.name,
            params
        });
    }
}
exports.default = GraphQLRequest;
//# sourceMappingURL=GraphQLRequest.js.map