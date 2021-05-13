inputMap = new Array(
//	"###########",
	"#...##....#",
	"..#....##..",
	"#...##....#");//,
//	"###########");

// inputMap = new Array(
// 	"#####",
// 	"#...#",
// 	"##.##",
// 	"#...#",
// 	"#####");

// inputMap = new Array(
// 	"...",
// 	"#.#",
// 	"...");


inputMap = new Array(
	"............##............",
	".####.#####.##.#####.####.",
	".####.#####.##.#####.####.",
	".####.#####.##.#####.####.",
	"..........................",
	".####.##.########.##.####.",
	".####.##.########.##.####.",
	"......##....##....##......",
	"#####.#####.##.#####.#####",
	"#####.#####.##.#####.#####",
	"#####.##..........##.#####",
	"#####.##.########.##.#####",
	"#####.##.########.##.#####",
	".........########.........",
	"#####.##.########.##.#####",
	"#####.##.########.##.#####",
	"#####.##..........##.#####",
	"#####.##.########.##.#####",
	"#####.##.########.##.#####",
	"............##............",
	".####.#####.##.#####.####.",
	".####.#####.##.#####.####.",	
	"...##................##...",
	"##.##.##.########.##.##.##",
	"##.##.##.########.##.##.##",
	"......##....##....##......",
	".##########.##.##########.",
	".##########.##.##########.",
	"..........................");

// inputMap = new Array(
// 	"...",
// 	".#.",
// 	"...");

// inputMap = new Array(
// 	"..",
// 	"..");

const WALL = '#';
function wrapWalls(input) {
	for (var i = 0; i < input.length; i++) {
		input[i] = WALL + input[i] + WALL;
	}

	let output = new Array();
	output.push(WALL.repeat(input[0].length));
	for (var i = 0; i < input.length; i++) {
		output.push(input[i]);
	}
	output.push(WALL.repeat(input[0].length));
	return output;
}
inputMap = wrapWalls(inputMap);


// MAX_AREA = 500 * 500;
ROWS = inputMap.length; //31;
COLS = inputMap[0].length;//28;
// alert(Math.min(window.outerWidth, window.outerHeight))
// alert(Math.max(ROWS, COLS))
// alert(Math.min(window.outerWidth, window.outerHeight) / Math.max(ROWS, COLS))
// alert(1024 / 31)
PIX_PER_TILE = Math.floor(Math.min(window.outerWidth, window.outerHeight) / Math.max(ROWS, COLS)) * 2
// alert(PIX_PER_TILE)

const SPEED = PIX_PER_TILE/15; // Thus, num frames to pass a tile = PIX_PER_TILE


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


STARTR = 23;//16;
STARTC = 15//Math.floor(COLS/2);//14;

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
const dirArray = new Array(dir.UP, dir.DOWN, dir.LEFT, dir.RIGHT, dir.NONE);

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
// var test_exits = new Map([
// 	[[STARTR, STARTC - 10], "Left Exit"],
// 	[[STARTR, STARTC + 10], "Right Exit"]
// 	]);

// const test_sp = new Map([
// 						[dir.LEFT, [STARTR, 0]],
// 						[dir.RIGHT, [STARTR, COLS - 1]]
// 						]);

