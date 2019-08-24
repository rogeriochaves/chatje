"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MqttConnectFlag;
(function (MqttConnectFlag) {
    MqttConnectFlag[MqttConnectFlag["Clr"] = 2] = "Clr";
    MqttConnectFlag[MqttConnectFlag["Wil"] = 4] = "Wil";
    MqttConnectFlag[MqttConnectFlag["Ret"] = 32] = "Ret";
    MqttConnectFlag[MqttConnectFlag["Pass"] = 64] = "Pass";
    MqttConnectFlag[MqttConnectFlag["User"] = 128] = "User";
    MqttConnectFlag[MqttConnectFlag["QoS0"] = 0] = "QoS0";
    MqttConnectFlag[MqttConnectFlag["QoS1"] = 8] = "QoS1";
    MqttConnectFlag[MqttConnectFlag["QoS2"] = 16] = "QoS2";
})(MqttConnectFlag = exports.MqttConnectFlag || (exports.MqttConnectFlag = {}));
/**
 * @private
 */
var MqttMessageFlag;
(function (MqttMessageFlag) {
    MqttMessageFlag[MqttMessageFlag["Ret"] = 1] = "Ret";
    MqttMessageFlag[MqttMessageFlag["Dup"] = 8] = "Dup";
    MqttMessageFlag[MqttMessageFlag["QoS0"] = 0] = "QoS0";
    MqttMessageFlag[MqttMessageFlag["QoS1"] = 2] = "QoS1";
    MqttMessageFlag[MqttMessageFlag["QoS2"] = 4] = "QoS2";
})(MqttMessageFlag = exports.MqttMessageFlag || (exports.MqttMessageFlag = {}));
//# sourceMappingURL=MqttTypes.js.map