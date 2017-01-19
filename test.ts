var Buffer = require('buffer').Buffer;
import * as fs from 'fs';
import TPH from './torrent-piece-handler';

// Total length of torrent: 962416635
// Size of each piece:      1048576
// Number of pieces:        918
// Last piece size:         872443

const files = [ { path: 'Downloads/lol1/1.png',
           name: '1.png',
           length: 255622,
           offset: 0 },
         { path: 'Downloads/lol2/2.png',
           name: '2.png',
           length: 1115627,
           offset: 255622 } ]


//PREP:
// fs.writeFileSync('Downloads/lol1/1.png', one);
// fs.writeFileSync('Downloads/lol2/2.png', two);

let one = fs.readFileSync('./1.png');

let two = fs.readFileSync('./2.png');


let r = one.slice(255572);

let s = two.slice(0, 30);

let result = Buffer.concat([r,s]);

const tph = new TPH(files, 962416635, 1048576, 918, 872443);

let x = tph.saveBlock(255572, result);
console.log(x);