const POINT_RADIUS = 1; //inputs noted 1 tile before point. 
class Point {
	//Mainly for Stop/Exit points in a track.
	constructor(r, c, exit, d, t, stop, stopDir, w=false) {
		//basic coor
		this.r = r;
		this.c = c;

		//exit
		this.exit = exit;
		this.d = d; //dir
		this.t = t; //track id.

		//stop
		// this is unique to direction
		this.stop = stop;
		this.stopDir = stopDir; //deprecated

		//wall
		this.wall = w;
	}
	getR() {
		return this.r;
	}
	toString() {
		// return this.exit;
		return "Point: (" + this.r.toString(10) + ", " + this.c.toString(10) + ")";
	}
}
var defaultPoints = new Array(new Point(STARTR, 0, true, -1, -1, true, new Set([dir.LEFT])),
							   new Point(STARTR, COLS-1, false, -1, -1, true, new Set([dir.RIGHT])));


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
			// let coor = [pts[i].r.toString(10), pts[i].c.toString(10)]
			let coor = [pts[i].r, pts[i].c]
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
	updateStopPoints(inputMap) {
		// for (var pt of this.getPointObjects) {
		// 	let dirs = parallel_dir.get(this.type) //set of directions parallel with HOR or VER
		// 	for (var d of dirs) {
		// 		//if moving in this d, hits a wall, then we want to stop.
		// 	}
		// }
	}
	getPointCoordinates() {
		let pts = new Array()
		for (const pt of this.points.keys()) {
        	pts.push(pt)
		}
		return pts
	}
	getPointObjects() {
		let pts = new Array()
		for (const pt of this.points.values()) {
        	pts.push(pt)
		}
		return pts
	}
	toString() {
		var s = "[";
        for (const pt of this.points.keys()) {
        	s += "(" + pt[0] + "," + pt[1] + ")"; 
		}
		s += "]";
		return s;
	}
}

//TODO: do this track map thing.
/*
	createPoints for all coor in inputMap
*/

function newWallPoint(r, c) {
	return new Point(r, c,
					exit=false, d=null, t=null,
					stop=false, stopDir=null,
					wall=true);
}
function isWall(input, r, c) {
	return (0 <= r) && (r < ROWS)
			&& (0 <= c) && (c < COLS)
			&& input[r].charAt(c) == WALL;
}
// alert(isWall(inputMap, 0, 0))
// alert(isWall(inputMap, 1, 1))

function numWalls(input, r, c) {
	//returns num walls surrounding a point.
	let count = 0;
	for (var i = 0; i < dirArray.length; i++) {
		let d = dirArray[i];
		if (d == dir.NONE) { continue; }
		let adj = addCoor([r, c], d);
		// alert(adj)
		if (isWall(input, adj[0], adj[1])) {
			count += 1;
		}
	}
	return count;
}
function hasParallelWalls(input, r, c) {
	let top = addCoor([r, c], [-1, 0]);
	let bot = addCoor([r, c], [1, 0]);
	let one = isWall(input, top[0], top[1]) && isWall(input, bot[0], bot[1]);
	
	let R = addCoor([r, c], [0, 1]);
	let L = addCoor([r, c], [0, -1]);
	let two = isWall(input, R[0], R[1]) && isWall(input, L[0], L[1]);

	return (one || two) && (numWalls(input, r, c) % 2 == 0);
}
function isExit(input, r, c) {
	let w = numWalls(input, r, c);
	// let msg = "input[" + r.toString(10)+", "+c.toString(10)+"]: ";
	// msg += w;
	// alert(msg);
	switch(w) {
		case 0:
			return true;
		case 1:
			return true;
		case 2:
			return !hasParallelWalls(input, r, c);
		case 3:
			return false;
		case 4:
			return false;
	}
	// return true;
}
function getDir(input, r, c, exit) {
	//hard for 2wall @angle, cuz there is 2 dirs into point.
	//but do we even need this?
	return dir.NONE;
}
function isStop(input, r, c) {
	return true;
}
function getStopDir(input, r, c, stop) {
	return new Set();
}
function createPoints(input) {
	let arr = createArray(ROWS, COLS);
	for (var r = 0; r < ROWS; r++) {
		for (var c = 0; c < COLS; c++) {
			if (isWall(input, r, c)) {
				arr[r][c] = newWallPoint(r, c);
			} else {
				let exit = isExit(input, r, c);
				let d = null; //dep on track type; getDir(input, r, c, exit); //maybe obsolete.
				let t = null; //fill later

				let stop = false; // assume false. toggle true when building tracks
				let stopDir = getStopDir(input, r, c, stop);

				let wall = false;

				// if (r == 23 && c == 21) {
				// 	let msg = "Exit: input[" + r.toString(10)+", "+c.toString(10)+"]: ";
				// 	msg += exit;
				// 	alert(msg);
				// }
				

				arr[r][c] = new Point(r, c,
									exit=exit, d=d, t=t,
									stop=stop, stopDir=stopDir,
									wall=wall);
			}
		}
	}
	return arr;
}
var gridPoints = createPoints(inputMap);

