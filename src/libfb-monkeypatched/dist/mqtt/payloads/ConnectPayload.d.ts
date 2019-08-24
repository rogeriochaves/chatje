import Payload from './Payload';
import { TCompactProtocol } from 'thrift';
import AuthTokens from '../../types/AuthTokens';
import DeviceId from '../../types/DeviceId';
export default class ConnectRequest extends Payload {
    deviceId: DeviceId;
    tokens: AuthTokens;
    userAgent: string;
    constructor(deviceId: DeviceId, tokens: AuthTokens, userAgent: string);
    encode(proto: TCompactProtocol): Promise<void>;
}
