'use strict'
const SMILE = '😃';
const MINE = '💩';
const FLAG = '⛳';

var gBoard;

var gLevel = { SIZE: 4, MINES: 2 };
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }


function initGame() {
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
    renderBoard(gBoard);
    console.log(gBoard);
}


function setMinesNegsCount(cellI, cellJ, board) {
    //Count mines around each cell and set the cell's minesAroundCount.
    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) minesAroundCount++;
        }
    }
    return minesAroundCount;

}


function cellMarked(elCell) {
    //Called on right click to mark a cell (suspected to be a mine)
    // Search the web (and implement) how to hide the context menu on right click
}

function checkGameOver() {
    //Game ends when all mines are marked, and all the other cells are shown
    return
}


function insertValues(board) {
    var cells = getEmptyMins(board);
    for (var i = 0; i < gLevel.MINES; i++) {
        var num = getRandomNumber(cells.length - 1);
        // console.log('iex: ', cells[num].i, ' jex: ', cells[num].j, ' num: ', num, ' mins: ', gLevel.MINES);
        board[cells[num].i][cells[num].j].isMine = true;
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (!currCell.isMine) {
                currCell.minesAroundCount = setMinesNegsCount(i, j, board);
            }
        }
    }
    return board;
}