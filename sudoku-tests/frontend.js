var canvas = document.getElementById('canvas');
var form = document.getElementById('form');
var highlight = document.getElementById("highlight");
var verify = document.getElementById("verify");

var mouseAtDefault = true;

var puzzlePair = new PuzzlePair();
var board; 
function setup_board() {
    board = new Board(canvas, puzzlePair);
    canvas.addEventListener("click", function(e) {
        mouseAtDefault = false;
        board.setMouse(e.clientX-canvas.offsetLeft, e.clientY - canvas.offsetTop);
        if (!board.permanent()) {
            allowInput();
        }
        alert("highlight: " + highlight.checked)
    });
    board.render();
}
form.addEventListener("submit", function(e) {
  e.preventDefault()
  let input = document.getElementById("number").value
  alert("submission: " + input);
  board.writeWithPencil(input);
  alert("wrote with pencil");
  disallowInput()
})
function allowInput(){
  form.innerHTML = `<input id="number" type="text" autofocus="autofocus" name="number" value="" maxlength="1" pattern="[1-9]"><br> <input type="submit" value="Submit"> `
}
function disallowInput(){
  form.innerHTML = ""
}

function main() {
    board.render();
    if (!mouseAtDefault && highlight.checked) {
        board.renderHighlight();
    }
    if (!mouseAtDefault && verify.checked) {
        board.renderVerify();
    }
}
window.onload = setup_board;
window.setInterval(main, 1000);

