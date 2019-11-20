'use strict'
var EMPTEY = ''
var MINE = '💣'
var FLAG = '🚩'
var gBoard;
var gLevel = { SIZE: 12, MINES: 30 };
var gGame = {
    isOn: false, shownCount: 0,
    markedCount: 0,
    firstClick: true,
    time: { start: 0, interval: '' },
    hint: { isHint: false, count: 3 }
}

function initGame(size, mines) {
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.time.start = 0
    gGame.hint.count = 3
    gLevel.SIZE = size
    gLevel.MINES = mines
    gGame.firstClick = true
    var ElTimer = document.querySelector(`.time`);
    ElTimer.innerText = `Game Time: 0:0 minutes`
    document.querySelector('.board-container').addEventListener('contextmenu', event => event.preventDefault());
    gBoard = buildBoard()
    printMat(gBoard, '.board-container')


}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,//if open
                isMine: false, // if mine
                isMarked: false,// if flag
            };
        }
    }
    return board;
}

function printMat(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j + ' ';
            var symbol = (cell.isShown) ? 'visible ' : 'hidden ';
            var hint = (gGame.hint.isHint) ? 'hintCell ' : ''
            cell = selectSymbol(cell)
            strHTML += `<td class="${className} ${hint}" onmousedown="cellClicked(event,${i},${j})"><div class="${symbol}">${cell}</div></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function setMinesNegsCount(board, i, j) {
    randomizeMine(gBoard, { i, j })
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            var location = { i, j }
            cell.minesAroundCount = countNeighboars(location, board)
        }
    }
}
function cellClicked(event, i, j) {
    if (gGame.firstClick) firstClick(i, j)
    if (event.button === 2 && gGame.isOn) rightClicked(i, j)
    else if (event.button === 0 && gGame.isOn) leftClicked(i, j)
    printMat(gBoard, '.board-container')
    // console.log(gGame.shownCount)
    //console.log(gGame.markedCount)
}
function leftClicked(i, j) {
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isShown = true
    gGame.shownCount++
    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) expandShown({ i, j }, gBoard)
    checkGameOver(i, j)
}
function rightClicked(i, j) {
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gBoard[i][j].isShown = false
        if (gBoard[i][j].isMine) gGame.markedCount--
    }
    else if (gBoard[i][j].isShown) return
    else {
        gBoard[i][j].isMarked = true
        gBoard[i][j].isShown = true
        if (gBoard[i][j].isMine) gGame.markedCount++
        if (gGame.markedCount + gGame.shownCount === gLevel.SIZE * gLevel.SIZE) checkGameOver(i, j)
    }
}
function checkGameOver(i, j) {
    if (gGame.markedCount + gGame.shownCount === gLevel.SIZE * gLevel.SIZE) gameOver(true)
    if (gBoard[i][j].isMine) gameOver(false)

}
function randomizeMine(board, pos) {
    var location = { i: getRandomIntInclusive(0, gLevel.SIZE - 1), j: getRandomIntInclusive(0, gLevel.SIZE - 1) }
    for (var i = 0; i < gLevel.MINES; i++) {
        while (board[location.i][location.j].isMine && pos.i !== location.i && pos.j !== location.j) {
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

function expandShown(pos, board) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        // if i is out of bounderies - go to the next i 
        if (i < 0 || i > board.length - 1) continue;  //continue to the next i 

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            // if j is out of bounderies - go to the next j:
            if (j < 0 || j > board[0].length - 1) continue; // continue to the next j.

            if (i === pos.i && j === pos.j) continue;
            if (!board[i][j].isMine) {
                leftClicked(i, j)
            }
        }
    }
}

function expandMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            if (cell.isMine) cell.isShown = true
        }
    }

}

function firstClick(i, j) {
    gGame.time.start = Date.now()
    gGame.time.interval = setInterval(timer, 1000)
    setMinesNegsCount(gBoard, i, j)
    gGame.firstClick = false
}

function gameOver(isWin) {
    printMat(gBoard, '.board-container')
    gGame.isOn = false
    clearInterval(gGame.time.interval)
    if (!isWin){
        expandMines(gBoard)
        //alert('game over')
    } 
    if (isWin) alert('you win')
}

// function hint() {
//     if (gGame.hint.count < 0) return
//     gGame.hint.isHint = true
//     gGame.hint.count--;
//     var ElHint = document.querySelector(`.hint-txt`);
//     ElHint.innerText = ` press for hint you have ${gGame.hint.count} more`
//     printMat(gBoard, '.board-container')
// }

