"use strict";
const buffer_1 = require("buffer");
const fs_1 = require("fs");
const DL_SIZE = 16384, REQUEST = buffer_1.Buffer.from([0x00, 0x00, 0x00, 0x0d, 0x06]), debug = require("debug")("torrent-engine");
class TPH {
    constructor(files, length, pieceSize, pieceCount, lastPieceSize) {
        this._debug = (...args) => {
            args[0] = "[" + this._debugId + "] " + args[0];
            debug.apply(null, args);
        };
        const self = this;
        self._debugId = ~~((Math.random() * 100000) + 1);
        self.files = files;
        self.length = length;
        self.pieceSize = pieceSize;
        self.pieceCount = --pieceCount;
        self.lastPieceSize = lastPieceSize;
        self.parts = pieceSize / DL_SIZE;
        self.lastParts = Math.floor(lastPieceSize / DL_SIZE);
        self.leftover = lastPieceSize % DL_SIZE;
        self._debug("Torrent-piece-handler created");
    }
    prepareRequest(pieceNumber, cb) {
        this._debug(`prepareRequest with pieceNumber: ${pieceNumber}`);
        const self = this;
        let result = [];
        let count = 0;
        if (pieceNumber !== self.pieceCount) {
            let part = 0;
            count = self.parts;
            for (let i = 0; i < self.parts; i++) {
                let buf = buffer_1.Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00]);
                buf.writeUInt32BE(pieceNumber, 0);
                result.push(REQUEST);
                result.push(buf);
                buf.writeUInt32BE(part, 4);
                part += DL_SIZE;
            }
        }
        else {
            let part = 0;
            count = self.lastParts;
            for (let i = 0; i < self.lastParts; i++) {
                let buf = buffer_1.Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00]);
                buf.writeUInt32BE(pieceNumber, 0);
                result.push(REQUEST);
                result.push(buf);
                buf.writeUInt32BE(part, 4);
                part += DL_SIZE;
            }
            if (self.leftover) {
                let buf = buffer_1.Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00]);
                buf.writeUInt32BE(pieceNumber, 0);
                buf.writeUInt32BE(part, 4);
                buf.writeUInt32BE(self.leftover, 8);
                result.push(REQUEST);
                result.push(buf);
                count++;
            }
        }
        let resultBuf = buffer_1.Buffer.concat(result);
        cb(resultBuf, count);
    }
    prepareUpload(index, begin, length, cb) {
        this._debug(`prepareUpload with index: ${index}, begin: ${begin}, length: ${length}`);
        const self = this;
        if ((begin * DL_SIZE) + length > self.length || index > self.pieceCount) {
            cb(null);
        }
        let pre = buffer_1.Buffer.from([0x00, 0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00]);
        pre.writeUInt32BE(length + 5, 0);
        pre.writeUInt16BE(index, 5);
        pre.writeUInt16BE(begin, 7);
        let start = (index * self.pieceSize) + (begin * DL_SIZE);
        let piece = new buffer_1.Buffer(length);
        piece.fill(0);
        let pieceOffset = 0;
        self.files.forEach((file) => {
            if (start >= file.offset && start < (file.offset + file.length)) {
                let f = fs_1.openSync(file.path, "r");
                let fileStart = start - file.offset;
                if ((start + length) < (file.offset + file.length)) {
                    fs_1.readSync(f, piece, pieceOffset, length, fileStart);
                }
                else {
                    let newLength = (file.offset + file.length) - start;
                    fs_1.readSync(f, piece, pieceOffset, newLength, fileStart);
                    start += newLength;
                    length -= newLength;
                    pieceOffset += newLength;
                }
            }
        });
        let resultBuf = buffer_1.Buffer.concat([pre, piece]);
        cb(resultBuf);
    }
    pieceIndex(num) {
        return num * this.pieceSize;
    }
    saveBlock(index, buf) {
        this._debug(`Saving block at index: ${index}`);
        const self = this;
        if (buf.length > DL_SIZE) {
            return false;
        }
        self.files.forEach((file) => {
            if ((file.offset <= index) && (index < (file.offset + file.length))) {
                let offset = index - file.offset;
                let bufW = null;
                if ((index + buf.length) > (file.offset + file.length)) {
                    let newBufferLength = buf.length - ((offset + buf.length) - (file.offset + file.length));
                    bufW = buf.slice(0, newBufferLength);
                    buf = buf.slice(newBufferLength);
                    index += newBufferLength;
                }
                let f = fs_1.openSync(file.path, "r+");
                try {
                    if (!bufW) {
                        fs_1.writeSync(f, buf, 0, buf.length, offset);
                    }
                    else {
                        fs_1.writeSync(f, bufW, 0, bufW.length, offset);
                    }
                }
                catch (e) {
                    fs_1.writeFileSync("./debug.txt", "problem writing...");
                    return false;
                }
            }
        });
        return true;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TPH;
