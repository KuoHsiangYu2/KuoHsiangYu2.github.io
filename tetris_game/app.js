console.log("測試 app.js start");

const grid = document.querySelector("#grid");
const miniGrid = document.querySelector("#mini-grid");

// 初始化 遊戲生成的格子.
function initGrid() {
    // 初始化 生出 200個 div.
    for (let i = 0; i < 200; i++) {
        grid.append(document.createElement("div"));
    }

    // 製作底部.
    for (let i = 0; i < 10; i++) {
        const div = document.createElement("div");
        div.classList.add("taken");
        grid.append(div);
    }

    for (let i = 0; i < 16; i++) {
        miniGrid.append(document.createElement("div"));
    }
}
initGrid();

// 洗牌函數，打亂陣列順序，避免同一個骨牌永遠都是相同的顏色.
function shuffle(array) {
    // 從最後一個元素往前.
    for (let i = array.length - 1; i > 0; i--) {
        // 隨機選一個 0 ~ i 的索引.
        const j = Math.floor(Math.random() * (i + 1));
        // 交換 array[i] 跟 array[j].
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let squares = Array.from(document.querySelectorAll(".grid div"));
let score = 0;
// const GRID_WIDTH = 10;
const width = 10;
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");
let nextRandom = 0;

// make the tetromino move down every second.
// let timerId = setInterval(moveDown, 1000);
let timerId = null;

const colors = [
    "url(images/blue_block.png)",
    "url(images/pink_block.png)",
    "url(images/purple_block.png)",
    "url(images/peach_block.png)",
    "url(images/yellow_block.png)"
];

// console.log("squares：");
// console.log(squares);


// ⚫⚫
// ⚫⚪
// ⚫⚪
// 【0】
// 需要處理跨邊界的問題，因為 l Tetromino 旋轉後會跨越邊界。.
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];


// ⚫⚪
// ⚫⚫
// ⚪⚫
// 【1】
// 需要處理跨邊界的問題，因為 z Tetromino 旋轉後會跨越邊界。.
const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [1, width, width + 1, width * 2],
    [width + 0, width + 1, width * 2 + 1, width * 2 + 2]
];


// ⚪⚫⚪
// ⚫⚫⚫
// 【2】
// 需要處理跨邊界的問題，因為 t Tetromino 旋轉後會跨越邊界。.
const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];


// ⚫⚫
// ⚫⚫
// 【3】
const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];


// ⚫
// ⚫
// ⚫
// ⚫
// 【4】
// 需要處理跨邊界的問題，因為 i Tetromino 旋轉後會跨越邊界。.
// 【直立狀態】要特別處理在右邊 邊界 空一格也要禁止旋轉.
const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
let currentPosition = 4;
let currentRotation = 0;

// randomly select a Tetromino and its first rotation.
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

// show up-next tetromino in mini-grid display.
const displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
let displayIndex = 0;

// the Tetrominos without rotations.
const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l Tetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z Tetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // t Tetromino
    [0, 1, displayWidth, displayWidth + 1], // o Tetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // i Tetromino
];

// startBtn.
// 開始/暫停 按鈕.
startBtn.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
    }
});


// display the shape in the mini-grid.
function displayShape() {

    // remove any trace of a tetromino from entire grid.
    displaySquares.forEach((square) => {
        square.classList.remove("tetromino");
        square.style.backgroundImage = "none";
    });

    upNextTetrominoes[nextRandom].forEach((index) => {
        displaySquares[displayIndex + index].classList.add("tetromino");
        displaySquares[displayIndex + index].style.backgroundImage = "url(images/black_block.png)";
    });
}

// console.log("current：");
// console.log(theTetrominoes[random]);

// console.log("theTetrominoes：");
// console.log(theTetrominoes);

// draw the Tetromino.
function draw() {
    current.forEach((index) => {
        squares[currentPosition + index].classList.add("tetromino");
        squares[currentPosition + index].style.backgroundImage = colors[random];
    });
}

// undraw the Tetromino.
function undraw() {
    current.forEach((index) => {
        squares[currentPosition + index].classList.remove("tetromino");
        squares[currentPosition + index].style.backgroundImage = "none";
    });
}

// move down function.
function moveDown() {
    undraw();
    currentPosition = currentPosition + width;
    draw();
    freeze();
}

// move the tetromino left, unless is at the edge or there is a blockage.
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some((index) => ((currentPosition + index) % width === 0));

    if (!isAtLeftEdge) {
        console.log(" " + (new Date()).getTime() + " 左邊 $1：");
        currentPosition = currentPosition - 1;
    }

    const isCollisionTaken = current.some((index) => (squares[currentPosition + index].classList.contains("taken")));
    if (isCollisionTaken) {
        console.log(" " + (new Date()).getTime() + " 左邊 $2：");
        // 如果太靠左邊就往逆向返回右邊.
        currentPosition = currentPosition + 1;
    }

    draw();
}

