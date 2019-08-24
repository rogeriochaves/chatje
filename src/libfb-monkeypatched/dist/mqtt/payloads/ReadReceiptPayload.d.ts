import Payload from './Payload';
import { TCompactProtocol } from 'thrift';
import Message from '../../types/Message';
export default class ReadReceiptPayload extends Payload {
    otherUserFbId: string;
    threadFbId: string;
    watermarkTimestamp: number;
    constructor(message: Message);
    encode(proto: TCompactProtocol): Promise<void>;
    getTopic(): string;
}
