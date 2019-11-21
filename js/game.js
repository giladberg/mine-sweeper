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
    hint: { isHint: false, count: 3 },
    smiley: { normal: '😀', lose: '🙁', win: '😎' },
    life:3,
    score:0
}
var gElSmiley = document.querySelector(`.smiley`);
var gElHint = document.querySelector(`.hints`);
var gElTimer = document.querySelector(`.clock`);
var gElLife = document.querySelector(`.lifes`);
var gElModal = document.querySelector(`.modal`);

function initGame(size, mines) {
    if (gGame.time.interval) clearInterval(gGame.time.interval)
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.time.start = 0
    gGame.hint.count = 3
    gGame.life=3
    if (size && mines) {
        gLevel.SIZE = size
        gLevel.MINES = mines
    }
    gGame.firstClick = true
    gElSmiley.innerText = gGame.smiley.normal
    gElTimer.innerText = `00:00`
    document.querySelector('.board-container').addEventListener('contextmenu', event => event.preventDefault());
    gBoard = buildBoard()
    printMat(gBoard, '.board-container')
    printLife()
    printHints()
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
            var className=(cell.isAlert) ? 'alert ' : '';
            className+=(cell.isShown&& !cell.isMine && !cell.isMarked)? 'success ' :''
            var symbol = (cell.isShown) ? 'visible ' : 'hidden ';
            var hint = (gGame.hint.isHint) ? 'hintCell ' : ''
            if(cell.markAsMine)className='alert'
            cell = selectSymbol(cell)
            strHTML += `<td class="${className} ${hint}" onmousedown="cellClicked(event,${i},${j})"><div class="${symbol}">${cell}</div></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}
function cellClicked(event, i, j) {

    if (gGame.firstClick) firstClick(i, j)
    if (event.button === 0 && gGame.hint.isHint && gGame.isOn) revealNeigh(i, j) //when user clicked on hint
    else if (event.button === 2 && gGame.isOn && !gGame.hint.isHint) rightClicked(i, j)
    else if (event.button === 0 && gGame.isOn && !gGame.hint.isHint) leftClicked(i, j)
    printMat(gBoard, '.board-container')
    //  console.log(gGame.shownCount)
    // console.log(gGame.markedCount )
}
function leftClicked(i, j) {
    if (gBoard[i][j].isShown) return
    if(gGame.life>0 && gBoard[i][j].isMine){
        removeLife(i,j)
        return
    }
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
function firstClick(i, j) {
    gGame.time.start = Date.now()
    gGame.time.interval = setInterval(timer, 1000)
    setMinesNegsCount(gBoard, i, j)
    gGame.firstClick = false
}
function checkGameOver(i, j) {
    if (gGame.markedCount + gGame.shownCount === gLevel.SIZE * gLevel.SIZE) gameOver(true)
    if (gBoard[i][j].isMine && gGame.markedCount + gGame.shownCount !== gLevel.SIZE * gLevel.SIZE) gameOver(false)

}
function gameOver(isWin) {
    printMat(gBoard, '.board-container')
    gGame.isOn = false
    clearInterval(gGame.time.interval)
    gElModal.style='display:flex';
    if (!isWin) {
        expandMines(gBoard)
        gElModal.querySelector(`p`).innerText='You Lose'
        gElModal.querySelector(`p`).style='color:red'
        gElSmiley.innerHTML=gGame.smiley.lose
    }
    if (isWin){
        gElModal.querySelector(`p`).innerText='You Win'
        gElModal.querySelector(`p`).style='color:green'
        gElSmiley.innerHTML=gGame.smiley.win
    }
    setTimeout(()=>{
        gElModal.style='display:none';
    },6000)
}

function useHint() {
    if (gGame.hint.count === 0 || !gGame.isOn) return
    gGame.hint.isHint = true
    gGame.hint.count--;
    printHints()
    printMat(gBoard, '.board-container')
}

function removeLife(i,j){
    gGame.life--
    gBoard[i][j].isAlert=true
    printLife()
}

