'use strict'

const SMILE = '😃';
const MINE = '💩';
const FLAG = '⛳';
const UNI = '🦄';
const LZR = '🤕';
const LIVE = '❤️';
const OCC = '🤘';

function smile(str) {
    var elCell = document.querySelector('.smile');
    if (str === 'play') elCell.innerHTML = SMILE;
    if (str === 'gOver') elCell.innerHTML = LZR;
    if (str === 'win') elCell.innerHTML = UNI;
}

function flag() {
    var elCell = document.querySelector('.flag');
    var str = FLAG + ': ' + gGame.markedCount
    elCell.innerHTML = str;
}

function occupied() {
    var elCell = document.querySelector('.occupied');
    var str = OCC + ': ' + gGame.shownCount;
    elCell.innerHTML = str;
}


function lives() {
    var elCell = document.querySelector('.lives');
    var str = LIVE + ': ' + gGame.gLives;
    elCell.innerHTML = str;
}