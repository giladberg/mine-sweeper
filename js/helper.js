'use strict'

function randomizeMine(board, pos) {
    var location = { i: getRandomIntInclusive(0, gLevel.SIZE - 1), j: getRandomIntInclusive(0, gLevel.SIZE - 1) }
    for (var i = 0; i < gLevel.MINES; i++) {
        while (board[location.i][location.j].isMine || pos.i === location.i && pos.j === location.j) {
            location = { i: getRandomIntInclusive(0, gLevel.SIZE - 1), j: getRandomIntInclusive(0, gLevel.SIZE - 1) }
        }
        board[location.i][location.j].isMine = true
        location = { i: getRandomIntInclusive(0, gLevel.SIZE - 1), j: getRandomIntInclusive(0, gLevel.SIZE - 1) }
    }
}

function selectSymbol(cell) {
    if (cell.isMarked) return FLAG
    if (cell.isMine) return MINE
    else {
        if (cell.minesAroundCount === 0) return EMPTEY
        else return cell.minesAroundCount
    }
}

function setMinesNegsCount(board, i, j) {
   if(!gGame.manuallyPosition.on) randomizeMine(gBoard, { i, j })
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            var location = { i, j }
            cell.minesAroundCount = countNeighboars(location, board)
            if(!board[i][j].isMine) gGame.safeClick.stack.push({i,j})
        }
    }
}

function revealNeigh(i, j) {
    var stackExposeNeighbors = exposeNeighbors(gBoard, { i, j })
    gGame.hint.isHint = false
    setTimeout(() => {
        hideNeighnors(stackExposeNeighbors)
        printMat(gBoard, '.board-container')
    }, 1000)
}

function exposeNeighbors(board, pos) {
    var stackExposeNeighbors = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        // if i is out of bounderies - go to the next i 
        if (i < 0 || i > board.length - 1) continue;  //continue to the next i 

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            // if j is out of bounderies - go to the next j:
            if (j < 0 || j > board[0].length - 1) continue; // continue to the next j.
            if (!board[i][j].isShown) {
                var cell = { i, j }
                stackExposeNeighbors.push(cell)
                board[i][j].isShown = true
            }
        }
    }
    return stackExposeNeighbors
}
function hideNeighnors(stackExposeNeighbors) {
    for (var i = 0; i < stackExposeNeighbors.length; i++) {
        var pos = { i: stackExposeNeighbors[i].i, j: stackExposeNeighbors[i].j }
        gBoard[pos.i][pos.j].isShown = false
    }
}

function expandMines(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            if (cell.isMine) {
                cell.isShown = true
                cell.markAsMine = true
            }
        }
    }
}
function setNewWinner() {
    var topSec = 0
    var TopMin = 0
    switch (gLevel.SIZE) {
        case 4:
            topSec = localStorage.getItem("begginerSec")
            TopMin = localStorage.getItem("begginerMin")
            if (TopMin * 60 + topSec > gGame.time.min * 60 + gGame.time.sec || !localStorage.getItem("begginerMin")) {
                localStorage.setItem("begginerSec", gGame.time.sec);
                localStorage.setItem("begginerMin", gGame.time.min);
            }
            break;
        case 8:
            topSec = localStorage.getItem("mediumSec")
            TopMin = localStorage.getItem("mediumMin")
            if (TopMin * 60 + topSec > gGame.time.min * 60 + gGame.time.sec || !localStorage.getItem("mediumMin")) {
                localStorage.setItem("mediumSec", gGame.time.sec);
                localStorage.setItem("mediumMin", gGame.time.min);
            }
            break;
        case 12:
            topSec = localStorage.getItem("expertSec")
            TopMin = localStorage.getItem("expertMin")
            if (TopMin * 60 + topSec > gGame.time.min * 60 + gGame.time.sec || !localStorage.getItem("expertMin")) {
                localStorage.setItem("expertSec", gGame.time.sec);
                localStorage.setItem("expertMin", gGame.time.min);
            }
            break;
        default:
        // code block
    }
    printBestTime()
}