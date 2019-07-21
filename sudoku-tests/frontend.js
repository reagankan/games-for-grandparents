document.getElementById("restartButton").style.display = "none";

var gameOver = false;
var restartButton = document.getElementById('restartButton');
function restart() {
    window.location.href = "sudoku.html";
}
restartButton.onclick = restart;

var canvas = document.getElementById('canvas');
var form = document.getElementById('form');
var highlight = document.getElementById("highlight");
var verify = document.getElementById("verify");

var mouseAtDefault = true;

var board; 
function run(difficulty) {
    var puzzlePair = new PuzzlePair(difficulty);
    board = new Board(canvas, puzzlePair);
    canvas.addEventListener("click", function(e) {
        mouseAtDefault = false;
        board.setMouse(e.clientX-canvas.offsetLeft, e.clientY - canvas.offsetTop);
        if (!board.currentlyOnPermanent()) {
            allowInput();
            form.focus();
        }
        alert("highlight: " + highlight.checked)
    });
    board.render();
}
form.addEventListener("submit", function(e) {
  e.preventDefault()
  let input = document.getElementById("number").value
  alert("submission: " + input);
  board.saveInput(input);
  alert("wrote with pencil");
  disallowInput()

  //check for game over
  gameOver = board.gameOver();
  alert(gameOver)
})
function allowInput(){
  form.innerHTML = `<input id="number" type="text" autofocus="autofocus" name="number" value="" maxlength="1" pattern="[1-9]"><br> <input type="submit" value="輸入"> `
  form.focus()
}
function disallowInput(){
  form.innerHTML = `1. 點一個單元格<br/>2. 輸入數字`
}

function main() {
    board.render();
    if (!mouseAtDefault && highlight.checked) {
        board.renderHighlight();
    }
    if (!mouseAtDefault) {
        if (verify.checked) {
            board.verifyOn();
        } else {
            board.verifyOff();
        }
    }
    if (gameOver) {
        //uncover restart button. that send to menu page
        restartButton.style.display = "block";
        document.getElementById("div1").style.display = "none";
        document.getElementById("div2").style.display = "none";
        document.getElementById("title").innerHTML = "yay, 數獨完整!"
        document.getElementById("title").style.color = "green"
        /*
        restartButton.style.font-size = "50px";
        restartButton.style.height =  10%;
        restartButton.style.width = 25%;
        restartButton.style.float = "center";
        restartButton.style.margin-left = "auto";
        restartButton.style.margin-right = "auto";
        restartButton.style.margin-bottom = "2%";
        restartButton.style.border = "1px solid black";
        restartButton.style.padding = "5%";
        */
    }
}
//window.onload = setup_board;
window.setInterval(main, 1000);
