// 生成圖片02.
const fs = require("fs");
const buf = fs.readFileSync("images/blue_block.png");
console.log("Color Type:", buf[25]); // 0=grayscale, 2=rgb, 3=palette, 4=grayscale+alpha, 6=rgba
