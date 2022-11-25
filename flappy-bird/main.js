//global variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
let bird = new Bird(canvas.width, canvas.height);
let pipes = new TwoPipes();
let ground = new Ground();
let background = createImage("imgs/background.png");

const digitToImage = new Map();
for (let i = 0; i < 10; i++) {
    digitToImage.set(i, createImage("imgs/" + i.toString() + ".png"));
}

function showGameOverPanel(gameOver) {
    if (!gameOver) {
        return;
    }

    // draw "Game Over" text
    let w = canvas.width;
    let h = BLOCK_SIZE;
    let x = 0;
    let y = BLOCK_SIZE * 3;
    ctx.drawImage(createImage("imgs/game-over.png"), x, y, w, h);

    // draw score card
    w = canvas.width/3;
    h = BLOCK_SIZE * 1.5;
    x = canvas.width/2 - w/2;
    y = BLOCK_SIZE * 5
    ctx.drawImage(createImage("imgs/score-card-2.png"), x, y, w, h);
    drawScore(score, y + BLOCK_SIZE * 0.65, true)

    // draw restart button
    w = canvas.width * 0.4;
    h = BLOCK_SIZE;
    x = canvas.width/2 - w/2;
    y = BLOCK_SIZE * 7
    ctx.drawImage(createImage("imgs/play-button.png"), x, y, w, h);
}


// score
var score = 0;
function update_score(pts) {
    score += pts;
}
function drawScore(score, y=BLOCK_SIZE*2, smallFont=false) {
    const blockSize = smallFont ? BLOCK_SIZE * 0.7 : BLOCK_SIZE
    if (score < 10) {
        let x = canvas.width/2 - blockSize/2;
        drawDigit(score, x, y, blockSize, blockSize)
    } else {
        let digits = [];
        while (score !== 0) {
            digits.push(score % 10);
            score = Math.floor(score / 10);
        }

        let numDigits = digits.length;
        let totalWidth = blockSize * numDigits;
        let digitWidth = totalWidth / numDigits;
        let xBase = canvas.width/2 - totalWidth/2;
        let i = 0;
        while (i < numDigits) {
            let digit = digits.pop();
            let x = xBase + digitWidth * i;
            drawDigit(digit, x, y, digitWidth, blockSize);
            i += 1;
        }
    }
}
function drawDigit(digit, x, y, w, h) {
    ctx.drawImage(digitToImage.get(digit), x, y, w, h);
}


let DEBUG_SCORE = false;
let prevPipeStatus = false;
let currPipeStatus = false;
function keep_score(bird, pipes) {
    let pipeBack = pipes.getClosestPipeBack(bird);
    let pipeFront = pipes.getClosestPipeFront(bird);


    if (DEBUG_SCORE) {
        drawRedRect(pipeBack.getCollisionRectangles().top)
        drawGreenRect(pipeFront.getCollisionRectangles().top)
    }

    currPipeStatus = pipeBack !== pipeFront;
    if (prevPipeStatus !== currPipeStatus) {
        // Using pipeStatus will doublecount the score
        // so add 0.5 points to the score each time
        // and only show the ceiling of the score
        update_score(0.5);
    }
    prevPipeStatus = currPipeStatus;
}

function gameOver(bird, pipes) {
    let birdRect = bird.getCollisionRectangle()
    let pipeRects = pipes.getCollisionRectangles(bird)
    return intersectRect(birdRect, pipeRects.top) || intersectRect(birdRect, pipeRects.bottom)
}


function main() {
    let interval = setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        ground.update()
        pipes.update()
        bird.update()
        keep_score(bird, pipes)

        // drawRedRect({top:0, left:0, right:canvas.width, bottom:canvas.height})
        // drawBoundaries(bird, pipes)
        if (gameOver(bird, pipes)) {
            pipes.stop()
            ground.stop()
            KEYS_LOCKED = true
            bird.setInterval(interval)
        } else {
            drawScore(Math.ceil(score));
        }
    }, 20);

    setInterval(function() {
        let gameOver = bird.getInterval() === null;
        showGameOverPanel(gameOver)
    }, 10)
}
