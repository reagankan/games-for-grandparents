/*
dimensions are based off of this: https://shaunlebron.github.io/pacman-mazegen/

Map is 28x31 tiles.
Paths are only 1 tile thick
No sharp turns (i.e. intersections are separated by atleast 2 tiles).



26 dots across a row


IDEA:
1. bijection pixel location to r,c coordinate
2. use r,c to index into grid[r][c] = entity.
3. update every few frames. use grid to make logic decisions? or use pixels??
4. figure out way to tune speed and updates

*/
// const entity = {
//     PACMAN : [0, -1],
//     WALL :[0, 1],
//     DOT :[-1, 0],
//     GHOST : [1, 0],
//     NONE : [0, 0]
// }
// class Grid {
// 	constructor(n=28, m=31) {
// 		this.n = n;
// 		this.m = m;
// 		this.grid = createArray(n, m);
// 	}
// }

//bijection: pix(x, y) <--> coor(r, c)
PIX_PER_TILE = 21;
ROWS = 31;
COLS = 28;

W = COLS * PIX_PER_TILE;
H = ROWS * PIX_PER_TILE;
function boxIndex(x, y) {
	return (COLS+1) * Math.floor(y / PIX_PER_TILE) + Math.floor(x / PIX_PER_TILE);
}
function pix2Coor(x, y) {
	var bi = boxIndex(x, y);
	var r = Math.floor(bi / (COLS+1));
	var c = bi % (COLS+1);
	return [r, c];
}
function coor2Pix(r, c) {
	var lowX = c * PIX_PER_TILE;
	var lowY = r * PIX_PER_TILE;

	var X = lowX + PIX_PER_TILE/2;
	var Y = lowY + PIX_PER_TILE/2;

	var hiX = lowX + PIX_PER_TILE - 1;
	var hiY = lowY + PIX_PER_TILE - 1;
	return [[lowX, X, hiX], [lowY, Y, hiY]];
}


STARTR = 16;
STARTC = 14;

const base = {
	ROW : "row",
	COL : "col"
}
var test_exits = new Map([
	[[STARTR, STARTC - 10], "Left Exit"],
	[[STARTR, STARTC + 10], "Right Exit"]
	]);
class Track {
	//w.r.t Coordinates, i.e. R, C pairs.
	constructor(base=base.ROW, base_value=STARTR, exits=test_exits) {
		this.base = base;
		this.val = base_value;
		this.exits = exits;
	}
}
var test_track = new Track();


