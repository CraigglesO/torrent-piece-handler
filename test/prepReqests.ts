import * as fs from "fs";
import * as test from "tape";
import TPH from "../torrent-piece-handler";
import { Buffer } from "buffer";

// Total length of torrent: 962416635
// Size of each piece:      1048576
// Number of pieces:        918
// Last piece size:         872443

const files = [ { path: "Downloads/lol1/1.png",
           name: "1.png",
           length: 255622,
           offset: 0 },
         { path: "Downloads/lol2/2.png",
           name: "2.png",
           length: 1115627,
           offset: 255622 } ];

const tph = new TPH(files, 962416635, 1048576, 918, 872443);

test("Get a prepared block", (t) => {
  t.plan(1);

  // 1048576 / 16384 = 64
  let r = tph.prepareRequest(0, (buf: Buffer, count: number) => {
    t.equal(64, count, 'check the return count');

    t.end();
  });

});

const tph2 = new TPH(files, 1371249, 16384, 84, 11377);

test("Get a prepared block", (t) => {
  t.plan(2);

  // 16384 / 16384 = 1
  let r = tph2.prepareRequest(0, (buf: Buffer, count: number) => {
    t.equal(1, count, 'check the return count');

    t.equal(buf.toString('hex'), Buffer.from([0x00, 0x00, 0x00, 0x0d, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00]).toString('hex'), 'The buffer is the same');

    t.end();
  });

});



// test('pulling from files', (t) => {
//   t.plan(2);
// });
