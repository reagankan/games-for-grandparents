function print(s) {
    console.log(s);
}
function charToInt(c) {
    return c.charCodeAt() - '0'.charCodeAt();
}
function intToChar(i) {
    var base = '0'.charCodeAt();
    return String.fromCharCode(base + i).charAt(0);
}
function boxIndex(row, col) {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}
function printPuzzle(v) {
    print("=========================");
    for (var r = 0; r < 9; r++) {
        var ret = "| ";
        for (var c = 0; c < 9; c++) {
            ret += v[r][c];
            ret += ' ';
            if ((c + 1) % 3 == 0) {
                ret += '|';
                ret += ' ';
            }
        }
        print(ret);
        if (r != 8 && (r + 1) % 3 == 0) {
            print("-------------------------");
        }
    }
    print("=========================");
}
class Puzzle {
    constructor() {
        this.N = 0;
        var board = new PuzzleSeed().puzzle;
        this.myBoard = board;
        this.rows = [];
        this.columns = [];
        this.boxes = [];
        this.N = this.myBoard.length;
        //print("N: " + this.N);
        this.setup_backend(this.N);
        for (var r = 0; r < this.N; r++) {
            for (var c = 0; c < this.N; c++) {
                if (board[r][c] != '.') {
                    this.writeNumber(board[r][c], r, c);
                }
            }
        }
        print("Puzzle contructed");
        this.solve();
    }

    setup_backend(n) {
        for (var i = 0; i < n; ++i) {
            this.rows[i] = [0]
            this.columns[i] = [0]
            this.boxes[i] = [0]
            for (var val = 1; val <= 9; val++) {
                this.rows[i].push(0);
                this.columns[i].push(0);
                this.boxes[i].push(0);
            }
        }
        //print("row dim: " + this.rows.length + " : " + this.rows[0].length)
        //print("col dim: " + this.columns.length + " : " + this.columns[0].length)
        //print("box dim: " + this.boxes.length + " : " + this.boxes[0].length)
    }
    fillable(num, r, c) {
        //print("filling at"); this.printCell(num, r, c);
        var rowStatus = this.rows[r][num];
        var colStatus = this.columns[c][num];
        var boxStatus = this.boxes[boxIndex(r,c)][num];
        //print("r: " + rowStatus);
        //print("c: " + colStatus);
        //print("b: " + boxStatus);
        return this.rows[r][num] + this.columns[c][num] + this.boxes[boxIndex(r,c)][num] == 0;
    }
    writeNumber(charOrInt, r, c) {
        var num = 0;
        if (typeof charOrInt == "string") {
            num = charToInt(charOrInt);
        } else {
            num = charOrInt;
        }
        //print("writing: " + num + " @[" + r + "][" + c + "]");
        this.rows[r][num] = 1; 
        this.columns[c][num] = 1; 
        var bi = boxIndex(r, c);
        this.boxes[bi][num] = 1;
        this.myBoard[r][c] = intToChar(num);
    }
    eraseNumber(num, r, c) {
        this.rows[r][num] = 0;
        this.columns[c][num] = 0;
        this.boxes[boxIndex(r, c)][num] = 0;
        this.myBoard[r][c] = '.';
    }
    fillNext(row, col) {
        if (col == this.N - 1) {
            return this.backtrack(row + 1, 0);
        } else {
            return this.backtrack(row, col + 1);
        }
    }
    printCell(num, row, col) {
        print("[" + row + "][" + col + "] = " + num)
    }
    backtrack(row, col) {
        if (row == this.N || col == this.N) {
            return true;
        }
        if (this.myBoard[row][col] == '.') {
            //try all numbers
            //print("trying numbers");
            for (var i = 1; i <= 9; i++) {
                if (this.fillable(i, row, col)) {
                    //print("trying: "); this.printCell(i, row, col);
                    this.writeNumber(i, row, col);
                    var success = this.fillNext(row, col);
                    //print("success: " + success)
                    //printPuzzle(this.myBoard);
                    if (!success) {
                        //print( "tried: "); this.printCell(i, row, col); print( "but failed");
                        this.eraseNumber(i, row, col);
                    } else {
                        //print( "tried: "); this.printCell(i, row, col); print( "and SUCCESS");
                        return success;
                    }
                } else {
                    //print("not fillable");
                }
                //print("tried: " + i);
            }
        } else {
            //cout << "already filled" << endl;
            //print("already filled");
            return this.fillNext(row, col);
        }
        //cout << "cannot find any at: "; printCell('?', row, col);
        //print("cannot find any at: "); this.printCell('?', row, col);
        return false;
    }
    solve() {
        this.backtrack(0, 0);
        printPuzzle(this.myBoard);
        print("solved.");
        return this.myBoard;
    }
}

class PuzzleSeed {
constructor() {
    this.puzzle = [];
    for (var i = 0; i < 9; i++) {
        this.puzzle[i] = [];
    }
    this.puzzle = this.fillFirstRow(this.puzzle);
    for (var i = 1; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            this.puzzle[i].push('.');
        }
    }
}
shuffle(arr) {
    var curr = arr.length, temp, rand;
    while (0 !== curr) {
        //pick remaining elem
        rand = Math.floor(Math.random() * curr);
        curr -= 1;

        //swap with curr elem
        temp = arr[curr];
        arr[curr] = arr[rand];
        arr[rand] = temp;
    }
    return arr;
}
fillFirstRow(v) {
    for (var i = 0; i < 9; i++) {
        var val = intToChar(i+1);
        v[0].push(val);
    }
    this.shuffle(v[0]);
    return v;
}
}
function main() {
    var solution = new Puzzle();
}

main()
