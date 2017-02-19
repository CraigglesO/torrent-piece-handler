# torrent-piece-handler [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/CraigglesO/torrent-piece-handler.svg)](https://greenkeeper.io/)

[travis-image]: https://travis-ci.org/CraigglesO/torrent-piece-handler.svg?branch=master
[travis-url]: https://travis-ci.org/CraigglesO/torrent-piece-handler
[npm-image]: https://img.shields.io/npm/v/torrent-piece-handler.svg
[npm-url]: https://npmjs.org/package/torrent-piece-handler
[downloads-image]: https://img.shields.io/npm/dm/torrent-piece-handler.svg
[downloads-url]: https://npmjs.org/package/torrent-piece-handler

### Torrents have different pieces sizes. This will manage those differences

Quickly and easily prep for downloads without polluting your code.

Most Bittorent protocols only allow 16kb requests. As such we have to bundle requests if block sizes are too large.

Features:
* Handles all the parts to each piece
* Last piece size is handled as well
* Gives you the number of parts in the piece request so you can track incoming parts.
* One command is all it takes.

NEW:
* Save blocks to their proper files
* Now a callback response when finding new pieces
* read blocks to upload to another peer

## Install

``` typescript
npm install torrent-piece-handler
```

## Usage

Assuming we have torrent metadata:
``` typescript
const files = [ { path: 'Downloads/lol1/1.png',
           name: '1.png',
           length: 255622,
           offset: 0 },
         { path: 'Downloads/lol2/2.png',
           name: '2.png',
           length: 1115627,
           offset: 255622 } ]
```


``` typescript
import TPH from 'torrent-piece-handler';


// Total length of torrent: 962416635
// Size of each piece:      1048576
// Number of pieces:        918
// Last piece size:         872443

const tph = new TPH(files, 962416635, 1048576, 918, 872443);

```

prepareRequest(pieceNumber: number, cb: Function)
  * pieceNumber: which hash piece (e.g. 0,1,2,3,4,...)
  * cb: Function, returns a buffer and the number of requests bundled in the buffer

``` typescript
// First piece:
let r = tph.prepareRequest(0, (buf: Buffer, count: number) => {

  });
count // -> 64

buf ->
// Prior to concat it looks like this:
// [ <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 00 00 00 00 00 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 00 00 00 00 40 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 00 00 00 00 80 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 00 00 00 00 c0 00 00 00 40 00>,
//  ...
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 00 00 00 0f 40 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 00 00 00 0f 80 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 00 00 00 0f c0 00 00 00 40 00> ]



// Last piece:
let r2 = tph.prepareRequest(917, (buf: Buffer, count: number) => {

  });
count // -> 54

buf ->
// Prior to concat it looks like this:
// [ <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 03 95 00 00 00 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 03 95 00 00 40 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 03 95 00 00 80 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 03 95 00 00 c0 00 00 00 40 00>,
// ...
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 03 95 00 0c c0 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 03 95 00 0d 00 00 00 00 40 00>,
// <Buffer 00 00 00 0d 06>,
// <Buffer 00 00 03 95 00 0d 40 00 00 00 0f fb> ]

```

If you want to read from a file:

prepareUpload(index: number, begin: number, length: number, cb: Function)
  * index: which hash piece (e.g. 0,1,2,3,4,...)
  * begin: which part of the piece (e.g. 0,1,2,3,4,...)
  * length: piece request size: (e.g. 16,384)

  ``` typescript

tph.prepareUpload(16, 0, 16384, (up) => {
  // up -> Buffer
})
  ```

If you want to save a block to a file:

saveBlock(index: number, buf: buffer)
  * index: The first parameter is the index at which to start writing
  * buf: The buffer is what you are writing

NOTE:

```If you have multiple files, it will automatically write to the next file if the buffer is too large for the first.```

``` typescript

let y = new Buffer(4000);
let x = tph.saveBlock(255572, y);

// x -> true
// false if failed.
```

## ISC License (Open Source Initiative)

ISC License (ISC)
Copyright <2017> <Craig OConnor>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
