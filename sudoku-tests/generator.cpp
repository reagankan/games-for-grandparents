#include <iostream>
#include <vector>
#include <string>
#include <random>
#include <stdlib.h>
#include <time.h>
using namespace std;

class Solution {
public:
    int N;
    vector<vector<char>> myBoard;
    //row[rowIndex][number] = true, if number is in row[rowIndex].
    vector<vector<int>> rows, columns, boxes;
    void setup_caches(int n) {
        rows.resize(n);
        columns.resize(n);
        boxes.resize(n);
        for (int i = 0; i < n; ++i) {
            rows[i].resize(n + 1, 0);
            columns[i].resize(n + 1, 0);
            boxes[i].resize(n + 1, 0);
        }
    }
    int boxIndex(int row, int col) {
        return (row / 3) * 3 + col / 3;
    }
    bool fillable(int num, int r, int c) {
        return rows[r][num] + columns[c][num] + boxes[boxIndex(r,c)][num] == 0;
    }
    void writeNumber(char ch, int r, int c) {
        writeNumber((int) ch - '0', r, c);
    }
    void writeNumber(int num, int r, int c) {
        rows[r][num] = 1; 
        columns[c][num] = 1; 
        boxes[boxIndex(r, c)][num] = 1;
        myBoard[r][c] = (char)(num + '0');
    }
    void eraseNumber(int num, int r, int c) {
        rows[r][num] = 0;
        columns[c][num] = 0;
        boxes[boxIndex(r, c)][num] = 0;
        myBoard[r][c] = '.';
    }
    bool fillNext(int row, int col) {
        if (col == N - 1) {
            return backtrack(row + 1, 0);
        } else {
            return backtrack(row, col + 1);
        }
    }
    void printCell(int num, int row, int col) {
        cout << "[" << row << "][" << col << "] = " << num << endl;
    }
    bool backtrack(int row, int col) {
        if (row == N or col == N) {
            return true;
        }
        if (myBoard[row][col] == '.') {
            //try all numbers
            for (int i = 1; i <= 9; i++) {
                if (fillable(i, row, col)) {
                    //cout << "trying: "; printCell(i, row, col);
                    writeNumber(i, row, col);
                    bool success = fillNext(row, col);
                    //printCell(i, row, col);
                    if (not success) {
                        //cout << "tried: "; printCell(i, row, col); cout << "but failed" << endl;
                        eraseNumber(i, row, col);
                    } else {
                        //cout << "tried: "; printCell(i, row, col); cout << "and SUCCESS." << endl;
                        return success;
                    }
                }
            }
        } else {
            //cout << "already filled" << endl;
            return fillNext(row, col);
        }
        //cout << "cannot find any at: "; printCell('?', row, col);
        return false;
    }
    void solveSudoku(vector<vector<char>>& board) {
        solveSudoku(board, 0, 0);
    }
    void solveSudoku(vector<vector<char>>& board, int startRow, int startCol) {
        myBoard = board;
        N = myBoard.size();
        cout << N << endl;
        setup_caches(N);
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < N; c++) {
                if (board[r][c] != '.') {
                    writeNumber(board[r][c], r, c);
                }
            }
        }
        backtrack(startRow, startCol);
        board = myBoard;
    }
};
void print(string s) {
    cout << s << endl;
}
void printPuzzle(vector<vector<char>> v) {
    print("=========================");
    for (int r = 0; r < 9; r++) {
        string ret = "| ";
        for (int c = 0; c < 9; c++) {
            ret.push_back(v[r][c]);
            ret.push_back(' ');
            if ((c + 1) % 3 == 0) {
                ret += "| ";
            }
        }
        print(ret);
        if (r != 8 and (r + 1) % 3 == 0) {
            print("-------------------------");
        }
    }
    print("=========================");
}
void fillFirstRow(vector<vector<char>> &v) {
    for (int i = 0; i < 9; i++) {
        v[0].push_back(to_string(i + 1)[0]);
    }
    srand (time(NULL));
    unsigned seed = rand() % 100;
    shuffle(v[0].begin(), v[0].end(), default_random_engine(seed));
}
int main() {
    vector<vector<char>> puzzle(9);
    fillFirstRow(puzzle);
    for (int i = 1; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            puzzle[i].push_back('.');
        }
    }
    Solution solution = Solution();
    int startRow = 1, startCol = 0;
    solution.solveSudoku(puzzle, startRow, startCol);
    printPuzzle(puzzle);
}
