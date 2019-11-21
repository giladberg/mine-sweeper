
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function timer() {
    var timePassed = Date.now() - gGame.time.start;
    var seconds = Math.floor((timePassed % (1000 * 60)) / 1000);
    var minutes = Math.floor((timePassed % (1000 * 60 * 60)) / (1000 * 60));
    gGame.time.sec = seconds
    gGame.time.min = minutes
    if (seconds < 10) seconds = `0${seconds}`
    if (minutes < 10) minutes = `0${minutes}`
    gElTimer.innerText = ` ${minutes}:${seconds}`
    var color = getRandomColor()
    gElTimer.style = `border:4px dotted ${color}; color:${color};`
}

function countNeighboars(pos, board) {
    var neighboarsCount = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        // if i is out of bounderies - go to the next i 
        if (i < 0 || i > board.length - 1) continue;  //continue to the next i 

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            // if j is out of bounderies - go to the next j:
            if (j < 0 || j > board[0].length - 1) continue; // continue to the next j.

            if (i === pos.i && j === pos.j) continue;
            if (board[i][j].isMine) neighboarsCount++;
        }
    }
    return neighboarsCount;
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function printLife() {
    var life = '❤️'
    var dead = '🖤'
    var strHTML = '<p>life</p>'
    for (var i = 3 - gGame.life; i > 0; i--) {
        strHTML += `<span class="life">${dead}</span>`
    }
    for (var i = 0; i < gGame.life; i++) {
        strHTML += `<span class="life">${life}</span>`
    }
    gElLife.innerHTML = strHTML
}

function printHints() {
    var off = '<img src="./photo/hint.png" alt="">';
    var on = '<img src="./photo/light.png" alt="">';
    var strHTML = '<button onclick="useHint()">hint</button>'
    for (var i = 0; i < gGame.hint.count; i++) {
        strHTML += on;
    }
    for (var i = gGame.hint.count; i < 3; i++) {
        strHTML += off
    }
    gElHint.innerHTML = strHTML
}

function printBestTime() {
    var topSec = 0
    var TopMin = 0
    var strHTML = '<span>The best time is:</span>'

    switch (gLevel.SIZE) {
        case 4:
            if (!localStorage.getItem("begginerMin")) {
                strHTML = `<span>No best time yet</span>`
                gElBestTime.innerHTML = strHTML
                return
            }
            topSec = localStorage.getItem("begginerSec")
            TopMin = localStorage.getItem("begginerMin")
            break;
        case 8:
            if (!localStorage.getItem("mediumMin")) {
                strHTML = `<span>No best time yet</span>`
                gElBestTime.innerHTML = strHTML
                return
            }
            topSec = localStorage.getItem("mediumSec")
            TopMin = localStorage.getItem("mediumMin")
            break;
        case 12:
            if (!localStorage.getItem("expertMin")) {
                strHTML = `<span>No best time yet</span>`
                gElBestTime.innerHTML = strHTML
                return
            }
            topSec = localStorage.getItem("expertSec")
            TopMin = localStorage.getItem("expertMin")
            break;
        default:
    }
    if (topSec < 10) topSec = `0${topSec}`
    if (TopMin < 10) TopMin = `0${TopMin}`
    strHTML += `<span>${TopMin}:${topSec}</span>`
    gElBestTime.innerHTML = strHTML
}

function removeMatCellFromArr(arr,location){
    for(var i=0;i<arr.length;i++){
        if(arr[i].i===location.i && arr[i].j === location.j)arr.splice(i,1)
    }
}