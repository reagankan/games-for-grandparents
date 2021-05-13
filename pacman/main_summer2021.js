//global variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
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
function output(s) {
    document.getElementById("difficulty").innerHTML = s;
}
function appendOutput(s) {
    document.getElementById("difficulty").innerHTML += s;
}
// document.addEventListener('keydown', pacman, false);
// document.addEventListener('keydown', pacman1, false);
// document.addEventListener('keydown', pacman2, false);
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

function drawWalls() {
    ctx.fillStyle = 'darkblue';
    for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
            if (gridPoints[r][c].wall) {
                let pix = coor2Pix(r, c);
                let x = pix[0];
                let y = pix[1];
                ctx.fillRect(x, y, PIX_PER_TILE, PIX_PER_TILE);
                // ctx.strokeRect(x, y, PIX_PER_TILE, PIX_PER_TILE);
            }
        }
    }
}
//========Movement========
class GameObject extends Image {

    constructor(srcs, h, w, r, c, s, d, t, tr, tc) {
        super();
        super.src = "imgs/" + srcs.get(d);
        this.srcs = srcs;
        this.h = h;
        this.w = w;

        //coordinates, row, col
        this.r = r;
        this.c = c;


        //pixels, x, y
        let pix = coor2Pix(this.r, this.c);
        this.X = pix[0];//[1];
        this.Y = pix[1];//[1];
        this.oldX = NaN;
        this.oldY = NaN;
 
        this.d = d; //direction
        this.temp_d = d;
        this.s = s; //speed
        // this.t = t; //track

        // Target Coords (R, C)
        // this.tr = tr;
        // this.tc = tc;

        this.updateTarget()

        // find track that Pacman is on. Use R,C and test for closest track
        this.t = getClosestTrack(r, c, all_tracks)
        let msg = "pacman starting track: " + this.t.toString()
        // alert(msg);
    }

    updateTarget() {
        //dir2coor2target is a global variable
        let temp = dir2coor2target[this.d][[this.r, this.c]]
        // console.log("pacman dir")
        // console.log(this.d)
        // console.log("pacman coord")
        // console.log([this.r, this.c])

        if (temp === undefined) {
            // TODO: fix this case
            return
        }

        this.tr = temp[0]
        this.tc = temp[1]
        temp = coor2Pix(this.tr, this.tc);
        this.tX = temp[0];
        this.tY = temp[1];
    }

    updateCoor() {
        let coor = pix2Coor(this.X, this.Y);
        this.r = coor[0];
        this.c = coor[1];
        // let out1 = "(" + this.r.toString(10) + ", " + this.c.toString(10) + ")";
        // let out2 = "(null, null)";
        // if (test_sp.has(this.d)) {
        //     let stopCoor = test_sp.get(this.d);
        //     let stopR = stopCoor[0];
        //     let stopC = stopCoor[1];
        //     out2 = "(" + stopR.toString(10) + ", " + stopC.toString(10) + ")"
        // }
        

        // output(out1 + "-->" + out2);
    }

    checkForStop() {
        
        this.updateCoor();

        // check for stop condition
        let stop = false;
        switch (this.d) {
            case dir.UP:
                stop = (this.Y <= this.tY)
                break;
            case dir.DOWN:
                stop = (this.Y >= this.tY)
                break;
            case dir.LEFT:
                stop = (this.X <= this.tX)
                break;
            case dir.RIGHT:
                stop = (this.X >= this.tX)
                break;
            case dir.NONE:
                // TODO: depends on keystroke
                break;
            default:
                break;
        }

        if (stop) {
            this.d = dir.NONE;
            this.X = this.tX;
            this.Y = this.tY;
        }
        
    }

    move() {    

        this.oldX = this.X;
        this.oldY = this.Y;

        this.checkForStop();
        this.X += this.s * this.d[0];
        this.Y += this.s * this.d[1];

    }
    // shouldStop() {
    //     //TODO: check Track bounds.
    //     //1. get currR and currC
    //     //2. compare with this.t.stop_point
    //     let stopCoor = this.t.stop_point[this.d];
    //     if (self.r == stopCoor[0] && self.c == stopCoor[1]) {
    //         self.d = dir.NONE;
    //         return true;
    //     }
    //     return false;
    // }
    setSrc() {
        super.src = "imgs/" + this.srcs.get(this.d);
    }
    // getAngle() {
    //     return 0;
    //     switch (this.d) {
    //         case dir.UP:
    //             return -Math.PI/2;
    //         case dir.DOWN:
    //             return Math.PI/2;
    //         case dir.LEFT:
    //             return Math.PI;
    //         default:
    //             return 0;
    //     }
    // }
}

//Movement/KBInput
var allowedKeys = new Map([["w", dir.UP], ["a", dir.LEFT], ["s", dir.DOWN], ["d", dir.RIGHT],
                            ["ArrowUp", dir.UP], ["ArrowDown", dir.DOWN],
                            ["ArrowLeft", dir.LEFT], ["ArrowRight", dir.RIGHT]]);
