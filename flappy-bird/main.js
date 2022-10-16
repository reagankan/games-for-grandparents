//global variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
let bird = new Bird(canvas.width, canvas.height);
let pipes = new TwoPipes();
let background = new Image();
background.src = "imgs/background.png";

// score
var score_element = document.getElementById("score");
var score = 0;
function update_score(pts) {
    score += pts;
    score = Math.max(0, score);
    score_element.innerText = "Score: " + score;
}

function gameOver(bird, pipes) {
    let birdRect = bird.getCollisionRectangle()
    let pipeRects = pipes.getCollisionRectangles(bird)
    return intersectRect(birdRect, pipeRects.top) || intersectRect(birdRect, pipeRects.bottom)
}

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    bird.update()

    pipes.update()

    // drawRedRect({top:0, left:0, right:canvas.width, bottom:canvas.height})
    // drawBoundaries(bird, pipes)
    if (gameOver(bird, pipes)) {
        pipes.stop()
    }
}

setInterval(main, 20);
