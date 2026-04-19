// 生成圖片03.
const fs = require("fs");
const zlib = require("zlib");

const buf = fs.readFileSync("images/blue_block.png");
// Find IDAT chunk
let pos = 8;
let idatBufs = [];
while (pos < buf.length) {
    const len = buf.readInt32BE(pos);
    const type = buf.slice(pos + 4, pos + 8).toString();
    if (type === "IDAT") {
        idatBufs.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
}

const idat = Buffer.concat(idatBufs);
const decompressed = zlib.inflateSync(idat);
console.log("Decompressed length:", decompressed.length);
// For 20x20 RGBA, it should be 20 * (20 * 4 + 1) = 20 * 81 = 1620 bytes.

// Let's print some sample pixels (r, g, b, a)
// Scanline 0 (first row)
console.log("First scanline pixels (first 5):");
for (let i = 0; i < 5; i++) {
    const start = 1 + i * 4;
    console.log(`[${decompressed[start]}, ${decompressed[start+1]}, ${decompressed[start+2]}, ${decompressed[start+3]}]`);
}

// Middle scanline (row 10)
const row10Start = 10 * (20 * 4 + 1);
console.log("Row 10 pixels (first 5):");
for (let i = 0; i < 5; i++) {
    const start = row10Start + 1 + i * 4;
    console.log(`[${decompressed[start]}, ${decompressed[start+1]}, ${decompressed[start+2]}, ${decompressed[start+3]}]`);
}
