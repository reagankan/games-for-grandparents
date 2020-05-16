function createArray(length) {
	//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
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