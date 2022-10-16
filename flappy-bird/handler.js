// user input: keys and touch
var tap = false;
var KEYS_LOCKED = false;
var lastTap = Date.now();
var tapTimeout = 1000; //milliseconds
var speedMultiplier = 1;
var maxMult = 2;
var minMult = 1;

function keyDownHandler(e) {
    // disallow double tap
    // if (e.key ==  " " && (Date.now() - lastTap) > tapTimeout){
    //     tap = true;
    // }

    // speed *= tapTimeout / (timeDelta)
    if (e.key ==  " ") {
        tap = true;
        tapDelta = Date.now() - lastTap
        // tapDelta = Math.min(tapDelta, tapTimeout)
        speedMultiplier = tapTimeout / tapDelta
        speedMultiplier = Math.min(speedMultiplier, maxMult)
        speedMultiplier = Math.max(speedMultiplier, minMult)
    }
}

function keyUpHandler(e) {
    if (e.key ==  " "){
        tap = false;
        lastTap = Date.now();
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener('touchstart', e => {tap=true})
document.addEventListener('touchend', e => {tap=false})