// move the tetromino right, unless is at the edge or there is a blockage.
function moveRight() {
    undraw();
    const isAtRightEdge = current.some((index) => ((currentPosition + index) % width === (width - 1)));

    if (!isAtRightEdge) {
        console.log(" " + (new Date()).getTime() + " 右邊 $1：");
        currentPosition = currentPosition + 1;
    }

    const isCollisionTaken = current.some((index) => (squares[currentPosition + index].classList.contains("taken")));
    if (isCollisionTaken) {
        console.log(" " + (new Date()).getTime() + " 右邊 $2：");
        // 如果太靠右邊就往逆向返回左邊.
        currentPosition = currentPosition - 1;
    }

    draw();
}

// rotate the tetromino.
// 旋轉方塊.
function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === theTetrominoes[random].length) {
        // if the current rotation gets to 4.
        // make it go bback to 0.
        currentRotation = 0;
    }
    console.log(" " + (new Date()).getTime() + " _random：", random);

    // (new Date()).getTime()
    const isAtRightEdge = current.some((index) => ((currentPosition + index) % width === (width - 1)));
    const isAtLeftEdge = current.some((index) => ((currentPosition + index) % width === 0));
    console.log(" " + (new Date()).getTime() + " _isAtRightEdge：", isAtRightEdge);
    console.log(" " + (new Date()).getTime() + " _isAtLeftEdge：", isAtLeftEdge);
    console.log(" " + (new Date()).getTime() + " _右邊界空一格：", current.some((index) => ((currentPosition + index) % width === (width - 2))));

    // iTetromino 距離 右邊邊界 還有一格空間時 為 true .
    const isITetrominoRightEdgeEmpty = current.some((index) => ((currentPosition + index) % width === (width - 2)));
    if (isAtRightEdge || isAtLeftEdge) {
        console.log(" " + (new Date()).getTime() + " _碰到 左邊界、右邊界 旋轉被阻擋：");
    } else if (random === 4 && isITetrominoRightEdgeEmpty && (currentRotation === 1 || currentRotation === 3)) {
        console.log(" " + (new Date()).getTime() + " _直立 的 iTetromino 右邊界空一格，旋轉被阻擋：");
    } else {
        current = theTetrominoes[random][currentRotation];
    }
    draw();
}



const KEY_LEFT = 37; // 左.
const KEY_UP = 38; // 上.
const KEY_RIGHT = 39; // 右.
const KEY_DOWN = 40; // 下.
// const KEY_ROTATE = 32; // space bar.

// assign function to keyCodes.
// 監聽鍵盤事件 上 下 左 右 按鍵 操縱 tetromino方塊.
function control(e) {
    if (e.keyCode === KEY_LEFT) {
        moveLeft();
    } else if (e.keyCode === KEY_UP) {
        rotate();
    } else if (e.keyCode === KEY_RIGHT) {
        moveRight();
    } else if (e.keyCode === KEY_DOWN) {
        moveDown();
    }
}
// document.addEventListener("keyup", control);
document.addEventListener("keydown", control);

// add score.
function addScore() {
    for (let i = 0; i < 199; i = i + width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

        const isTakenLine = row.every((index) => (squares[index].classList.contains("taken")));
        if (isTakenLine) {
            score = score + 10;
            scoreDisplay.innerHTML = score;
            row.forEach((index) => {
                squares[index].classList.remove("taken");
                squares[index].classList.remove("tetromino");
                squares[index].style.backgroundImage = "none";
            });
            const squaresRemoved = squares.splice(i, width);
            // console.log("squaresRemoved");
            // console.log(squaresRemoved);
            squares = squaresRemoved.concat(squares);
            squares.forEach((cell) => (grid.appendChild(cell)));
        }
    }
}

// game over.
function gameOver() {
    const isGameOver = current.some((index) => squares[currentPosition + index].classList.contains("taken"));
    if (isGameOver) {
        scoreDisplay.innerHTML = "end";
        clearInterval(timerId);
    }
}

// freeze function. 當 tetromino 到達底部或碰到其他已放置的方塊時 停止它.
function freeze() {
    const isFreeze = current.some((index) => (squares[currentPosition + index + width].classList.contains("taken")));
    if (isFreeze) {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add("taken");
        });

        // start a new tetromino falling.
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;

        // 打亂陣列順序，避免同一個骨牌永遠都是相同的顏色.
        shuffle(colors);

        draw();
        displayShape();
        addScore();
        gameOver();
    }
}
freeze();

console.log("測試 app.js end");