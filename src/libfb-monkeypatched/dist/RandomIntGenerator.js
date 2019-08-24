"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const long_1 = tslib_1.__importDefault(require("long"));
class RandomIntGenerator {
    // static generate () {
    //   return Math.floor(Math.random() * (Math.pow(2, 32) + 1))
    // }
    static getAttemptId() {
        const sysTime = long_1.default.fromNumber(Date.now()).shiftLeft(22);
        const randomBit = long_1.default.fromNumber(RandomIntGenerator.generate() & 4194303).and(long_1.default.MAX_VALUE);
        return sysTime.or(randomBit);
    }
    static generate() {
        return Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
    }
}
exports.default = RandomIntGenerator;
//# sourceMappingURL=RandomIntGenerator.js.map