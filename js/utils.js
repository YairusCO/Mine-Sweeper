'use strict'


function buildBoard(size, mins) {
    var board = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push({
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false,
            })
        }
        board.push(row)
    }

    return insertValues(board);
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            //  var currCell = board[i][j];
            var onCellClass = '';
            var cellClass = 'un-shown';
            strHTML += `<td id="el-${i}-${j}" data-i="${i}" data-j="${j}" class="${cellClass}" onclick="cellClicked(this)">
                            ${onCellClass}
                        </td>`
        }
        strHTML += '</tr>';
    }

    console.log('strHTML is:');
    console.log(strHTML);
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}
//style = "border: 1px solid grey;"

function cellClicked(elCell) {

    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    if (gBoard[i][j].isShown) return
        // console.log('i: ', i, ' j: ', j);
    expandShown(gBoard, elCell, i, j);
    // Update the DOM

    // blowUpNegs(i, j, gBoard)
}

function expandShown(board, elCell, i, j) {
    //When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
    // Update the model
    var classColor;
    gBoard[i][j].isShown = true;
    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE;
        classColor = "boom";
        elCell.className = classColor;
        checkGameOver()
    } else if (gBoard[i][j].minesAroundCount > 0) {
        classColor = "shown";
        elCell.className = classColor;
        elCell.innerText = gBoard[i][j].minesAroundCount;
    } else if (gBoard[i][j].minesAroundCount === 0) {
        console.log('hello1');
        classColor = "shown";
        elCell.className = classColor;
        findNeighbors(board, i, j)
    }

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
            if (board[i][j].minesAroundCount === 0) {
                board[i][j].isShown = true;
                var elCell = document.getElementById(`el-${i}-${j}`)
                var classColor = "shown";
                elCell.className = classColor;
                var pos = { i: i, j: j }
                console.log(pos);
                res.push(pos);
            }
            if (board[i][j].minesAroundCount > 0) {
                board[i][j].isShown = true;
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
        findNeighbors(board, idx, jdx);
    }
}



function getRandomNumber(max) {
    return Math.floor(Math.random() * max + 1)
}

function getEmptyMins(board) {

    var emptySpaces = [];

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
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
    //else if (gBoard[pos.i][pos.j].minesAroundCount === 0) { }
}