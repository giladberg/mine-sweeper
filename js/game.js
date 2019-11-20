'use strict'
var EMPTEY = ''
var MINE = '💣'
var FLAG = '🚩'
var gBoard;
var gLevel = { SIZE: 12, MINES: 30 };
var gGame = {
    isOn: false, shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true,
    time: { start: 0, interval: '' }
}




function initGame(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    gGame.firstClick = true
    document.querySelector('.board-container').addEventListener('contextmenu', event => event.preventDefault());
    gBoard = buildBoard()
    printMat(gBoard, '.board-container')
    console.table(gBoard)

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
            cell = selectSymbol(cell)
            strHTML += `<td class="${className}" onclick="cellClicked(${i},${j})" onmousedown="cellMarked(event,${i},${j})"><div class="${symbol}">${cell}</div></td>`
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


function cellClicked(i, j) {
    if (gGame.firstClick) firstClick(i,j)
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isShown = true
    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) expandShown({ i, j }, gBoard)
    printMat(gBoard, '.board-container')

}

function cellMarked(event, i, j) {
    // event.preventDefault();
    if (gGame.firstClick) firstClick(i,j)
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gBoard[i][j].isShown = false
        printMat(gBoard, '.board-container')
        return
    }
    if (gBoard[i][j].isShown) return
    if (event.button === 2) {
        gBoard[i][j].isMarked = true
        gBoard[i][j].isShown = true
        printMat(gBoard, '.board-container')
    }
}

function checkGameOver() {

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
                cellClicked(i, j)
            }
        }
    }
}

function expandMines(board){
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            if(cell.isMine) cell.isShown=true
        }
    }

}

function firstClick(i,j){
    gGame.time.start = Date.now()
    gGame.time.interval = setInterval(timer, 1000)
    setMinesNegsCount(gBoard, i, j)
    gGame.firstClick = false
}

