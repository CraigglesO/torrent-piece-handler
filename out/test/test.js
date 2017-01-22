"use strict";
const fs = require("fs");
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
let one = fs.readFileSync("1.png");
let two = fs.readFileSync("2.png");
const tph = new torrent_piece_handler_1.default(files, 962416635, 1048576, 918, 872443);
test("Saving files", (t) => {
    t.plan(3);
    let r = one;
    let x = tph.saveBlock(0, r);
    t.true(x, "One buffer, two files");
    r = one.slice(255572);
    let s = two.slice(0, 30);
    let result = buffer_1.Buffer.concat([r, s]);
    x = tph.saveBlock(255572, result);
    t.true(x, "One buffer, one file");
    r = new buffer_1.Buffer(2048576);
    x = tph.saveBlock(0, r);
    t.false(x, "Pass in a buffer too large");
    t.end();
});
