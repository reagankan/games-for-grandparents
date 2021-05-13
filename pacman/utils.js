//global variables
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext("2d");
// var pacman_files = new Map([[dir.NONE, "pacman-right.png"],
//                             [dir.RIGHT, "pacman-right.png"],
//                             [dir.LEFT, "pacman-left.png"],
//                             [dir.UP, "pacman-up.png"],
//                             [dir.DOWN, "pacman-down.png"]]);

function createArray(length) {
	//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    if (arguments.length == 2) {
    	for (var j = 0; j < arr.length; j++) {
    		for (var k = 0; k < arr[j].length; k++) {
    			arr[j][k] = null;
    		}
    	}
    }
    return arr;
}

function dist(p1, p2, debug=false) {
	if (debug) {
	alert("in dist: p1 then p2")
	alert(p1)
	alert(p2)
	}
	return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

function getRange(start, end) {
	//start, end are [R,C]
	//return list of [R,C] between start and end.
	if (start == end) {
		return [start];
	}
	if (start[0] != end[0] && start[1] != end[1]) {
		return [];
	}
	var arr = new Array(start);
	if (start[0] == end[0]) {
		var i_0 = Math.min(start[1], end[1]);
		var i_n = Math.max(start[1], end[1]);
		for (var i = i_0; i <= i_n; i++) {
			arr.push([start[0], i]);
		}
	} else {
		var i_0 = Math.min(start[0], end[0]);
		var i_n = Math.max(start[0], end[0]);
		for (var i = i_0; i <= i_n; i++) {
			arr.push([i, start[1]]);
		}
	}
	return arr;
}

function addCoor(one, two) {
	return [[one[0] + two[0]], [one[1] + two[1]]]
}