class Pacman extends GameObject {
    constructor(srcs=pacman_files, h=PIX_PER_TILE, w=PIX_PER_TILE,
                r=STARTR, c=STARTC, s=SPEED, d=dir.NONE, t=test_track, tr, tc) {
        super(srcs, h, w, r, c, s, d, t, tr, tc);
        this.cp = new Array([0, 0]);

        this.turn = false;
        this.moving = false;
        this.skip = 0;
        this.SKIP_TIME = 100;
        this.turn_initiated = false;
        // alert(this.t);
    }
    move() {
        //this is called every frame
        // this.updateDir();
        super.move();
        // this.updateClosestPoint();




        // var parent = super.getX().toString(10) + ", " + super.getY().toString(10);
        // var child = this.X.toString(10) + ", " + this.Y.toString(10);
        // var parent = super.getD() + ", " + super.getTempD();
        // var parent = "";
        // var child = this.d + ", " + this.temp_d;
        var msg = "Pix (" + this.X + ", " + this.Y + ")";
        msg += "</br>";

        msg += "Coor ("+ this.r + ", " + this.c + ")";
        msg += "</br>";

        msg += "Target Coor ("+ super.tr + ", " + super.tc + ")";
        msg += "</br>";

        // var targetPix = coor2Pix(this.r, this.c);
        // msg += "coor2Pix ("+ targetPix[0] + ", " + targetPix[0] + ")";
        // msg += "</br>";

        msg += "CP ("+ this.cp[0] + ", " + this.cp[1] + ")";
        msg += "</br>";

        var dd = dist(this.cp, [this.r, this.c]);
        msg += "dist: " + dd.toString(10) + "</br>";

        /*msg += "moving: " + this.moving;
        msg += "</br>";

        msg += "cp is stop tile: " + this.t.points.get(this.cp).stop;
        msg += "</br>";*/

        msg += "temp_d: " + this.temp_d;
        msg += "</br>";

        msg += "d: " + this.d;
        msg += "</br>";
        output("")
        appendOutput(msg);
    }
    ninetyDegreeTurn(dir) {
        var b = perpendicular_dir.get(this.t.type).has(dir);

        msg = "ninetyDegreeTurn(dir)\n"
        msg += "dir: " + dir + "\n"
        msg += "this.t.type: " + this.t.type + "\n"
        msg += "ninetyDegreeTurn: " + b
        // alert(msg)
        return b;
    }
    inRange() {
        // alert("in range. curr RC then CP.")
        // alert([this.r, this.c])
        // alert(this.cp)
        var dd = dist([this.r, this.c], this.cp, false);
        // alert("Distance(curr, cp): " + dd.toString(10));
        var d =  dd <= POINT_RADIUS;
        // alert(d);
        return d;
    }
    validCmdDetected(key) {
        return allowedKeys.has(key);
    }
    atExit() {
        return gridPoints[this.r][this.c].exit;
    }
    handleEvent(event) {
        let key = event.key;
        // alert(key);
        if (this.validCmdDetected(key)) {  //awsd or <^v>
            this.moving = true;
            let newDir = allowedKeys.get(key);
            // alert(newDir)
            console.log(newDir)
            // alert("moving? : " + this.moving)
            if (this.ninetyDegreeTurn(newDir)) {
                // need to check for exit
                console.log("90 turn")
                if (this.atExit()) {
                    this.d = newDir
                    console.log("exit")
                    this.updateTarget()

                    // TODO: make sure pacman
                    // is aligned to new track
                    // ERROR: following code sometimes breaks
                    // NOTE: might be problem with dir2coor2target
                    /*
                    main_summer2021.js:100 Uncaught TypeError: Cannot read property '0' of undefined
                        at HTMLImageElement.updateTarget (main_summer2021.js:100)
                        at HTMLImageElement.handleEvent (main_summer2021.js:316)
                    updateTarget @ main_summer2021.js:100
                    handleEvent @ main_summer2021.js:316
                    */
                    this.updateCoor()
                    let temp = coor2Pix(this.r, this.c)
                    this.X = temp[0]
                    this.Y = temp[1]
                }
            } else { //stay on track
                this.d = newDir
                console.log("same track")
                this.updateTarget()
            }
        }
    }
}

//========end of movement========
STARTR = 1;
STARTC = 1;
var pacman1 = new Pacman(
    srcs=pacman_files, h=PIX_PER_TILE, w=PIX_PER_TILE,
    r=STARTR, c=STARTC, 
    s=SPEED, d=dir.UP, 
    t=test_track, 
    tr=0, tc=1
);
// var pacman2 = new Pacman(
//     srcs=pacman_files, h=PIX_PER_TILE, w=PIX_PER_TILE,
//     r=(STARTR), c=STARTC,
//     s=(2*SPEED), d=dir.RIGHT,
//     t=test_track,
//     tr=(STARTR+1), tc=3
// );
document.addEventListener('keydown', pacman1, false);


// alert(STARTR+5)
//main loop
// var timer = Timer();
// maybe useful: https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
function main() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
      
      drawWalls();
      draw(pacman1);
      // draw(pacman2);

      // timer.sleep();
      if (true) requestAnimationFrame(main)       // loop
}