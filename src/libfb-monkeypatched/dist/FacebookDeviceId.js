"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RandomIntGenerator_1 = tslib_1.__importDefault(require("./RandomIntGenerator"));
const makeUuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.default = () => {
    const uuid = makeUuidv4();
    const deviceId = uuid;
    const clientId = uuid.substring(0, 20);
    const mqttId = RandomIntGenerator_1.default.generate();
    return { clientId, deviceId, mqttId };
};
//# sourceMappingURL=FacebookDeviceId.js.map