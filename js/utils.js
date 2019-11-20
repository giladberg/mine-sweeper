

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
    var ElTimer = document.querySelector(`.time`);
    ElTimer.innerText = `Game Time: ${minutes}:${seconds} minutes`
}

function countNeighboars(pos,board) {
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
