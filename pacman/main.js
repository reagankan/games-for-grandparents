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

var pacman_files = new Map([[dir.NONE, "pacman-right.png"],
                            [dir.RIGHT, "pacman-right.png"],
                            [dir.LEFT, "pacman-left.png"],
                            [dir.UP, "pacman-up.png"],
                            [dir.DOWN, "pacman-down.png"]]);

//debug variables
var debug = false;
img_path = "pacman/imgs/pacman.png";
if (debug) {
    img_path = "imgs/pacman.png"
}

//========Movement========
class GameObject extends Image {
    constructor(srcs, h=PIX_PER_TILE, w=PIX_PER_TILE, s=speed, d=dir.NONE) {
        super();
        super.src = "imgs/" + srcs.get(d);
        this.srcs = srcs;
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
    setSrc() {
        super.src = "imgs/" + this.srcs.get(this.d);
    }
    getAngle() {
        return 0;
        switch (this.d) {
            case dir.UP:
                return -Math.PI/2;
            case dir.DOWN:
                return Math.PI/2;
            case dir.LEFT:
                return Math.PI;
            default:
                return 0;
        }
    }
}

//Movement/KBInput
var allowedKeys = new Map([["w", dir.UP], ["a", dir.LEFT], ["s", dir.DOWN], ["d", dir.RIGHT],
                            ["ArrowUp", dir.UP], ["ArrowDown", dir.DOWN],
                            ["ArrowLeft", dir.LEFT], ["ArrowRight", dir.RIGHT]]);
class ControlledGameObject extends GameObject {
    //separate from Pacman
    //==> incase we want 2 pacmans
    constructor(srcs=pacman_files) {
        super(srcs);
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
    IDEA:
    a. bijection pixel location to r,c coordinate
    b. use r,c to index into grid[r][c] = entity.
    c. update every few frames. use grid to make logic decisions? or use pixels??
    d. figure out way to tune speed and updates

    Track
    stop_point(Direction) = (r,c) 

    2. blue ghosts
    3. collision detection and gameOver()
    4. figure out image path
*/

class Pacman extends ControlledGameObject {
    constructor(srcs=pacman_files) {
        super(srcs);
    }
}
var pacman = new Pacman();
// alert(pacman.X);
document.addEventListener('keydown', pacman, false);
//========end of experiments========


//game control flow
function gameOver() {
    return false;
}

//frontend helper methods
function draw(obj) {
    obj.setSrc();
    ctx.drawImage(obj, obj.X, obj.Y, obj.w, obj.h);
    obj.move();
}

//main loop
function main() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
      
      draw(pacman);

      if (!gameOver()) requestAnimationFrame(main)        // loop
}