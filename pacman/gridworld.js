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
	return [lowX, lowY]

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
const dir = {
    UP : [0, -1],
    DOWN :[0, 1],
    LEFT :[-1, 0],
    RIGHT : [1, 0],
    NONE : [0, 0],
}
const dir_types = {
    HOR : "horizontal",
    VER : "vertical"
}
function computeDir(srcPt, dstPt) {
	// if (srcPt[0] != dstPt[0] && srcPt[1] != dstPt[1]) {
	// 	return [-1, -1]; //must be colinear???
	// 	//or can we reuse for ghosts.
	// }
	if (srcPt[0] == dstPt[0]) { //rows eq, so either L or R.
		if (srcPt[1] < dstPt[1]) {
			return dir.RIGHT;
		}
		return dir.LEFT;
	}
	//we are here since cols eq, so moving row-wise. i.e. either U or D.
	if (srcPt[1] < dstPt[1]) {
		return dir.DOWN;
	}
	return dir.UP;
}
const otherDirType = new Map([[dir_types.HOR, dir_types.VER], [dir_types.VER, dir_types.HOR]]);
const parallel_dir = new Map([
							[dir_types.HOR, new Set([dir.LEFT, dir.RIGHT, dir.NONE])],
							[dir_types.VER, new Set([dir.UP, dir.DOWN, dir.NONE])]
							]);
const perpendicular_dir = new Map([
							[dir_types.VER, new Set([dir.LEFT, dir.RIGHT])],
							[dir_types.HOR, new Set([dir.UP, dir.DOWN])]
							]);
var test_exits = new Map([
	[[STARTR, STARTC - 10], "Left Exit"],
	[[STARTR, STARTC + 10], "Right Exit"]
	]);

const test_sp = new Map([
						[dir.LEFT, [STARTR, 0]],
						[dir.RIGHT, [STARTR, COLS - 1]]
						]);

const POINT_RADIUS = 1; //inputs noted 1 tile before point. 
class Point {
	//Mainly for Stop/Exit points in a track.
	constructor(r, c, exit, d, t, stop) {
		//basic coor
		this.r = r;
		this.c = c;

		//exit
		this.exit = exit;
		this.d = d; //dir
		this.t = t; //track id.

		//stop
		this.stop = stop;
	}
	getR() {
		return this.r;
	}
	toString() {
		return this.exit;
		//return "Point: (" + this.r.toString(10) + ", " + this.c.toString(10) + ")";
	}
}
var defaultPoints = new Array(new Point(STARTR, 0, true, -1, -1, true),
							   new Point(STARTR, COLS-1, false, -1, -1, true));

//TODO: do this track map thing.
var all_tracks = new Map(); //int -> Track obj();

class Track {
	//w.r.t Coordinates, i.e. R, C pairs.
	constructor(type=dir_types.HOR, points=defaultPoints) {
		this.type = type;
		this.points = new Map();
		this.addPoints(points); //[R, C] -> Point() obj.
	}
	addPoints(pts) {
		// let pt1 = pts[0];
		// alert("point 1 toString()")
		// alert(pt1)
		// alert("point 1.r to String")
		// alert(pt1.getR())
		// alert("done")
		for (var i = 0; i < pts.length; i++) {
			// alert(pts[i]);
			let coor = [pts[i].r.toString(10), pts[i].c.toString(10)]
			// alert(coor);
			this.points.set(coor, pts[i]);
		}
		// alert("printing first Point in defaultPoints")
		// const iterator1 = this.points.keys();

		// alert(iterator1.next().value);
		// alert("refresh the page")
		// alert(this.points[]);
		// let it = this.points.keys();
		// let result = it.next();
		// while (!result.done) {
		//  alert(result.value); // 1 3 5 7 9
		//  result = it.next();
		// }
		// for (const pt of this.t.points.keys()) {
	}
}
var test_track = new Track();


