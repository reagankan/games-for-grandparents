class Empty { }

let Position = Base => class extends Base {
    constructor(x, y) {
        super();
        this.set_xy(x, y);
    }
    set_x(x) {
        this.x = x;
    }
    set_y(y) {
        this.y = y;
    }
    set_xy(x, y) {
        this.set_x(x);
        this.set_y(y);
    }
};

let Movable = Base => class extends Position(Base) {
    constructor(x, y) {
        super(x, y);
        this.stop();
    }
    set_dx(dx) {
        this.dx = dx;
    }
    set_dy(dy) {
        this.dy = dy;
    }
    set_dxdy(dx, dy) {
        this.set_dx(dx);
        this.set_dy(dy);
    }
    set_moving(m) {
        this.moving = m;
    }
    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
    stop() {
        this.set_dxdy(0, 0);
        this.set_moving(false);
    }
};

class Bird extends Movable(Empty) {
    static FLIGHT_TIME = 5
    constructor(x, y) {
        super(x, y);
        this.set_dxdy(0, DY);
        this.init_images();
        this.t = 0;
        this.w = 50
        this.h = 50
        this.stop = false;
        this.interval = false;
    }

    init_images() {
        this.up = createImage("imgs/bird-up.png");
        this.mid = createImage("imgs/bird-mid.png");
        this.down = createImage("imgs/bird-down.png");
        this.images = [this.up, this.mid, this.down]
        this.image_index = 0
        this.frame = 0
        this.update_rate = 5
    }

    draw() {
        if (!this.stop && this.frame % this.update_rate == 0) {
            this.image_index = (this.image_index + 1) % this.images.length
        } 
        ctx.drawImage(this.images[this.image_index], this.x, this.y, this.w, this.h);
        this.frame += 1
        if (this.stop && this.interval) {
            console.log("clearing interval", this.interval);
            clearInterval(this.interval)
            this.interval = null;
            console.log("bird cleared interval", this.interval);
        }
    }

    move() {
        if (this.stop) {
            return;
        }
        // start flying 
        if (tap) {
            this.t0 = this.t
            this.set_dxdy(0, -DY)
        }

        // stop flying
        let flight_duration = this.t - this.t0
        if (flight_duration >= Bird.FLIGHT_TIME) {
            this.set_dxdy(0, DY)
        }

        this.t = (this.t + 1)%1e8
        super.move()
    }

    update() {
        if (this.isOnFloor()) {
            this.set_dy(0);
            this.stop = true;
        }
        this.move()
        this.draw()
    }

    isOnFloor() {
        return this.y+this.h >= (HEIGHT_IN_BLOCKS-1)*BLOCK_SIZE
    }

    getCollisionRectangle() {
        return {
          left:   this.x,
          right:  this.x+this.w,
          top:    this.y,
          bottom: this.y+this.h,
        };
    }

    setInterval(interval) {
        if (this.interval === false) {
            this.interval = interval
        }
    }

    getInterval() {
        return this.interval;
    }
}

class Ground extends Movable(Empty) {
    constructor() {
        super()
        this.reset_xy()
        this.set_dxdy(-DX, 0);
        this.init_images();
    }
    init_images() {
        this.img = createImage("imgs/ground.png");
    }
    reset_xy() {
        this.x = 0
    }
    draw() {
        ctx.drawImage(this.img, this.x, BLOCK_SIZE * (HEIGHT_IN_BLOCKS - 1), WIDTH*2, BLOCK_SIZE);
    }
    restart() {
        return this.x <= -WIDTH;
    }
    move() {
        super.move()
        if (this.restart()) {
            this.reset_xy()
        }
    }
    update() {
        this.move()
        this.draw()
    }
    stop() {
        this.set_dx(0)
    }
}

class PipeV1 extends Movable(Empty) {
    constructor() {
        super()
        this.reset_xy()
        this.set_dxdy(-DX, 0);
        this.init_images();
    }

    init_images() {
        this.up = createImage("imgs/pipe-up.png");
        this.down = createImage("imgs/pipe-down.png");
        this.body = createImage("imgs/pipe-body.png");
    }

    reset_xy() {
        this.x = canvas.width
        this.yi = randint(1, HEIGHT_IN_BLOCKS-2)
        this.y = this.yi*BLOCK_SIZE
    }
    
