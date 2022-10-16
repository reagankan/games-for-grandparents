BLOCK_SIZE = 100
DX = BLOCK_SIZE * 0.05
DY = BLOCK_SIZE * 0.1
HEIGHT_IN_BLOCKS = 12
WIDTH_IN_BLOCKS = 7
WIDTH = WIDTH_IN_BLOCKS * BLOCK_SIZE
HEIGHT = HEIGHT_IN_BLOCKS * BLOCK_SIZE

function randint(min, max) {
	if (arguments.length == 1) {
		return Math.floor(Math.random() * arguments[0])
	}
	let range = max - min
	return min + Math.floor(Math.random() * range)
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function drawRect(rect) {
    let x = rect.left;
    let y = rect.top;
    let w = rect.right - rect.left;
    let h = rect.bottom - rect.top;
    ctx.fillRect(x, y, w, h)
}

function drawRedRect(rect) {
    let oldStyle = ctx.fillStyle;
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    drawRect(rect)
    ctx.fillStyle = oldStyle;
}

function drawGreenRect(rect) {
    let oldStyle = ctx.fillStyle;
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    drawRect(rect)
    ctx.fillStyle = oldStyle;
}

function drawBoundaries(bird, pipes) {
    drawRedRect(bird.getCollisionRectangle());
    let pipeRects = pipes.getCollisionRectangles(bird)
    drawGreenRect(pipeRects.top);
    drawGreenRect(pipeRects.bottom);
}