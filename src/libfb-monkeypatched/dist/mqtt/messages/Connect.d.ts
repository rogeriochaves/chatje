import AuthTokens from '../../types/AuthTokens';
import DeviceId from '../../types/DeviceId';
import MqttMessage from '../MqttMessage';
/**
 * Assembles a connect messages sent just after a TLS connection is established.
 */
export declare const encodeConnectMessage: (tokens: AuthTokens, deviceId: DeviceId) => Promise<MqttMessage>;
