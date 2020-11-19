'use strict'


var gBoard;
var isFirstClick = true;
var gLevel = { SIZE: 6, MINES: 4 };
var gGame = { isOn: false, shownCount: 0, markedCount: gLevel.MINES, secsPassed: 0, gLives: 3 }


function initGame() {
    smile('play');
    flag();
    occupied()
    lives()
    resetTime()
    stopTimer();
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    gGame.isOn = true;
    console.log(gBoard);
    checkGameOver(1)
}

function buildBoard(size) {
    console.log('Hello');
    var board = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push({
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false,
            })
        }
        board.push(row)
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var onCellClass = '';
            var cellClass = 'un-shown';
            strHTML += `<td id="el-${i}-${j}" data-i="${i}" data-j="${j}" class="${cellClass}" onmousedown="cellClicked(event, this)">
                            ${onCellClass}
                        </td>`
        }
        strHTML += '</tr>';
    }
    // console.log('strHTML is:');
    // console.log(strHTML);
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(event) {
    if (!gGame.isOn) {
        return
    }
    if (isFirstClick) {
        gBoard = insertValues(gBoard);
        isFirstClick = false;
    }
    stopTimer()
    if (!gStartTime) {
        gStartTime = new Date()
    }
    startTimer(updateTime)
    var elCell = event.target
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    if (gBoard[i][j].isShown) return
    if (event.button === 2) {
        cellMarked(elCell)
    } else if (event.button === 0) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        occupied();
        expandShown(gBoard, elCell, i, j);
    }
}

function expandShown(board, elCell, i, j) {
    var classColor;
    if (!gBoard[i][j].isShown) {
        gGame.shownCount++;
        occupied();
        gBoard[i][j].isShown = true;
    }
    if (gBoard[i][j].isMine) {
        gGame.shownCount--;
        occupied();
        elCell.innerText = MINE;
        classColor = "boom";
        elCell.className = classColor;
        checkGameOver(-1)
    } else if (gBoard[i][j].minesAroundCount > 0) {
        classColor = "shown";
        elCell.className = classColor;
        elCell.innerText = gBoard[i][j].minesAroundCount;
    } else if (gBoard[i][j].minesAroundCount === 0) {
        classColor = "shown";
        elCell.className = classColor;
        findNeighbors(board, i, j)
    }
    checkGameOver(1);
}

function findNeighbors(board, cellI, cellJ) {
    var res = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isShown) continue;
            if (gBoard[i][j].isMine) continue;
            if (gBoard[i][j].isMarked) continue;
            if (board[i][j].minesAroundCount === 0) {
                if (!gBoard[i][j].isShown) {
                    gGame.shownCount++;
                    occupied();
                    gBoard[i][j].isShown = true;
                }
                var elCell = document.getElementById(`el-${i}-${j}`)
                var classColor = "shown";
                elCell.className = classColor;
                var pos = { i: i, j: j }
                res.push(pos);
            }
            if (board[i][j].minesAroundCount > 0) {
                if (!gBoard[i][j].isShown) {
                    gGame.shownCount++;
                    occupied();
                    gBoard[i][j].isShown = true;
                }
                var elCell = document.getElementById(`el-${i}-${j}`)
                var classColor = "shown";
                elCell.className = classColor;
                elCell.innerText = gBoard[i][j].minesAroundCount;
            }
        }
    }
    var idx;
    var jdx;
    for (var index = 0; index < res.length; index++) {
        idx = res[index].i
        jdx = res[index].j
        checkGameOver(1)
        findNeighbors(board, idx, jdx);
    }
}

function insertValues(board) {
    var cells = getEmptyMins(board);
    for (var i = 0; i < gLevel.MINES; i++) {
        var num = getRandomNumber(cells.length - 1);
        board[cells[num].i][cells[num].j].isMine = true;
        cells.splice(num, 1);
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

function setMinesNegsCount(cellI, cellJ, board) {
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

    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = '';
        gGame.markedCount++;
        flag();
    } else if (!gBoard[i][j].isMarked) {
        if (gGame.markedCount > 0) {
            gBoard[i][j].isMarked = true;
            elCell.innerText = FLAG;
            gGame.markedCount--;
            flag();
        }
    }
}



function checkGameOver(num) {
    if (num < 0) {
        if (gGame.gLives > 0) {
            gGame.gLives--;
            lives();
            return;
        }
        isFirstClick = true;
        gGame = { isOn: false, shownCount: 0, markedCount: gLevel.MINES, secsPassed: 0, gLives: 3 }
        smile('gOver');
        lives();
        stopTimer()

        return console.log('Game Over!');
    }
    //Game ends when all mines are marked, and all the other cells are shown

    if (gGame.shownCount === ((gLevel.SIZE * gLevel.SIZE) - gLevel.MINES)) {
        smile('win');
        console.log('win');
        stopTimer()
        isFirstClick = true;
        gGame = { isOn: false, shownCount: 0, markedCount: gLevel.MINES, secsPassed: 0, gLives: 3 }

    }
}

function easy() {

    gLevel.SIZE = 6;
    gLevel.MINES = 4;
    isFirstClick = true;
    gGame = { isOn: false, shownCount: 0, markedCount: gLevel.MINES, secsPassed: 0, gLives: 3 }
    initGame()
}

function medium() {
    gLevel.SIZE = 9;
    gLevel.MINES = 10;
    isFirstClick = true;
    gGame = { isOn: false, shownCount: 0, markedCount: gLevel.MINES, secsPassed: 0, gLives: 3 }
    initGame()
}

function hard() {
    gLevel.SIZE = 16;
    gLevel.MINES = 40;
    isFirstClick = true;
    gGame = { isOn: false, shownCount: 0, markedCount: gLevel.MINES, secsPassed: 0, gLives: 3 }
    initGame()
}