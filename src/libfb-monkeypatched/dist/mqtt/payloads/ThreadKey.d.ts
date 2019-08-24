import Payload from './Payload';
import { TCompactProtocol } from 'thrift';
export default class ThreadKeyPayload extends Payload {
    threadId: string;
    threadType: number;
    constructor(threadId: string, threadType: 0 | 1);
    encode(proto: TCompactProtocol): Promise<void>;
    getTopic(): string;
}
