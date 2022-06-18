var tiles = create_array(4, 4);
var tilesMoved = false;

function init_tiles() {
    var row = randint(4);
    var col = randint(4);
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            if (row == r && col == c) {
                if (Math.random() < 0.5) {
                    tiles[r][c] = new Tile("two", posX(r, c), posY(r, c), 2);
                } else {
                    tiles[r][c] = new Tile("four", posX(r, c), posY(r, c), 4);
                }
            } else {
                if (Math.random() < 0.6) {
                    tiles[r][c] = new Tile("empty", posX(r, c), posY(r, c), 0);
                } else {
                    tiles[r][c] = new Tile("two", posX(r, c), posY(r, c), 2);
                }
            }
        }
    }

    print(r + ", " + c);
}
function draw_tiles() {
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            tiles[r][c].draw(); 
        }
    }
}
function print_tiles() {
    var text = "";
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            text += tiles[r][c].value + " ";
        }
        text += "\n";
    }
    document.getElementById("value").innerText = text;
}