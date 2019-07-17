function copy2D(currentArray) {
var newArray = currentArray.map(function(arr) {
    return arr.slice();
});
return newArray;
}
function equal2D(one, two) {
    var dim1 = one.length;
    var dim2 = one[0].length;
    for (var i = 0; i < dim1; i++) {
        for (var j = 0; j < dim2; j++) {
            if (one[i][j] != two[i][j]) {
                return false;
            }
        }
    }
    return true;
}
class Board{
    constructor(canvas, puzzlePair){
        this.answer = puzzlePair.answer.myBoard;
        this.response = puzzlePair.response.myBoard;
        this.response_copy = copy2D(this.response);
        this.permanent_backend = copy2D(this.response_copy);
        this.setup_permanent();

        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.context.font = "48px serif";

        this.mouseX = 0;
        this.mouseY = 0;
        this.currRow = -1;
        this.currCol = -1;
    }
/*    write(num) {
        this.writeWithPencil(num, this.
    }
    */
    setup_permanent() {
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                if (this.response[r][c] != ".") {
                    this.permanent_backend[r][c] = "true";
                } else {
                    this.permanent_backend[r][c] = "false";
                }
            }
        }
    }
    permanent() {
        let p = this.permanent_backend[this.currRow][this.currCol] == "true";
        alert("permanent: " + p);
        return p;
    }
    clickHandler(x, y) {
        this.setMouse(x, y);
    }
    setMouse(x, y) {
        this.mouseX = x;
        this.mouseY = y;
        //alert("x: " + x + " y: " + y);
        this.currRow = this.mouseRow();
        this.currCol = this.mouseCol();
        var r = this.mouseRow();
        var c = this.mouseCol();
        alert("row: " + r + " col: " + c);
        //this.writeWithPencil("X", r, c); 
    }
    mouseRow() {
        var row = Math.floor((this.mouseY)/(500/9))
        if(row === 9){
            row = 8
        }
        return row
    }
    mouseCol() {
        var col = Math.floor((this.mouseX)/(500/9))
        return col;
    }
    render() {
        this.renderGridLines();
        this.renderNumbers();
    }
    renderHighlight() {
        let canvas = this.canvas;
        let context = this.context;

        let r = this.currRow;
        let c = this.currCol;

        let x = c * canvas.width / 9;
        let y = r * canvas.height / 9;
        
        let w = canvas.width / 9;
        let h = canvas.height / 9;

        //fill row + col
        context.fillRect(0, y, canvas.width, h);//row
        context.fillRect(x, 0, w, canvas.height);//col
        let oldFillStyle = context.fillStyle;
        context.fillStyle = "white";
        context.fillRect(x, y, w, h);
        context.fillStyle = oldFillStyle;
        this.rewriteCoveredNumbers()

        //outline box + cell
        let oldLineWidth = context.lineWidth;
        context.lineWidth = 7;
        let oldStrokeStyle = context.strokeStyle;
        context.strokeStyle = "yellow";
        //cell
        context.strokeRect(x, y, w, h);
        //box
        let nx = 3 * Math.floor(c/3);
        nx = nx * canvas.width/9;
        let ny = 3 * Math.floor(r/3);
        ny = ny * canvas.height/9;
        context.strokeRect(nx, ny, 3*w, 3*h);
        context.strokeStyle = oldStrokeStyle;
        context.lineWidth = oldLineWidth;
    }
    rewriteCoveredNumbers() {
        let context = this.context;
        let oldFillStyle = context.fillStyle;
        context.fillStyle = "white";
        //row
        for (let c = 0; c < 9; c++) {
            if (c != this.currCol) {
            this.renderGiven(this.response[this.currRow][c], this.currRow, c);
            }
        }
        //col
        for (let r = 0; r < 9; r++) {
            if (r != this.currRow) {
            this.renderGiven(this.response[r][this.currCol], r, this.currCol);
            }
        }
        context.fillStyle = oldFillStyle;
    }
    //move content of this inside render given
    //also only check for boolean verify if r, c == currR, currC. 
    //////don't want to highlight all for now.???????  
    ///LONG TERM. TWO VERIFIES. (all) + (just curr) + (none)
    //inside here set a boolean. verify.
    renderVerify() {
        let canvas = this.canvas;
        let context = this.context;

        let r = this.currRow;
        let c = this.currCol;

        let x = c * canvas.width / 9;
        let y = r * canvas.height / 9;
        
        let w = canvas.width / 9;
        let h = canvas.height / 9;

        let ans = this.answer[r][c];
        let guess = this.response[r][c];
        let correct = ans == guess;

        let oldFillStyle = context.fillStyle;
        if (correct) {
            context.fillStyle = "green";
        } else {
            context.fillStyle = "red";
        }
        this.renderGiven(guess, r, c);
        context.fillStyle = oldFillStyle;
    }
    renderNumbers() {
        let response = this.response;
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                this.renderGiven(response[r][c], r, c);
            }
        }
    }
    colToX(col) {
        let boxWidth = this.canvas.width/9
        return col * boxWidth + 15;
    }
    rowToY(row) {
        let boxHeight = this.canvas.height/9
        return row * boxHeight + 45;
    }
    writeWithPencil(num) {
        let context = this.context;
        //alert("num: " + num);
        let r = this.currRow;
        let c = this.currCol;
        let original = this.response[r][c];
        alert("i was here: " + original);
        if (original != ".") {
            alert("already filled.");
            this.response[r][c] = num;
        } else {
            this.response[r][c] = num;
        }
        //alert(equal2D(this.response,  this.response_copy));
    }
    renderGiven(num, r, c) {
        let context = this.context;
        if (num == ".") {
            context.fillText("", this.colToX(c), this.rowToY(r));
        } else {
            context.fillText(num, this.colToX(c), this.rowToY(r));
        }
    }
    renderGridLines() {
        let canvas = this.canvas;
        let height = canvas.height
        let width = canvas.width

        let h = canvas.height/9
        let w = canvas.width/9

        let context = this.context
        context.clearRect(0, 0, width, height)
        for(let i = 0; i<=9; i++){
            context.beginPath();
            context.moveTo(0, i*h)
            context.lineTo(width, i*h);
            context.moveTo(i*w, 0)
            context.lineTo(i*w, height);
            if( i %3 == 0){
                context.lineWidth = 5
                context.stroke()
            }
            else{
                context.lineWidth = 1
                context.stroke()
            }
        }
    }
}
