var tiles = create_array(4, 4);
var tilesMoved = false;

function init_tiles() {

    // init empty
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            tiles[r][c] = new Tile("empty", posX(r, c), posY(r, c), 0);
        }
    }

    // pick two tiles
    var n1 = randint(4*4);
    var r = Math.floor(n1/4);
    var c = n1 % 4;
    tiles[r][c].set_value(Math.random() < 0.5 ? 2 : 4);

    var n2 = randint(4*4);
    while (n1 == n2) {
        n2 = randint(4*4);
    }
    r = Math.floor(n2/4);
    c = n2 % 4;
    tiles[r][c].set_value(Math.random() < 0.5 ? 2 : 4);

    // test game over
    // var values = [
    //     [4, 32, 16, 4],
    //     [2, 16, 64, 2],
    //     [16, 64, 8, 16],
    //     [2, 4, 2, 4]
    // ];

    // // test 2048
    // values = [
    //     [4, 32, 16, 4],
    //     [2, 16, 64, 2],
    //     [16, 2048, 8, 16],
    //     [2, 4, 2, 4]
    // ];

    // values = [
    //     [0,0,0,0],
    //     [0,0,0,0],
    //     [4,2,4,2],
    //     [2, 4, 2, 4]
    // ];
    // for (var r = 0; r < 4; r++) {
    //     for (var c = 0; c < 4; c++) {
    //         tiles[r][c].set_value(values[r][c]);
    //     }
    // }
}
function draw_tiles() {
    let blank_img = new Image();
    blank_img.src = valueToImgSrc.get(0);
    for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
            ctx.drawImage(blank_img, posX(r, c), posY(r, c), 128, 128);
        }
    }
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