    draw() {
        for (let y = 0; y < this.yi-1; y++) {
            ctx.drawImage(this.body, this.x, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
        ctx.drawImage(this.down, this.x, this.y-BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        // ctx.drawImage(NOTHING, this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
        ctx.drawImage(this.up, this.x, this.y+BLOCK_SIZE*2, BLOCK_SIZE, BLOCK_SIZE);
        for (let y = this.yi+3; y < HEIGHT_IN_BLOCKS; y++) {
            ctx.drawImage(this.body, this.x, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    restart() {
        return this.x <= -BLOCK_SIZE;
    }

    move() {
        super.move()
        if (this.restart()) {
            this.x = canvas.width
            this.yi += -3 + randint(0,6)
            this.yi = Math.max(1, this.yi)
            this.yi = Math.min(HEIGHT_IN_BLOCKS-3, this.yi)
            this.y = this.yi*BLOCK_SIZE
        }
    }

    update() {
        this.move()
        this.draw()
    }

}

class PipeV2 extends Movable(Empty) {
    constructor() {
        super()
        this.x = canvas.width * 2 + BLOCK_SIZE
        this.yi = randint(HEIGHT_IN_BLOCKS/2-1, HEIGHT_IN_BLOCKS/2+1)
        this.y = this.yi*BLOCK_SIZE
        this.set_dxdy(-DX, 0);
        this.init_images();
    }

    init_images() {
        this.up = createImage("imgs/pipe-up.png");
        this.down = createImage("imgs/pipe-down.png");
        this.body = createImage("imgs/pipe-body.png");
    }
    
    draw(doDraw) {
        for (let y = 0; y < this.yi-1; y++) {
            ctx.drawImage(this.body, this.x, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
        ctx.drawImage(this.down, this.x, this.y-BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.drawImage(this.up, this.x, this.y+BLOCK_SIZE*3, BLOCK_SIZE, BLOCK_SIZE);
        for (let y = this.yi+4; y < HEIGHT_IN_BLOCKS-1; y++) {
            ctx.drawImage(this.body, this.x, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    restart() {
        return this.x <= -BLOCK_SIZE;
    }

    move(restart, yi) {
        super.move()
        if (restart) {
            this.x = canvas.width
            this.yi = yi
            this.y = yi*BLOCK_SIZE
        }
    }

    update(restart, yi, doDraw) {
        this.move(restart, yi)
        if (doDraw) {
            this.draw()
        }
    }

    getCollisionRectangles() {
        return {
            top: {
                left:   this.x,
                right:  this.x+BLOCK_SIZE,
                top:    0,
                bottom: this.y,
            },
            bottom: {
                left:   this.x,
                right:  this.x+BLOCK_SIZE,
                top:    this.y+BLOCK_SIZE*3,
                bottom: canvas.height*2,
            }
              
        };
    }

}

class TwoPipes {
    static BLOCK_OFFSET = 4;
    constructor() {
        this.pipes = [new PipeV2(), new PipeV2()]
        this.doDraw = new Array(this.pipes.length).fill(false);
        this.doDraw[0] = true;
        this.yi = this.pipes[0].yi;
    }
    update() {
        for (let i = 0; i < this.pipes.length; i++) {
            let p = this.pipes[i]
            if (i > 0) {
                let prevPipe = this.pipes[i-1];
                if (!this.doDraw[i] && Math.abs(prevPipe.x - p.x) >= TwoPipes.BLOCK_OFFSET * BLOCK_SIZE) {
                    this.doDraw[i] = true;
                    this.updateYI(); 
                }
            }
            let restart = p.restart();
            if (restart) {
                this.updateYI();   
                this.toggle=!this.toggle;
            }
            if (this.doDraw[i]) {
                p.update(restart, this.yi, this.doDraw[i])
            }
        }
    }
    updateYI() {
        let diff;
        do {
            diff = -3 + randint(0,7)
        } while(diff == 0);
        let bounded = this.bound(this.yi+diff)
        // console.log(this.yi, ">", this.yi+diff, ">", bounded)
        this.yi = bounded

        
    }
    bound(val) {
        val = Math.max(val, 1)
        val = Math.min(val, HEIGHT_IN_BLOCKS-5)
        return val
    }
    stop() {
        for (let p of this.pipes) {
            p.dx = 0;
        }
    }

    getCollisionRectangle() {
        return {
          left:   10,
          top:    10,
          right:  30,
          bottom: 30
        };
    }

    getClosestPipeFront(bird) {
        let closestPipe = null;
        let minDist = 1e10;
        for (let p of this.pipes) {
            let dist = Math.abs((bird.x+BLOCK_SIZE) - p.x);
            if (dist < minDist) {
                closestPipe = p;
                minDist = dist;
            }
        }
        return closestPipe;
    }

    getClosestPipeBack(bird) {
        let closestPipe = null;
        let minDist = 1e10;
        for (let p of this.pipes) {
            let dist = Math.abs(bird.x - p.x);
            if (dist < minDist) {
                closestPipe = p;
                minDist = dist;
            }
        }
        return closestPipe;
    }

    getCollisionRectangles(bird) {
        let closestPipe = this.getClosestPipeFront(bird);
        return closestPipe.getCollisionRectangles();
    }
}

