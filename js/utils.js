'use strict'
hideMenu()

function getRandomNumber(max) {
    return Math.floor(Math.random() * max + 1)
}

function getEmptyMins(board) {

    var emptySpaces = [];

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine && !gBoard[i][j].isShown) {
                emptySpaces.push({ i: i, j: j });
            }
        }
    }
    return emptySpaces;
}

function renderCell(pos) {
    var elCell = document.getElementById(`el-${pos.i}-${pos.j}`)
    var classColor = "shown";
    elCell.className = classColor;
    if (gBoard[pos.i][pos.j].minesAroundCount > 0) {
        elCell.innerText = gBoard[pos.i][pos.j].minesAroundCount;
    }

}

function hideMenu() {
    if (document.addEventListener) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function() {
            window.event.returnValue = false;
        });
    }
}