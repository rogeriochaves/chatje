import BaseHttpApi from './BaseHttpApi';
import AuthTokens from '../types/AuthTokens';
/**
 * This class will make specific requests to the facebook API utilizing their sick http logic implemented by BaseFacebookHttpApi.
 */
export default class HttpApi extends BaseHttpApi {
    /**
     * @see QFacebookHttpApi::auth
     * @param email
     * @param password
     */
    auth(email: string, password: string): Promise<AuthTokens>;
    /**
     * @see QFacebookHttpApi::usersQuery
     */
    userQuery(userId: string): Promise<any>;
    /**
     * @see QFacebookHttpApi::usersQuery
     */
    usersQuery(userIds: [string]): Promise<any>;
    /**
     * @see QFacebookHttpApi::usersQueryAfter
     * @param userIds
     * @param cursor
     */
    usersQueryAfter(userIds: [string], cursor: string): Promise<any>;
    /**
     * @see QFacebookHttpApi::usersQueryDelta
     * @param userId
     * @param deltaCursor
     */
    usersQueryDelta(userId: string, deltaCursor: string): Promise<any>;
    /**
     * @see QFacebookHttpApi::threadListQuery
     */
    threadListQuery(count: number): Promise<any>;
    /**
     * @param threadId
     * @see facebook-api.c:3317
     */
    threadQuery(threadId: string): Promise<any>;
    threadMessagesQuery(threadId: string, count: number): Promise<any>;
    querySeqId(): Promise<any>;
    /**
     * @see QFacebookHttpApi::unreadThreadListQuery
     * @param unreadCount
     */
    unreadThreadListQuery(unreadCount: number): Promise<any>;
    /**
     * @param mid Message ID
     * @param aid Attachment ID
     */
    getAttachment(mid: string, aid: string): Promise<any>;
    /**
     * @param stickerId
     */
    getSticker(stickerId: number): Promise<any>;
}
