var canvas = document.getElementById('canvas');

var puzzlePair = new PuzzlePair();
var board; 
function setup_board() {
    board = new Board(canvas, puzzlePair);
    canvas.addEventListener("click", function(e) {
        board.clickHandler(e.clientX-canvas.offsetLeft, e.clientY - canvas.offsetTop);
    });
    board.render();
}
function main() {
    board.render();
}
window.onload = setup_board;
window.setInterval(main, 1000);

