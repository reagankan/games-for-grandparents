function left_shift(arr) {
    var zerosOnRight = create_array(4);
    for (var i = 0; i < 4; i++) {
        zerosOnRight[i] = 0;
    }
    var idx = 0;
    for (var i = 0; i < 4; i++) {
        if (arr[i] != 0) {
            zerosOnRight[idx] = arr[i];
            idx += 1;
        }
    }
    return zerosOnRight;
}
function merge_at(arr, i) {
	if (arr[i] == arr[i+1] && arr[i] != 0) {
	    arr[i] = arr[i] * 2;
	    arr[i+1] = 0;
	}
    return arr;
}
function do_merge(arr) {
    arr = left_shift(arr);
    arr = merge_at(arr, 0);
    arr = merge_at(arr, 1);
    arr = merge_at(arr, 2);
    arr = left_shift(arr);
    return arr;
}

function did_merge(before, after) {
	let n1 = 0; // num nonzeros
	for (let i of before) {
		n1 += (i != 0)
	}

	let n2 = 0;
	for (let i of after) {
		n2 += (i != 0)
	}

	return n1 > n2;
}

function move_up() {
    var column;
    var movesCounter = 0;
    // var did_merge_flag = false;

    for (var c = 0; c < 4; c++) {

    	// copy over column
    	column = create_array(4);
        for (var r = 0; r < 4; r++) {
            column[r] = tiles[r][c].value;
        }

        // merge and copy back to tiles
        var merged = do_merge(column);
        for (var r = 0; r < 4; r++) {
            //tiles[i][c].set_next(merged[i]);
            tiles[r][c].set_value(merged[r]);
        }

        // animate
        // var shiftArr = shiftArray(column, copyArray(column));
        // for (var i = 0; i < 4; i++) {
        //     if (shiftArr[i] != 0) {
        //         var tile = tiles[i][c];
        //         tile.set_moving(true);
        //         tile.set_direction("Up");
        //         //print("===========> " + tile.dir);
        //         tile.set_dxdy(0, -10);
        //         tile.set_nxny(tile.x, tile.y - 128 * shiftArr[i]);
        //     }
        // }
        // movesCounter += tilesDidMove(shiftArr);
        // //print("tilesMoved: " + movesCounter);
    }
    // tilesMoved = movesCounter != 0;
}

function add_new_tile() {
    var open = [];
    var j = 0
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            if (tiles[r][c].value == 0) {
                open.push(j);
            }
            j += 1;
        }
    }
    var i = open[randint(open.length)];
    var r = Math.floor(i / 4);
    var c = i % 4;
    if (Math.random() < 0.5) {
    	tiles[r][c].set_value(2);
    	console.log("adding new tile (2) to (" + i + ") [" + r + "][" + c + "]");
    } else {
    	tiles[r][c].set_value(4);
    	console.log("adding new tile (4) to (" + i + ") [" + r + "][" + c + "]");
    }
} 

function move() {
    if (upPressed) {
        move_up();
    	add_new_tile();
    }
    else if (downPressed) {
        rotate_array(tiles, 2);
        move_up();
        rotate_array(tiles, 2);
    	add_new_tile();
    }
    else if (leftPressed) {
        rotate_array(tiles, 1);
        move_up();
        rotate_array(tiles, -1);
    	add_new_tile();
    }
    else if (rightPressed) {
        rotate_array(tiles, -1);
        move_up();
        rotate_array(tiles, 1);
    	add_new_tile();
    }
    setTimeout(turn_off_keys, 10)
}

function main() {
	move();
    print_tiles();
    print(new Array([upPressed, downPressed, leftPressed, rightPressed]))
    // drawTiles();
}
function init() {
    init_tiles();
    ctx.drawImage(document.getElementById("empty"), 0, 0, 512, 512);
    setInterval(main, 100);
}
window.onload = init;