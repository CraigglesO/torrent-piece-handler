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
const tph = new torrent_piece_handler_1.default(files, 1371249, 16384, 84, 11377);
test("Upload Block", (t) => {
    t.plan(2);
    let filePiece = one.slice(0, 16384);
    tph.prepareUpload(0, 0, 16384, (up) => {
        t.equal(up.slice(0, 9).toString("hex"), buffer_1.Buffer.from([0x00, 0x00, 0x40, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00]).toString("hex"));
        t.equal(up.slice(9).toString("hex"), filePiece.toString("hex"), "check the block");
        t.end();
    });
});
test("Upload from two files", (t) => {
    t.plan(2);
    let o = one.slice(245760);
    let w = two.slice(0, 6522);
    let r = buffer_1.Buffer.concat([o, w]);
    tph.prepareUpload(15, 0, 16384, (up) => {
        t.equal(up.slice(0, 9).toString("hex"), buffer_1.Buffer.from([0x00, 0x00, 0x40, 0x00, 0x07, 0x00, 0x0f, 0x00, 0x00]).toString("hex"));
        t.equal(up.slice(9).toString("hex"), r.toString("hex"), "check the block");
        t.end();
    });
});
test("Upload from a piece inside file 2", (t) => {
    t.plan(2);
    let r = two.slice(6522, 16384 + 6522);
    tph.prepareUpload(16, 0, 16384, (up) => {
        t.equal(up.slice(0, 9).toString("hex"), buffer_1.Buffer.from([0x00, 0x00, 0x40, 0x00, 0x07, 0x00, 0x10, 0x00, 0x00]).toString("hex"));
        t.equal(up.slice(9).toString("hex"), r.toString("hex"), "check the block");
        t.end();
    });
});
