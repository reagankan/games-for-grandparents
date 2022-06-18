var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var gameOver = false;

var valueToId = new Map([
	[0, "empty"],
	[2, "two"],
	[4, "four"],
	[8, "eight"],
	[16, "one-six"],
	[32, "three-two"],
	[64, "six-four"],
	[128, "one-two-eight"],
	[256, "two-five-six"],
	[512, "five-one-two"],
	[1024, "one-zero-two-four"],
	[2048, "two-zero-four-eight"],
]);

function create_array(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = create_array.apply(this, args);
    }

    return arr;
}

function rotate_clockwise(a) {
    var n=a.length;
    for (var i=0; i<n/2; i++) {
        for (var j=i; j<n-i-1; j++) {
            var tmp=a[i][j];
            a[i][j]=a[n-j-1][i];
            a[n-j-1][i]=a[n-i-1][n-j-1];
            a[n-i-1][n-j-1]=a[j][n-i-1];
            a[j][n-i-1]=tmp;
        }
    }
}	
function rotate_counterclockwise(a) {
    var n=a.length;
    for (var i=0; i<n/2; i++) {
        for (var j=i; j<n-i-1; j++) {
            var tmp=a[i][j];
            a[i][j]=a[j][n-i-1];
            a[j][n-i-1]=a[n-i-1][n-j-1];
            a[n-i-1][n-j-1]=a[n-j-1][i];
            a[n-j-1][i]=tmp;
        }
    }
}	
function rotate_array(a, i) {
	if (i > 0) {
		for (var j=0; j<i; j++) {
			rotate_clockwise(a);
		}
	} else {
		i = -1*i;
		for (var j=0; j<i; j++) {
			rotate_counterclockwise(a);
		}
	}
	
}	

function posX(r, c) {
    return c * 128;
}
function posY(r, c) {
    return r * 128;
}

function print(s) {
    var cout = document.getElementById("output");
    cout.innerText = cout.innerText + " \n" + s;
    cout.innerText = s;
}
function print_array(a) {
    var accum = "";
    for (let e of a) {
        accum += e + " ";
    }
    print(accum);
}


function randint(len) {
    return Math.floor(Math.random() * Math.floor(len));
}