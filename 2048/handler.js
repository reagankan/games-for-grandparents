// user input: keys and touch-swipes
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

var KEYS_LOCKED = false;
function keyDownHandler(e) {
    if (!KEYS_LOCKED) {
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
}

function keyUpHandler(e) {
    if (!KEYS_LOCKED) {
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
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


let touchstartX = 0
let touchendX = 0
let touchstartY = 0
let touchendY = 0
    
function checkDirection() {

    if (!KEYS_LOCKED) {
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

// restart and continue buttons
var restart_button = document.getElementById("restartButton");
restart_button.onclick = function () {
    window.location.href = "2048.html";
};
var continue_button = document.getElementById("continueButton");
continue_button.onclick = function () {
    player_continues = true;
    // reset background color
    document.getElementById("body").style = "background-color: #F5F5DC"
    // re-hide buttons
    restartButton.style.display = "none";
    continueButton.style.display = "none";
    // reset title
    document.getElementById("title").innerHTML = "2048"
    document.getElementById("title").style.color = "black"
    // unlock keys
    KEYS_LOCKED = false;
};
