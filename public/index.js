const gameArea = document.getElementById('game-area');
const ball = document.getElementById('ball');
const paddle = document.getElementById('paddle');
const bricks = document.getElementsByClassName('brick');
const brickCount = bricks.length;

let ballX = 200;
let ballY = 250;
let ballSpeedX = -5;
let ballSpeedY = -5;

let paddleX = 150;
let paddleSpeed = 20;

let score = 0;
let lives = 3;

let gameIsPlaying = false;

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
        // lives--;
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
    }
    // 球碰到磚塊，磚塊消失
    for (let i = 0; i < brickCount; i++) {
        if (ballY <= bricks[i].offsetTop + bricks[i].offsetHeight && ballX + ball.offsetWidth >= bricks[i].offsetLeft && ballX <= bricks[i].offsetLeft + bricks[i].offsetWidth) {
            ballSpeedY = -ballSpeedY;
            bricks[i].style.display = 'none';
            score++;
            // 如果全部磚塊都被擊碎，結束遊戲
            if (score === brickCount) {
                endGame('You win!');
            }
        }
    }

    // 繼續遊戲循環
    requestAnimationFrame(gameLoop);
}

// 結束遊戲函數
const endGame = function (message) {
    // 停止遊戲循環
    cancelAnimationFrame(gameLoop);
    // 顯示遊戲結束訊息
    alert(message);
    // 重新載入頁面
    location.reload();
}

// 開始遊戲循
const startGame = function () {
    // 隱藏提示文字
    const startMessage = document.getElementById('start-message');
    startMessage.style.display = 'none';
    gameIsPlaying = true;
    gameLoop();
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !gameIsPlaying) {
        startGame();
    }
});
