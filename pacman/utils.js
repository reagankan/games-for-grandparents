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