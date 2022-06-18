class Empty { }
let Position = Base => class extends Base {
    constructor() {
        super();
        this.set_xy(0, 0);
        this.set_dxdy(0, 0);
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
};

let Movable = Base => class extends Position(Base) {
    constructor() {
        super();
    }
    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
};
class Image extends Movable(Empty) {
    constructor(id, x, y) {
        super();
        this.set_xy(x, y);
        this.img = document.getElementById(id);
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y);
    }
}
class Tile extends Image {
    constructor(id, x, y, value) {
        super(valueToId.get(value), x, y);
        print(valueToId.get(value));
        this.set_rxry(x, y);
        this.set_value(value);
        this.set_next(value);
        this.stop();
    }
    set_rxry(x, y) {
        this.rx = x;
        this.ry = y;
    }
    set_value(value) {
        this.value = value;
//        this.img = document.getElementById(valueToId.get(this.id));
    }
    set_next(next) {
        this.next_value = next;
    }
    transfer() {
//        print("transferring: " + this.value + " to " + this.next_value);
        this.set_value(this.next_value);
    }
    set_nxny(x, y) {
        x = Math.max(x, 0);
        y = Math.max(y, 0);
        this.nx = Math.min(x, 384);
        this.ny = Math.min(y, 384);
    }
    set_moving(m) {
        this.moving = m;
    }
    set_direction(dir) {
        this.dir = dir;
    }
    stop() {
        this.set_moving(false);
        this.set_direction("none");
        this.set_dxdy(0, 0);
    }
    move() {
        super.move();
        var arrived = false;
        if (this.dir == "Up") {
            arrived = this.y <= this.ny;
            //print("moving up");
            //print(arrived);
        } else if (this.dir == "Down") {
            arrived = this.y >= this.ny;
            //print("moving down");
        } else if (this.dir == "Left") {
            arrived = this.x <= this.nx;
            //print("moving left");
        } else if (this.dir == "Right") {
            arrived = this.x >= this.nx;
            //print("moving right");
        } else {
            //print("no direction");
        }
        if (this.moving) {
        print("tile is moving " + this.value);
        print("arrived: " + arrived);
        print(this.dir);
        print(this.x + ", " + this.y + " going to " + this.nx + ", " + this.ny);
        }
        if (arrived) {
        /*
         * Transfer graphics. move back to old spot
         * need func to reset xy given r, c index of tiles[][].
         */
        print("================================> Stopped.");
        this.stop()
        this.set_xy(this.rx, this.ry);
        this.transfer();
        }
    }
    get_image() {
        return document.getElementById(valueToId.get(this.value));
    }
    draw() {
        if (this.value != 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.get_image(), this.x, this.y, 128, 128);
        }
        //ctx.drawImage(this.img, this.x, this.y, 128, 128);
    }
}