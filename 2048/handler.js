var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

function turn_off_keys() {
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


let touchstartX = 0
let touchendX = 0
let touchstartY = 0
let touchendY = 0
    
function checkDirection() {
    let diffX = Math.abs(touchstartX - touchendX)
    let diffY = Math.abs(touchstartY - touchendY)

    if (diffX > diffY) {
        if (touchendX < touchstartX) {
            leftPressed = true;
            // alert('swiped left! '+ diffX)
        }
        if (touchendX > touchstartX) {
            rightPressed = true;
            // alert('swiped right! '+ diffX)
        }
    } else {
        if (touchendY < touchstartY) {
            upPressed = true;
            // alert('swiped up! '+ diffY)
        }
        if (touchendY > touchstartY) {
            downPressed = true;
            // alert('swiped down! '+ diffY)
        }
    }
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
  touchstartY = e.changedTouches[0].screenY
})
document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  touchendY = e.changedTouches[0].screenY
  checkDirection()
})