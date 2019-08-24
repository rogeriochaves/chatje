import HttpApiRequest from './HttpApiRequest';
declare type GraphQLQueryType = 'UsersQuery' | 'FetchContactsFullQuery' | 'FetchContactsFullWithAfterQuery' | 'FetchContactsDeltaQuery' | 'ThreadListQuery' | 'ThreadQuery' | 'SeqIdQuery' | 'UnreadThreadListQuery' | 'FetchStickersWithPreviewsQuery';
interface GraphQLOptions {
    name: GraphQLQueryType;
    params: any;
}
export default class GraphQLRequest extends HttpApiRequest {
    constructor(options: GraphQLOptions);
}
export {};