// alert("(1, 1) has parallel walls: " +  hasParallelWalls(inputMap, 1, 1))
// alert("(1, 1) num walls: " +  numWalls(inputMap, 1, 1))
function isHorHead(input, r, c) {
	let wall = isWall(input, r, c);

	let lp = addCoor([r, c], [0, -1]);
	let leftWall = isWall(input, lp[0], lp[1]);

	let rp = addCoor([r, c], [0, 1]);
	let rightWall = isWall(input, rp[0], rp[1]);


	// let msg = "inside hor head(" + r.toString(10) + "," + c.toString(10) + ")\n";
	// msg += "leftWall("+lp[0]+","+lp[1]+"): " + leftWall + "\n";
	// msg += "wall("+r+","+c+"): " + wall+ "\n";
	// msg += "rightWall: " +rp[0]+","+rp[1]+"): " + rightWall+ "\n";
	// alert(msg);


	return leftWall && !wall && !rightWall;
}
function isHorTail(input, r, c) {
	let wall = isWall(input, r, c);

	let lp = addCoor([r, c], [0, -1]);
	let leftWall = isWall(input, lp[0], lp[1]);

	let rp = addCoor([r, c], [0, 1]);
	let rightWall = isWall(input, rp[0], rp[1]);

	return !leftWall && !wall && rightWall;
}
function getHorTracks(input, gridPoints) {
	var horTracks = new Array();
	for (var r = 0; r < ROWS; r++) {
		var t = null;
		for (var c = 0; c < COLS; c++) {
			if (isWall(input, r, c)) {
				continue;
			}
			let msg = "input[" + r.toString(10)+", "+c.toString(10)+"]: ";
			// msg += w;
			
			if (isHorHead(input, r, c)) {

				// set stop boolean
				let headPt = gridPoints[r][c]
				headPt.stop = true;
				headPt.stopDir = dir.LEFT;
				gridPoints[r][c] = headPt;

				t = new Track(dir_types.HOR, new Array(headPt));
				msg += "is head!!";
				// alert(msg);
			}
			else if (isHorTail(input, r, c)) {
				// alert(t.points)

				// set stop boolean
				let tailPt = gridPoints[r][c]
				tailPt.stop = true;
				tailPt.stopDir = dir.RIGHT;
				gridPoints[r][c] = tailPt;

				t.points.set([r,c], tailPt);
				horTracks.push(t);
				t = null;
				msg += "is tail!!";
				// alert(msg);
			}
			else {
				msg += "is middle!!";
				// alert(msg);
				if (t != null) {
					t.points.set([r,c], gridPoints[r][c]);
					if (r == 23 && c == 21) {
						let msg = "Exit: gridPoints[" + r.toString(10)+", "+c.toString(10)+"]: ";
						msg += gridPoints[r][c].exit;
						alert(msg);
					}
				}
			}
		}
	}
	return horTracks;
}

