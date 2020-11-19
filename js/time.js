'use strict'

var gStartTime = null
var gIntervalId = null

function updateTime() {
    var diff = Date.now() - gStartTime
    var seconds = diff / 1000
    var secondsArr = (seconds + '').split('.')
    var elTime = document.querySelector('.time')
    var time = seconds < 10 ? '0' + parseInt(seconds) : parseInt(seconds)
    time += ':'
    time += secondsArr[1] < 10 ? '0' + secondsArr[1] : secondsArr[1] || '00'

    elTime.innerText = time
}

function resetTime() {
    gStartTime = null
    document.querySelector('.time').innerHTML = '00:00'

}

function startTimer(onTimeChange) {
    gIntervalId = setInterval(onTimeChange, 100)
}

function stopTimer() {
    clearInterval(gIntervalId)
    gIntervalId = null
}