//global variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
let bird = new Bird(canvas.width, canvas.height);
let pipes = new TwoPipes();
let ground = new Ground();
let background = createImage("imgs/background.png");

function showGameOverPanel(gameOver) {
    if (!gameOver) {
        return;
    }
    let y0 = BLOCK_SIZE * 2;
    let h = BLOCK_SIZE;
    ctx.drawImage(createImage("imgs/game-over.png"), 0, y0, canvas.width, h);
}


// score
var score_element = document.getElementById("score");
var score = 0;
function update_score(pts) {
    score += pts;
    score_element.innerText = "Score: " + Math.ceil(score);
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
        }
    }, 20);

    setInterval(function() {
        let gameOver = bird.getInterval() === null;
        showGameOverPanel(gameOver)
    }, 10)
}
