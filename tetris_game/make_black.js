// 生成圖片04.
const fs = require("fs");
const zlib = require("zlib");

// CRC32 implementation
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        if (c & 1) {
            c = 0xedb88320 ^ (c >>> 1);
        } else {
            c = c >>> 1;
        }
    }
    crcTable[n] = c;
}

function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
        crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return crc ^ -1;
}

const inputBuf = fs.readFileSync("images/blue_block.png");

// Extract Header, IHDR, and other chunks until IDAT
const header = inputBuf.slice(0, 8); // PNG signature
let pos = 8;
const chunks = [];
let idatBufs = [];

while (pos < inputBuf.length) {
    const len = inputBuf.readInt32BE(pos);
    const type = inputBuf.slice(pos + 4, pos + 8).toString();
    const data = inputBuf.slice(pos + 8, pos + 8 + len);
    const crc = inputBuf.readInt32BE(pos + 8 + len);
    console.log(`Chunk: ${type}, Length: ${len}, CRC: ${crc.toString(16)}`);

    if (type === "IDAT") {
        idatBufs.push(data);
    } else if (type === "IEND") {
        // We'll add IEND at the end
        break;
    } else {
        chunks.push({ type, data });
    }
    pos += 12 + len;
}

const idat = Buffer.concat(idatBufs);
const decompressed = zlib.inflateSync(idat);

// Modify pixels
// 20x20 RGBA = 20 * (20 * 4 + 1) = 1620 bytes
for (let y = 0; y < 20; y++) {
    const rowStart = y * (20 * 4 + 1);
    const filterType = decompressed[rowStart]; // Keep filter type (0 usually)
    console.log(`Row ${y} filter type: ${filterType}`);
    for (let x = 0; x < 20; x++) {
        const p = rowStart + 1 + x * 4;
        const r = decompressed[p];
        const g = decompressed[p + 1];
        const b = decompressed[p + 2];
        const a = decompressed[p + 3];

        // Convert to grayscale
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        // Scale to a darker range (e.g. 0-100)
        // Original Cyan was around 200-255.
        // We want black with highlight.
        // Let's divide by 4.
        const blackVal = Math.round(gray / 4);

        decompressed[p] = blackVal;
        decompressed[p + 1] = blackVal;
        decompressed[p + 2] = blackVal;
        // Keep alpha
        decompressed[p + 3] = a;
    }
}

const newIdatData = zlib.deflateSync(decompressed);

// Write new PNG
const outChunks = [];
outChunks.push(header);

chunks.forEach(chunk => {
    const b = Buffer.alloc(12 + chunk.data.length);
    b.writeInt32BE(chunk.data.length, 0);
    b.write(chunk.type, 4);
    chunk.data.copy(b, 8);
    b.writeInt32BE(crc32(b.slice(4, 8 + chunk.data.length)), 8 + chunk.data.length);
    outChunks.push(b);
});

// Add new IDAT
const idatChunk = Buffer.alloc(12 + newIdatData.length);
idatChunk.writeInt32BE(newIdatData.length, 0);
idatChunk.write("IDAT", 4);
newIdatData.copy(idatChunk, 8);
idatChunk.writeInt32BE(crc32(idatChunk.slice(4, 8 + newIdatData.length)), 8 + newIdatData.length);
outChunks.push(idatChunk);

// Add IEND
const iend = Buffer.alloc(12);
iend.writeInt32BE(0, 0);
iend.write("IEND", 4);
iend.writeInt32BE(crc32(iend.slice(4, 8)), 8);
outChunks.push(iend);

fs.writeFileSync("images/black_block.png", Buffer.concat(outChunks));
console.log("Successfully created images/black_block.png");
