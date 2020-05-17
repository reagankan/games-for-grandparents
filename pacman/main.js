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

//========Movement========
class GameObject extends Image {
    constructor(srcs, h, w, r, c, s, d, t) {
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
        this.t = t; //track
        // alert(t);
    }
    // getX() { return this.X; }
    // setX(x) {
    //     this.X = x;
    // }
    // getY() {
    //     return this.Y;
    // }
    // setY(y) {
    //     this.Y = Y;
    // }
    // getD() {
    //     return this.d;
    // }
    // setD(d) {
    //     this.d = d;
    // }
    // getTempD() {
    //     return this.temp_d;
    // }
    // setTempD(d) {
    //     this.temp_d = d;
    // }
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
    // onTarget() {
    //     return true;
    // }
    // updateDir() {
    //     if (this.d != this.temp_d && this.onTarget()) {
    //         this.d = this.temp_d;
    //     }
    // }
    move() {
        // this.updateDir();
        this.oldX = this.X;
        this.oldY = this.Y;
        this.X += this.s * this.d[0];
        this.Y += this.s * this.d[1];
        this.updateCoor();
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
                r=STARTR, c=STARTC, s=SPEED, d=dir.NONE, t=test_track) {
        super(srcs, h, w, r, c, s, d, t);
        this.cp = new Array([0, 0]);
        this.updateClosestPoint();

        this.turn = false;
        this.moving = false;
        this.skip = 0;
        this.SKIP_TIME = 100;
        this.turn_initiated = false;
        // alert(this.t);
    }
    move() {
        //this is called every frame
        this.updateDir();
        super.move();
        this.updateClosestPoint();

        // var parent = super.getX().toString(10) + ", " + super.getY().toString(10);
        // var child = this.X.toString(10) + ", " + this.Y.toString(10);
        // var parent = super.getD() + ", " + super.getTempD();
        // var parent = "";
        // var child = this.d + ", " + this.temp_d;
        var msg = "Pix (" + this.X + ", " + this.Y + ")";
        msg += "</br>";

        msg += "Coor ("+ this.r + ", " + this.c + ")";
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

        

        output(msg);
    }
    dirMatch() {
        return this.d == computeDir([this.r, this.c], this.cp);
    }
    reachCP(cpPix) {
        var d = computeDir([this.r, this.c], this.cp);
        var x = cpPix[0];
        var y = cpPix[1];
        // alert("computed dir")
        // alert(d)
        switch(d) {
            case dir.UP:
                return (this.Y <= y);
            case dir.DOWN:
                return (this.Y >= y);
            case dir.LEFT:
                return this.X <= x;
            case dir.RIGHT:
                return this.X >= x;
            default:
                return false; //this should not happen;
        }
        return false;  //this should not happen.
    }
    updateDir() {
        //this is called every frame.
        var targetPix = coor2Pix(this.cp[0], this.cp[1]);
        var reachedCP = this.reachCP(targetPix);
        var turn = this.turn;
        var stopOnCP = this.t.points.get(this.cp).stop;
        var blockedDir = this.t.points.get(this.cp).stopDir.has(this.temp_d);
        this.skip += 1;


        // var stopCond = this.temp_d != dir.NONE && this.d != dir.NONE && !this.turn_initiated;
        var stopCond = this.d != dir.NONE && !this.turn_initiated;
        appendOutput("StopCond: " + stopCond);

        if (turn) {
            if (reachedCP) {
                //turn
                this.d = this.temp_d;

                this.X = targetPix[0];//[1];
                this.Y = targetPix[1];//[1];

                this.turn = false;
                this.turn_initiated = true;
                this.skip = 0;
            }
        } else { //no commands(so stop) or parallel commands.
            if (stopOnCP) { //need to stop if no commands detected.
                if (reachedCP) { //pixels match, we are on this.cp;
                    if (this.d != this.temp_d) { //detected commands. 
                        //lookup stopDir/validDir, since we are on CP now.
                        if (blockedDir) {
                            //if in stop dir, need to stop.
                            if (stopCond) {
                                this.d = dir.NONE;
                                // this.temp_d = dir.NONE;

                                this.X = targetPix[0];//[1];
                                this.Y = targetPix[1];//[1];

                                this.moving = false;
                            } 
                        } else {
                            //o.w. proceed with update.
                            this.d = this.temp_d;
                        }

                    } else { //no commands detected. so stop.
                        if (stopCond) {
                            this.d = dir.NONE;
                            // this.temp_d = dir.NONE;

                            this.X = targetPix[0];//[1];
                            this.Y = targetPix[1];//[1];

                            this.moving = false;
                        } 
                    }
                } else {
                    this.d = this.temp_d;
                }
            } else { //not a stop point, so proceed with update
                this.d = this.temp_d;
            }
        }

        // if (reachedCP) {
        //     if (turn) {
        //         //turn
        //         this.d = this.temp_d;

        //         this.X = targetPix[0];//[1];
        //         this.Y = targetPix[1];//[1];

        //         this.turn = false;
        //         this.turn_initiated = true;
        //         this.skip = 0;
        //     } else if (stopOnCP && this.temp_d != dir.NONE && this.d != dir.NONE && !this.turn_initiated) {// && this.skip > this.SKIP_TIME) {
        //         if (this.temp_d != dir.NONE) {
        //             this.temp_d = dir.NONE;
        //         }
        //         if (this.d != dir.NONE) {
        //             this.d = dir.NONE;   
        //         }

        //         this.X = targetPix[0];//[1];
        //         this.Y = targetPix[1];//[1];

        //         this.moving = false;
        //         // this.skip = 0;
        //     } else {
        //         this.d = this.temp_d;
        //     }

            
        // } else {
        //     //go forward backward along the track.
        //     this.turn_initiated = false;
        //     this.d = this.temp_d;
        // }
    }
    updateClosestPoint() {
        var small_d = ROWS + COLS;
        // alert(this.t.points);
        for (const pt of this.t.points.keys()) {
            var d = dist(pt, [this.r, this.c]);
            // alert(d)
            if (d < small_d) {
                small_d = d;
                this.cp = pt;
            }
        }
        // alert("closest point")
        // alert(this.cp)
    }
    turnRequested(dir) {
        var b = perpendicular_dir.get(this.t.type).has(dir);
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
    handleEvent(event) {
        let key = event.key;
        // alert(key);
        if (this.validCmdDetected(key)) {  //awsd or <^v>
            this.moving = true;
            let newDir = allowedKeys.get(key);
            // alert(newDir)
            // alert("moving? : " + this.moving)
            if (this.turnRequested(newDir)) {
                if (this.t.points.get(this.cp).exit && this.inRange()) {
                    this.turn = true;
                    this.temp_d = newDir;
                    //TODO: update Track
    
                } else {
                    this.turn = false; //don't want to count turn cmds pressed too early.
                }
            } else { //not a turn
                this.turn = false;
                this.temp_d = newDir;
                // this.updateDir();// this.d = newDir;
                // super.setTempD(newDir);
                // super.setD(newDir);
            }
            // alert(this.temp_d)
            // if (super.allowedDir.has(tryDir)) {
            //     super.temp_d = tryDir; //tempDir overrides super.d in super.updateDir only if onTarget.
            // }
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

//main loop
// var timer = Timer();
// maybe useful: https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
function main() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
      
      drawWalls();
      draw(pacman);

      // timer.sleep();
      if (!gameOver()) requestAnimationFrame(main)       // loop
}