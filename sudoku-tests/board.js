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

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.mouseX = 0;
        this.mouseY = 0;
    }
    clickHandler(x, y) {
        this.setMouse(x, y);
    }
    setMouse(x, y) {
        this.mouseX = x;
        this.mouseY = y;
        //alert("x: " + x + " y: " + y);
        var r = this.mouseRow();
        var c = this.mouseCol();
        alert("row: " + r + " col: " + c);
        this.renderPencil("X", r, c); 
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
    renderPencil(num, r, c) {
        let context = this.context;
        context.fillStyle = "black";
        context.font = "48px serif";
        //alert("num: " + num);
        let original = this.response[r][c];
        alert("i was here: " + original);
        if (original != ".") {
            alert("already filled.");
        } else {
            this.response[r][c] = num;
        }
        //alert(equal2D(this.response,  this.response_copy));
    }
    renderGiven(num, r, c) {
        let context = this.context;
        context.fillStyle = "black";
        context.font = "48px serif";
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
