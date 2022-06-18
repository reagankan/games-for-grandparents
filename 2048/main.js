var player_has_2048 = false;
var player_continues = false;
var WIN_VALUE = 2048;
var score = 0;
var score_element = document.getElementById("score");

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

function update_score(new_points) {
    score += new_points;
    score_element.innerText = "Score: " + score;
}

function merge_at(arr, i) {
	if (arr[i] == arr[i+1] && arr[i] != 0) {
	    arr[i] = arr[i] * 2;
	    arr[i+1] = 0;

        update_score(arr[i]);

        if (arr[i] == WIN_VALUE) {
            player_has_2048 = true;
        }
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

function specialCase(a) {
    return (a[0] != 0 && a[1] != 0 && a[2] == 0 && a[3] != 0 && a[0] != a[1] && a[1] == a[3]);
}

function shiftArray(curr_exp, next_exp) {
    if (specialCase(curr_exp)) {
        var special = create_array();
        special[0] = 0;
        special[1] = 0;
        special[2] = 0;
        special[3] = 2;
        return special;
    }
    var currCopy = copy_array(curr_exp);
    var shiftsPast = create_array(4);
    for (var i = 0; i < 4; i++) {shiftsPast[i] = 0;}

    var numMergesAccountedFor = 0;
    for (var i = 0; i < 4; ) {
        if (currCopy[i] == 0) {
            shiftsPast[i] += 1;
            i++;
        } else if (currCopy[i] == currCopy[i + 1]) {
            shiftsPast[i] += 1;
            numMergesAccountedFor++;
            i += 2;
        } else {
            i++;
        }
    }
    //calc diff in trailing zeros.
    //this tells number of merges
    var currZeros = left_shift(currCopy);
    var nextCopy = copy_array(next_exp);

    var numMerges = 0;
    var currCount = 0;
    var nextCount = 0;
    var j = 3;
    while (currZeros[j] == 0) {j -= 1; currCount+=1;}
    j = 3;
    while (nextCopy[j] == 0) {j--; nextCount++;}
    numMerges = nextCount - currCount;
    var maxShifts = 0;
    var shifts = create_array(4);
    shifts[0] = 0;
    for (var i = 1; i < 4; i++) {
        shifts[i] = shiftsPast[i - 1] + shifts[i - 1];
        if (shifts[i] > maxShifts) {
            maxShifts = shifts[i];
        }
    }
    //account for unaccounted merges
    if (numMerges > numMergesAccountedFor) {
        var encounteredFirstMerger = 0;
        for (var i = 0; i < 4; i++) {
          if (encounteredFirstMerger == 1) {
            shifts[i] += 1;
          }
          if (currCopy[i] != 0 && encounteredFirstMerger == 0) {
            encounteredFirstMerger = 1;
          }
        }
    }
    //dont want to shift empty tiles
    for (var i = 0; i < 4; i++) {
        if (curr_exp[i] == 0) {
            shifts[i] = 0;
        }
    }
    return shifts;
}

function move_up(true_direction) {
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
            tiles[r][c].set_next(merged[r]);
        }

        // animate
        var shiftArr = shiftArray(column, copy_array(column));
        for (var i = 0; i < 4; i++) {
            var tile = tiles[i][c];
            if (shiftArr[i] != 0) {
                tile.set_moving(true); // need for LOSE check
                tile.set_direction(true_direction);
                if (true_direction == UP) {
                    tile.set_dxdy(0, -35*i);
                    tile.set_nxny(tile.x, tile.y - 128 * shiftArr[i]);
                } else if (true_direction == DOWN) {
                    tile.set_dxdy(0, 35*i);
                    tile.set_nxny(tile.x, tile.y + 128 * shiftArr[i]);
                } else if (true_direction == LEFT) {
                    tile.set_dxdy(-35*i, 0);
                    tile.set_nxny(tile.x - 128 * shiftArr[i], tile.y);
                } else if (true_direction == RIGHT) {
                    tile.set_dxdy(35*i, 0);
                    tile.set_nxny(tile.x + 128 * shiftArr[i], tile.y);
                }
            } else {
                tile.transfer();
            }
        }
    }
}

function add_new_tile() {
    var open = [];
    var j = 0
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            let tile = tiles[r][c];
            if (tile.moving && tile.next_value == 0) {
                open.push(j);
            } else if (!tile.moving && tile.value == 0) {
                open.push(j);
            }
            j += 1;
        }
    }
    if (open.length == 0) {
        // console.log("no open tiles", open, get_values());
        return;
    }
    var i = open[randint(open.length)];
    var r = Math.floor(i / 4);
    var c = i % 4;
    var tile = tiles[r][c];
    if (Math.random() < 0.5) {
        if (tile.moving) {
            tiles[r][c].set_next(2);
        } else {
            tiles[r][c].set_value(2);
        }
    	// console.log("adding new tile (2) to (" + i + ") [" + r + "][" + c + "]");
    } else {
        if (tile.moving) {
            tiles[r][c].set_next(4);
        } else {
            tiles[r][c].set_value(4);
        }
    	// console.log("adding new tile (4) to (" + i + ") [" + r + "][" + c + "]");
    }
} 

function get_values() {
    let values = create_array(4, 4);
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            values[r][c] = tiles[r][c].moving ? tiles[r][c].next_value : tiles[r][c].value;
        }
    }
    return values
}

function move() {
    if (upPressed) {
        move_up(UP);
    	add_new_tile();
    }
    else if (downPressed) {
        rotate_array(tiles, 2);
        move_up(DOWN);
        rotate_array(tiles, 2);
    	add_new_tile();
    }
    else if (leftPressed) {
        rotate_array(tiles, 1);
        move_up(LEFT);
        rotate_array(tiles, -1);
    	add_new_tile();
    }
    else if (rightPressed) {
        rotate_array(tiles, -1);
        move_up(RIGHT);
        rotate_array(tiles, 1);
    	add_new_tile();
    }
    setTimeout(turn_off_keys, 1)
}

function player_lost() {

    let values = get_values()

    // check for empty tiles
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (values[r][c] == 0) {
                return false;
            }
        }
    }

    // move up or down
    for (let r = 0; r < 4-1; r++) {
        for (let c = 0; c < 4; c++) {
            if (values[r][c] == values[r+1][c]) {
                return false;
            }
        }
    }

    // move left or right
    for (let c = 0; c < 4-1; c++) {
        for (let r = 0; r < 4; r++) {
            if (values[r][c] == values[r][c+1]) {
                return false;
            }
        }
    }

    return true;
}

function main() {
	move();
    print_tiles();
    draw_tiles();

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            tiles[r][c].move();
        }
    }

    if (player_has_2048 && !player_continues) {

        // background
        document.getElementById("body").style = "background-color: #FDFD96"

        //uncover restart and continue buttons.
        restartButton.style.display = "block";
        continueButton.style.display = "block";

        //erase tile printout
        document.getElementById("value").style.display = "none";

        //message
        document.getElementById("title").innerHTML = "You Win!"
        document.getElementById("title").style.color = "grey"

        KEYS_LOCKED = true;

    } else if (player_lost()) {

        console.log()

        // background
        document.getElementById("body").style = "background-color: #f2b195"

        //uncover restart button. that send to menu page
        restartButton.style.display = "block";

        //erase tile printout
        document.getElementById("value").style.display = "none";

        //message
        document.getElementById("title").innerHTML = "You Lose!"
        document.getElementById("title").style.color = "black"

        KEYS_LOCKED = true;
    } 
}
function init() {
    init_tiles();
    setInterval(main, 20);

    // move();
    // draw_tiles();
    // player_lost();
}
window.onload = init;