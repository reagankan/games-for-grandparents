//global variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var speed = 1;
const dir = {
    UP : [0, -1],
    DOWN :[0, 1],
    LEFT :[-1, 0],
    RIGHT : [1, 0],
    NONE : [0, 0]
}

//debug variables
var debug = false;
img_path = "pacman/imgs/pacman.png";
if (debug) {
    img_path = "imgs/pacman.png"
}

//========Movement========
class GameObject extends Image {
    constructor(src="imgs/pacman.png", h=100, w=100, s=speed, d=dir.NONE) {
        super();
        super.src = src;
        this.h = h;
        this.w = w;
        this.X = 0;
        this.Y = 0;
        this.d = d;
        this.s = s;
    }
    move() {
        this.X += this.s * this.d[0];
        this.Y += this.s * this.d[1];
    }
}

//Movement/KBInput
var allowedKeys = new Map([["w", dir.UP], ["a", dir.LEFT], ["s", dir.DOWN], ["d", dir.RIGHT],
                            ["ArrowUp", dir.UP], ["ArrowDown", dir.DOWN],
                            ["ArrowLeft", dir.LEFT], ["ArrowRight", dir.RIGHT]]);
class ControlledGameObject extends GameObject {
    constructor() {
        super();
    }
    handleEvent(event) {
        let key = event.key;
        if (allowedKeys.has(key)) {
            super.d = allowedKeys.get(key);
        }
    }
}
//========end of movement========


//========experiment========
/*
    TODOS
    1. keep pacman in "tracks"
    2. blue ghosts
    3. collision detection and gameOver()
*/
class Pacman extends ControlledGameObject {
    constructor() {
        super();
    }
}
var pacman = new Pacman();
document.addEventListener('keydown', pacman, false);
//========end of experiments========


//game control flow
function gameOver() {
    return false;
}

//frontend helper methods
function draw(obj) {
    ctx.drawImage(obj, obj.X, obj.Y, obj.w, obj.h);
    obj.move();
}

//main loop
function main() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
      
      draw(pacman);

      if (!gameOver()) requestAnimationFrame(main)        // loop
}