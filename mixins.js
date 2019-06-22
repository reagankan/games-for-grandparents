class Empty { }
export let Movable = Base => class extends Position(Base) {
    constructor() {
        super();
    }
    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
};

export let Position = Base => class extends Base {
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
