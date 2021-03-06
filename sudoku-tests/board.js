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
        //alert("board constructor")
        this.answer = puzzlePair.answer.myBoard;
        this.response = puzzlePair.response.myBoard;
        this.response_copy = copy2D(this.response);
        this.permanent_backend = copy2D(this.response_copy);
        this.setup_permanent();
        //alert("backend setup.")

        this.canvas = canvas;
        //this.canvas.addEventListener("resize", this.resizeCanvas, false);
        //this.canvas.addEventListener("orientationchange", this.resizeCanvas, false);
        //this.resizeCanvas();
        this.context = canvas.getContext("2d");
        //alert("backend setup.")

        this.mouseX = 0;
        this.mouseY = 0;
        this.currRow = -1;
        this.currCol = -1;
    }
    resizeCanvas() {
        //this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    gameOver() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (this.answer[i][j] != this.response[i][j]) {
                    //alert("not equal[" + i + "][" + j + "]: " + this.answer[i][j] + " " + this.response[i][j])
                    return false;
                }
            }
        }
        return true;
    }
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
    currentlyOnPermanent() {
        let p = this.permanent(this.currRow, this.currCol)
        //alert("permanent: " + p);
        return p;
    }
    permanent(r, c) {
        return this.permanent_backend[r][c] == "true";
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
        //alert("row: " + r + " col: " + c);
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

        //cell
        let canvas = this.canvas;
        let context = this.context;
        let oldLineWidth = context.lineWidth;
        let oldStrokeStyle = context.strokeStyle;
        context.lineWidth = 7;
        context.strokeStyle = "yellow";
        let r = this.currRow;
        let c = this.currCol;
        let x = c * canvas.width / 9;
        let y = r * canvas.height / 9;
        let w = canvas.width / 9;
        let h = canvas.height / 9;
        context.strokeRect(x, y, w, h);
        context.strokeStyle = oldStrokeStyle;
        context.lineWidth = oldLineWidth;
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

        //invert colors on row + col
        context.fillRect(0, y, canvas.width, h);//row
        context.fillRect(x, 0, w, canvas.height);//col
        //do not invert curr cell.
        let oldFillStyle = context.fillStyle;
        context.fillStyle = "white";
        context.fillRect(x, y, w, h);
        context.fillStyle = oldFillStyle;
        //color numbers with color opposite background
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
        //current number is white, so is background.
        //need to rewrite current number in black
        this.renderGiven(this.response[this.currRow][this.currCol], this.currRow, this.currCol);
    }
    //move content of this inside render given
    //also only check for boolean verify if r, c == currR, currC. 
    //////don't want to highlight all for now.???????  
    ///LONG TERM. TWO VERIFIES. (all) + (just curr) + (none)
    //inside here set a boolean. verify.
    verifyOff() {
        this.verify = false;
    }
    verifyOn() {
        this.verify = true;
/*        let canvas = this.canvas;
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
        context.fillStyle = oldFillStyle;*/
    }
    renderNumbers() {
        let response = this.response;
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                this.renderGiven(response[r][c], r, c);
            }
        }
    }
    saveInput(num) {
        let context = this.context;
        //alert("num: " + num);
        let r = this.currRow;
        let c = this.currCol;
        let original = this.response[r][c];
        //alert("i was here: " + original);
        if (original != ".") {
            //alert("already filled.");
            this.response[r][c] = num;
        } else {
            this.response[r][c] = num;
        }
        //alert(equal2D(this.response,  this.response_copy));
    }
    renderGiven(num, r, c) {
        let context = this.context;
        if (num == ".") {
            this.ink(r, c, "")
            //context.fillText("", this.colToX(c), this.rowToY(r));
        } else {
            //check if permanent here.
            if (this.permanent(r, c)) {
                this.ink(r, c, num)
            } else {
                this.pencil(r, c, num)
            }
        }
    }
    /*
    colToX(col) {
        let boxWidth = this.canvas.width/9
        let x = col * boxWidth + 10;
        return x
    }
    rowToY(row) {
        let boxHeight = this.canvas.height/9
        let y = row * boxHeight + 50;
        return y
    }
    */
    correct(r, c) {
        let ans = this.answer[r][c];
        let guess = this.response[r][c];
        return ans == guess;
    }
    pencil(row, col, num) {
        let context = this.context;
        //save old style info
        let oldFont = context.font;
        let oldStyle = context.fillStyle;
        //ink style
        context.font = "bold 42pt serif";
        context.fillStyle = "gray";
        if (this.verify) {
            if (this.correct(row, col)) {
                context.fillStyle = "green";
            } else {
                context.fillStyle = "red";
            }
        }
        //get x and y pos on canvas
        let boxWidth = this.canvas.width/9
        let boxHeight = this.canvas.height/9
        let x = col * boxWidth + 15;
        let y = row * boxHeight + 47;
        context.fillText(num, x, y);
        //revert to old style.
        context.font = oldFont;
        context.fillStyle = oldStyle;
    }
    ink(row, col, num) {
        let context = this.context;
        //save old style info
        let oldFont = context.font;
        let oldStyle = context.fillStyle;
        //ink style
        this.context.font = "48pt serif";
        //get x and y pos on canvas
        let boxWidth = this.canvas.width/9
        let boxHeight = this.canvas.height/9
        let x = col * boxWidth + 10;
        let y = row * boxHeight + 50;
        context.fillText(num, x, y);
        //revert to old style.
        context.font = oldFont;
        context.fillStyle = oldStyle;
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
