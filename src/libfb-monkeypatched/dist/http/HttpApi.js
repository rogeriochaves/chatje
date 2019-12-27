"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BaseHttpApi_1 = tslib_1.__importDefault(require("./BaseHttpApi"));
const HttpApiRequest_1 = tslib_1.__importDefault(require("./HttpApiRequest"));
const GraphQLRequest_1 = tslib_1.__importDefault(require("./GraphQLRequest"));
const Errors_1 = require("../types/Errors");
/**
 * This class will make specific requests to the facebook API utilizing their sick http logic implemented by BaseFacebookHttpApi.
 */
class HttpApi extends BaseHttpApi_1.default {
  /**
   * @see QFacebookHttpApi::auth
   * @param email
   * @param password
   */
  auth(email, password) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      var [pass, code_verifier] = password.split(":");
      return this.post(
        new HttpApiRequest_1.default({
          url: "https://b-api.facebook.com/method/auth.login",
          method: "auth.login",
          friendlyName: "authenticate",
          params: {
            email,
            password: pass,
            code_verifier,
            credentials_type: "work_sso_nonce"
          }
        })
      ).then(res => {
        if (!res.access_token) {
          const error = new Errors_1.AuthAPIError(res.error_msg);
          error.code = res.error_code;
          error.errorData = JSON.parse(res.error_data);
          error.requestArgs = res.request_args.reduce(
            (prev, current) =>
              Object.assign({}, prev, { [current.key]: current.value }),
            {}
          );
          throw error;
        }
        this.token = res.access_token;
        return res;
      });
    });
  }
  /**
   * @see QFacebookHttpApi::usersQuery
   */
  userQuery(userId) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "UsersQuery",
          params: {
            "0": [userId],
            "1": true
          }
        })
      );
    });
  }
  /**
   * @see QFacebookHttpApi::usersQuery
   */
  usersQuery(userIds) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "FetchContactsFullQuery",
          params: {
            "0": userIds,
            "1": userIds.length
          }
        })
      );
    });
  }
  /**
   * @see QFacebookHttpApi::usersQueryAfter
   * @param userIds
   * @param cursor
   */
  usersQueryAfter(userIds, cursor) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "FetchContactsFullWithAfterQuery",
          params: {
            "0": userIds,
            "1": cursor,
            "2": userIds.length
          }
        })
      );
    });
  }
  /**
   * @see QFacebookHttpApi::usersQueryDelta
   * @param userId
   * @param deltaCursor
   */
  usersQueryDelta(userId, deltaCursor) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "FetchContactsDeltaQuery",
          params: {
            "0": deltaCursor,
            "1": [userId],
            "2": "500"
          }
        })
      );
    });
  }
  /**
   * @see QFacebookHttpApi::threadListQuery
   */
  threadListQuery(count) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "ThreadListQuery",
          params: {
            "11": "true",
            "23": count,
            "3": "false",
            "27": "false",
            "5": "false",
            "10": "false",
            "17": 20,
            "18": 880,
            "19": 220,
            "20": 138,
            "31": "3"
          }
        })
      );
    });
  }
  /**
   * @param threadId
   * @see facebook-api.c:3317
   */
  threadQuery(threadId) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "ThreadQuery",
          params: {
            "0": [threadId],
            "10": false,
            "11": false,
            "13": true // show more details for messaging actors
          }
        })
      );
    });
  }
  threadMessagesQuery(threadId, count) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "ThreadQuery",
          params: {
            "0": [threadId],
            "11": true,
            "12": count
          }
        })
      );
    });
  }
  searchUsers(query) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.jsonPost(
        new GraphQLRequest_1.default({
          name: "SearchUsers",
          params: {
            search_query: query,
            result_limit: 16,
            context: "workchat"
          }
        })
      );
    });
  }
  querySeqId() {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "SeqIdQuery",
          params: {
            "1": "0"
          }
        })
      );
    });
  }
  /**
   * @see QFacebookHttpApi::unreadThreadListQuery
   * @param unreadCount
   */
  unreadThreadListQuery(unreadCount) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new GraphQLRequest_1.default({
          name: "UnreadThreadListQuery",
          params: {
            "1": unreadCount,
            "2": true,
            "12": true,
            "13": false
          }
        })
      );
    });
  }
  /**
   * @param mid Message ID
   * @param aid Attachment ID
   */
  getAttachment(mid, aid) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
      return this.post(
        new HttpApiRequest_1.default({
          url: "https://api.facebook.com/method/messaging.getAttachment",
          method: "messaging.getAttachment",
          friendlyName: "",
          params: { mid, aid }
        })
      );
    });
  }
  /**
   * @param stickerId
   */
  getSticker(stickerId) {
    return this.post(
      new GraphQLRequest_1.default({
        name: "FetchStickersWithPreviewsQuery",
        params: {
          "0": [stickerId]
        }
      })
    );
  }
}
exports.default = HttpApi;
//# sourceMappingURL=HttpApi.js.map
