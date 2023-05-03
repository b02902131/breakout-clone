const gameArea = document.getElementById('game-area');
const ball = document.getElementById('ball');
const paddle = document.getElementById('paddle');
const bricks = document.getElementsByClassName('brick');
const messageDiv = document.getElementById("message");
const brickCount = bricks.length;

let ballX = 200;
let ballY = 250;
let ballSpeedX = -5;
let ballSpeedY = -5;

let paddleX = 150;
let paddleSpeed = 20;

let score = 0;
let lives = 3;
let brickBreakCount = 0;

let gameIsPlaying = false;
let gameIsEnd = false;
let gameLoopAnimationId;

// 取得遊戲區域的寬度和高度
const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

// 設置球的初始位置
ball.style.left = ballX + 'px';
ball.style.top = ballY + 'px';

// 設置板子的初始位置
paddle.style.left = paddleX + 'px';

// 設置磚塊的位置
for (let i = 0; i < brickCount; i++) {
    bricks[i].style.top = parseInt(bricks[i].style.top) + 'px';
    bricks[i].style.left = parseInt(bricks[i].style.left) + 'px';
}

// 監聽鍵盤事件，控制板子的移動
document.addEventListener('keydown', function (event) {
    if (event.code === 'ArrowLeft') {
        paddleX -= paddleSpeed;
        if (paddleX < 0) {
            paddleX = 0;
        }
        paddle.style.left = paddleX + 'px';
    } else if (event.code === 'ArrowRight') {
        paddleX += paddleSpeed;
        if (paddleX > gameAreaWidth - paddle.offsetWidth) {
            paddleX = gameAreaWidth - paddle.offsetWidth;
        }
        paddle.style.left = paddleX + 'px';
    }
});

// 遊戲循環函數
const gameLoop = function () {
    // 更新球的位置
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // 碰到左右邊界，改變方向
    if (ballX < 0 || ballX > gameAreaWidth - ball.offsetWidth) {
        ballSpeedX = -ballSpeedX;
    }
    // 碰到上邊界，改變方向
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    // 碰到板子，改變方向
    if (ballY + ball.offsetHeight >= paddle.offsetTop && ballX + ball.offsetWidth >= paddle.offsetLeft && ballX <= paddle.offsetLeft + paddle.offsetWidth) {
        ballSpeedY = -ballSpeedY;
        // 如果全部磚塊都被擊碎，結束遊戲
        if (score === brickCount) {
            endGame('You win!');
        }
    }
    // 超出底部邊界，扣一條命
    if (ballY > gameAreaHeight - ball.offsetHeight) {
        handleMiss();
    }
    // 球碰到磚塊，磚塊消失
    for (let i = 0; i < brickCount; i++) {
        if (ballY <= bricks[i].offsetTop + bricks[i].offsetHeight && ballX + ball.offsetWidth >= bricks[i].offsetLeft && ballX <= bricks[i].offsetLeft + bricks[i].offsetWidth) {
            handleCollision(bricks[i]);
        }
    }

    // 繼續遊戲循環
    if (!gameIsEnd && gameIsPlaying) {
        gameLoopAnimationId = requestAnimationFrame(gameLoop);
    }
}

// 結束遊戲函數
const endGame = function (message) {
    console.log(message);
    gameIsEnd = true;
    // 顯示遊戲結束訊息
    showMessage(`${message}\nPress Space to restart`);
}

const showMessage = function (message) {
    console.log(message);
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = message;
}

const hideMessage = function () {
    messageDiv.style.display = 'none';
}

// 開始遊戲循
const startGame = function () {
    // 隱藏提示文字
    hideMessage()
    gameIsPlaying = true;
    gameLoop();
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !gameIsPlaying) {
        startGame();
    } else if (event.code === 'Space' && gameIsEnd) {
        location.reload();
    }
});

// == score and lives ==
const livesElement = document.getElementById('lives');
const scoreElement = document.getElementById('score');

const updateLives = function () {
    livesElement.innerHTML = `Lives: ${lives}`;
}

const updateScore = function () {
    scoreElement.innerHTML = `Score: ${score}`;
}

// 初始化時更新元素
updateLives();
updateScore();

const handleCollision = function (brick) {
    // 撞到磚塊時的處理邏輯
    ballSpeedY = -ballSpeedY;
    brick.style.display = 'none';
    score += 10;
    brickBreakCount += 1;
    // 如果全部磚塊都被擊碎，結束遊戲
    if (brickBreakCount === brickCount) {
        endGame('You win!');
    }
    // 獲得10分
    updateScore();
}

const handleMiss = function () {
    // 沒有接到球時的處理邏輯
    // 失去一條生命
    lives -= 1;
    // 如果沒有命了，結束遊戲
    if (lives === 0) {
        endGame('Game over!');
    } else {
        ballX = 200;
        ballY = 250;
        ballSpeedX = 5;
        ballSpeedY = 5;
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }
    updateLives();
}

