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

PIX_PER_TILE = 20;
ROWS = 31;
COLS = 28;