"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PacketReader {
    constructor(packet) {
        this.pos = 0;
        this.packet = packet;
    }
    readU8() {
        const res = this.packet.content.readUInt8(this.pos);
        this.pos += 1;
        return res;
    }
    readU16() {
        const res = this.packet.content.readUInt16BE(this.pos);
        this.pos += 2;
        return res;
    }
    readData() {
        const size = this.readU16();
        const res = this.packet.content.slice(this.pos, size + 2);
        this.pos += size;
        return res;
    }
    readRaw() {
        const res = this.packet.content.slice(this.pos, this.packet.content.length);
        this.pos = this.packet.content.length;
        return res;
    }
}
exports.default = PacketReader;
//# sourceMappingURL=PacketReader.js.map