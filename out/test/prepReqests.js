"use strict";
const test = require("tape");
const torrent_piece_handler_1 = require("../torrent-piece-handler");
const buffer_1 = require("buffer");
const files = [{ path: "Downloads/lol1/1.png",
        name: "1.png",
        length: 255622,
        offset: 0 },
    { path: "Downloads/lol2/2.png",
        name: "2.png",
        length: 1115627,
        offset: 255622 }];
const tph = new torrent_piece_handler_1.default(files, 962416635, 1048576, 918, 872443);
test("Get a prepared block", (t) => {
    t.plan(1);
    let r = tph.prepareRequest(0, (buf, count) => {
        t.equal(64, count, "check the return count");
        t.end();
    });
});
const tph2 = new torrent_piece_handler_1.default(files, 1371249, 16384, 84, 11377);
test("Get a prepared block", (t) => {
    t.plan(2);
    let r = tph2.prepareRequest(0, (buf, count) => {
        t.equal(1, count, "check the return count");
        t.equal(buf.toString("hex"), buffer_1.Buffer.from([0x00, 0x00, 0x00, 0x0d, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00]).toString("hex"), "The buffer is the same");
        t.end();
    });
});
