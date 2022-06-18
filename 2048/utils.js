var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var restartButton = document.getElementById('restartButton');
var continueButton = document.getElementById('continueButton');

var UP = "Up";
var DOWN = "Down";
var LEFT = "Left";
var RIGHT = "Right";


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

var valueToImgSrc = new Map([
    [0, "../images/tiles/empty.png"],
    [2, "../images/tiles/two.png"],
    [4, "../images/tiles/four.png"],
    [8, "../images/tiles/eight.png"],
    [16, "../images/tiles/one-six.png"],
    [32, "../images/tiles/three-two.png"],
    [64, "../images/tiles/six-four.png"],
    [128, "../images/tiles/one-two-eight.png"],
    [256, "../images/tiles/two-five-six.png"],
    [512, "../images/tiles/five-one-two.png"],
    [1024, "../images/tiles/one-zero-two-four.png"],
    [2048, "../images/tiles/two-zero-four-eight.png"],
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

function copy_array(arr) {
    var len = 0;
    for (let e of arr) {
        len += 1;
    }
    var copy = create_array(len);
    for (var i = 0; i < len; i++) {
        copy[i] = arr[i];
    }
    return copy;
}

function array_equal_2d(one, two) {
    for (let i = 0; i < one.length; i++) {
        for (let j = 0; j < one[0].length; j++) {
            if (one[i][j] !== two[i][j]) {
                console.log("not equal at ["+i+"]["+j+"]: ", one[i][j], two[i][j])
                console.log ("not equal one", one, one[i][j])
                console.log ("not equal two", two, two[i][j])
                return false;
            }
        }
    }
    return true;
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