function isVerHead(input, r, c) {
	let wall = isWall(input, r, c);

	let lp = addCoor([r, c], [-1, 0]);
	let leftWall = isWall(input, lp[0], lp[1]);

	let rp = addCoor([r, c], [1, 0]);
	let rightWall = isWall(input, rp[0], rp[1]);


	let msg = "inside ver head(" + r.toString(10) + "," + c.toString(10) + ")\n";
	msg += "topWall("+lp[0]+","+lp[1]+"): " + leftWall + "\n";
	msg += "wall("+r+","+c+"): " + wall+ "\n";
	msg += "botWall: " +rp[0]+","+rp[1]+"): " + rightWall+ "\n";
	// alert(msg);


	return leftWall && !wall && !rightWall;
}
function isVerTail(input, r, c, debug=false) {
	let wall = isWall(input, r, c);

	let lp = addCoor([r, c], [-1, 0]); //dir is Pix not Coor, so these are flipped.
	let leftWall = isWall(input, lp[0], lp[1]);

	let rp = addCoor([r, c], [1, 0]);
	let rightWall = isWall(input, rp[0], rp[1]);


	let msg = "inside ver TAIL(" + r.toString(10) + "," + c.toString(10) + ")\n";
	msg += "topWall("+lp[0]+","+lp[1]+"): " + leftWall + "\n";
	msg += "wall("+r+","+c+"): " + wall+ "\n";
	msg += "botWall: " +rp[0]+","+rp[1]+"): " + rightWall+ "\n";
	msg += "isVerTail: " + !leftWall && !wall && rightWall + "\n";

	msg += String.fromCharCode(input[lp[0]].charCodeAt(lp[1])) + "\n";
	
	if (debug) {

	alert(msg);	
	}


	return !leftWall && !wall && rightWall;
}
function getVerTracks(input, gridPoints) {
	var verTracks = new Array();
	for (var c = 0; c < COLS; c++) {
		var t = null;
		for (var r = 0; r < ROWS; r++) {
			if (isWall(input, r, c)) {
				continue;
			}
			let msg = "input[" + r.toString(10)+", "+c.toString(10)+"]: ";
			// msg += w;
			
			// if (r == 11 && c == 12) {
			// 	msg += "\n";
			// 	msg += "Head: " + isVerHead(input, r, c) + "\n";
			// 	msg += "Tail: " + isVerTail(input, r, c, false) + "\n";
			// 	alert(msg);
			// }

			if (isVerHead(input, r, c)) {
				// set stop boolean
				let headPt = gridPoints[r][c]
				headPt.stop = true;
				headPt.stopDir = dir.UP;
				gridPoints[r][c] = headPt;

				t = new Track(dir_types.VER, new Array(headPt));
				msg += "is ver head!!";
				// alert(msg);
			}
			else if (isVerTail(input, r, c)) {
				// alert(t.points)

				// set stop boolean
				let tailPt = gridPoints[r][c]
				tailPt.stop = true;
				tailPt.stopDir = dir.DOWN;
				gridPoints[r][c] = tailPt

				t.points.set([r,c], tailPt);
				verTracks.push(t);
				t = null;
				msg += "is ver tail!!";
			// 	if (r == 11 && c == 12) {
				// alert(msg);
			// }
			}
			else {
				if (t != null) {
					msg += "is ver middle!!";
					// alert(msg);
					t.points.set([r,c], gridPoints[r][c]);
				}
			}
		}
	}
	return verTracks;
}
// not needed??
// // function getTrackLimits(input, gridPoints) {
// // 	let lims = new Map();
// // 	//scan hor tracks

// // 	//scan vert tracks
// // 	return lims;
// // }
// // var track_limits = getTrackLimits(inputMap); //tid -> [[r,c],[r,c]]

