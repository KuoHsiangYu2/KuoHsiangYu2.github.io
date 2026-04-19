// 生成圖片01.
const fs = require("fs");
const buf = fs.readFileSync("images/blue_block.png");
const width = buf.readInt32BE(16);
const height = buf.readInt32BE(20);
console.log(`Dimensions: ${width}x${height}`);
