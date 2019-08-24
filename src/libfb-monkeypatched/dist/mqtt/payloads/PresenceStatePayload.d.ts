import Payload from './Payload';
import { TCompactProtocol } from 'thrift';
export default class PresenceStatePayload extends Payload {
    recipient: string;
    sender: number;
    state: boolean;
    constructor(recipientId: string, state: boolean);
    encode(proto: TCompactProtocol): Promise<void>;
    getTopic(): string;
}