function getAllTracks(input, gridPoints) {
	var h_tracks = getHorTracks(input, gridPoints);
	// alert(h_tracks.toString());

	var v_tracks = getVerTracks(input, gridPoints);
	// alert(v_tracks.toString());


	var NUM_TRACKS = h_tracks.length + v_tracks.length;
	// alert(h_tracks);
	// alert(v_tracks);
	// alert("Num horizontal: " + h_tracks.length .toString(10));
	// alert("Num VERTICAL: " + v_tracks.length .toString(10));
	// alert("Num Tracks: " + NUM_TRACKS.toString(10));
	var tracks = new Map(); //int -> Track obj();
	var id = 0;
	while (id < h_tracks.length) {

		tracks.set(id, h_tracks[id]);

		// if (id < 3) {
		// 	input = id + " : " + h_tracks[id]
		// 	result = id + " : " + tracks.get(id)
		// 	alert(input + "\n" + result)
		// }
		id += 1;

	}
	while (id < NUM_TRACKS) {
		tracks.set(id, v_tracks[id - h_tracks.length]);
		// if (id < h_tracks.length + 3) {
		// 	input = id + " : " + v_tracks[id - h_tracks.length]
		// 	result = id + " : " + tracks.get(id)
		// 	alert(input + "\n" + result)
		// }
		id += 1;
	}

	// for (var track of tracks) {
		// track.updateStopPoints(input)
	// }

	return tracks;
}
var all_tracks = getAllTracks(inputMap, gridPoints); //int -> Track obj();

var dir2coor2target = {}
for (let d of Object.entries(dir)) {
	let direction = d[1]
	dir2coor2target[direction] = {}
	for (let [tid, t] of all_tracks) {
		let trackType = t.type
		// console.log(Object.entries(t.points))
		// console.log(t.points.values())
		// console.log(t)

		let points = Array.from(t.points.values())
		let headPt = points[0]
		let headCoord = [headPt.r, headPt.c]
		let tailPt = points[points.length - 1]
		let tailCoord = [tailPt.r, tailPt.c]


		for (let coords of getRange(headCoord, tailCoord)) {
			/** 

			GIVEN: (1) direction 'direction'; (2) coordinate 'ptCoor'

			(3) track type \in {dir_types.VER, dir_types.HOR}


			FIND: targetCoordinates
			i.e. 
			agent is at 'ptCoor'
			heading in 'direction'
			which coordinate should it stop moving?
			**/

			if (coords in dir2coor2target[direction]) {
				if (dir2coor2target[direction] !== null) {
					// continue
				}
			}

			targetCoord = null

			if (trackType == dir_types.VER) {
				// console.log("vertical track")
				// console.log(t)
				if (direction == dir.UP) {
					targetCoord = headCoord
				} else if (direction == dir.DOWN) {
					targetCoord = tailCoord
				} else if (direction == dir.NONE) {
					targetCoord = coords
				}
			} else if (trackType == dir_types.HOR) {
				if (direction == dir.LEFT) {
					targetCoord = headCoord
				} else if (direction == dir.RIGHT) {
					targetCoord = tailCoord
				} else if (direction == dir.NONE) {
					targetCoord = coords
				}
			}
			if (targetCoord == null) {
				continue
			}
			dir2coor2target[direction][coords] = targetCoord

		}
		
	}
}

console.log("dir2coor2target")
console.log(dir2coor2target)



function getClosestTrack(r, c, tracks=all_tracks) {
	let closest = null
	let min_dist = Number.MAX_SAFE_INTEGER
	for ([track_id, track] of tracks) {
		let new_dist = Number.MAX_SAFE_INTEGER
		for (const pt of track.getPointObjects()) {
			let val = Math.abs(pt.r - r) + Math.abs(pt.c - c)
			new_dist = Math.min(new_dist, val)

			let msg = ""
			msg += "R, C : " + r + ", " + c + "\n"
			msg += "PT: R, C : " + pt.r + ", " + pt.c + "\n"
			msg += "new val: " + val + "\n"
			msg += "new min dist: " + new_dist + "\n"
		}
		if (new_dist < min_dist) {
			min_dist = new_dist
			closest = track
			// alert("min_dist: " + min_dist)
		}
	}
	// alert("min_dist: " + min_dist)
	return closest
}
// alert("Num Tracks: " + all_tracks.size)
var test_track = all_tracks.get(0);
// alert(test_track.type)
// test_track = new Track();
// alert(test_track)
// alert(test_track.toString())


let msg = "All Tracks\n"
for ([track_id, track] of all_tracks) {
	msg += track_id + " : " + track.toString() + "\n"
}
// alert(msg)



