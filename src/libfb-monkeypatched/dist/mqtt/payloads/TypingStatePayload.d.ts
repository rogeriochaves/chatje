import Payload from './Payload';
import ThreadKey from './ThreadKey';
import { TCompactProtocol } from 'thrift';
export default class TypingStatePayload extends Payload {
    recipient: string;
    sender: string;
    state: boolean;
    threadKey: ThreadKey;
    constructor(senderUserId: string, state: boolean, recipientUserOrThreadId: string);
    encode(proto: TCompactProtocol): Promise<void>;
    getTopic(): string;
}
