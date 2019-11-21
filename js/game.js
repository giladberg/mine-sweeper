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
    time: { start: 0, interval: '',sec:0,min:0 },
    hint: { isHint: false, count: 3 },
    smiley: { normal: '😀', lose: '🙁', win: '😎' },
    life:3,
    safeClick:{amount:3,stack:[]},
    manuallyPosition:{on:false,amount:0}
}
var gElTitle = document.querySelector(`.title`);
var gElSmiley = document.querySelector(`.smiley`);
var gElHint = document.querySelector(`.hints`);
var gElTimer = document.querySelector(`.clock`);
var gElLife = document.querySelector(`.lifes`);
var gElModal = document.querySelector(`.modal`);
var gElBestTime = document.querySelector(`.bestTime`);
var gElSafeClick = document.querySelector(`.safe-click`);

function initGame(size, mines) {
    if (gGame.time.interval) clearInterval(gGame.time.interval)
    gGame.isOn = true
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.time.start = 0
    gGame.hint.count = 3
    gGame.life=3
    gGame.safeClick.amount=3
    if (size && mines) {
        gLevel.SIZE = size
        gLevel.MINES = mines
    }
    gGame.firstClick = true
    gElSmiley.innerText = gGame.smiley.normal
    gElSafeClick.innerText=`${gGame.safeClick.amount} Safe click`
    gElTimer.innerText = `00:00`
    document.querySelector('.board-container').addEventListener('contextmenu', event => event.preventDefault());
  if(!gGame.manuallyPosition.on) gBoard = buildBoard()
    printMat(gBoard, '.board-container')
    printLife()
    printHints()
    printBestTime()
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
            var hint = (gGame.hint.isHint) ? 'hintCell ' : '';
            if(cell.safeClick) className='safe'
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
    if(gGame.manuallyPosition.on && gGame.manuallyPosition.amount>0){
        activeManuallPos(i,j)
        return
    }
    if (gGame.firstClick && gGame.isOn) firstClick(i, j)
    if (event.button === 0 && gGame.hint.isHint && gGame.isOn) revealNeigh(i, j) //when user clicked on hint
    else if (event.button === 2 && gGame.isOn && !gGame.hint.isHint) rightClicked(i, j)
    else if (event.button === 0 && gGame.isOn && !gGame.hint.isHint) leftClicked(i, j)
    printMat(gBoard, '.board-container')
}
function leftClicked(i, j) {
    if (gBoard[i][j].isShown) return
    if(gGame.life>0 && gBoard[i][j].isMine){
        removeLife(i,j)
        return
    }
    gBoard[i][j].isShown = true
    removeMatCellFromArr(gGame.safeClick.stack,{i,j})
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
        if (i < 0 || i > board.length - 1) continue; 
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue; 
            if (i === pos.i && j === pos.j) continue;
            if (!board[i][j].isMine) {
                leftClicked(i, j)
            }
        }
    }
}
function firstClick(i, j) {
    
    if(!gGame.isOn)return
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
            setNewWinner()  
    }
    setTimeout(()=>{
        gElModal.style='display:none';
    },6000)
    gGame.manuallyPosition.on=false
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

function safeClick(){
    var i=getRandomIntInclusive(0, gGame.safeClick.stack.length-1)
    if(!gGame.safeClick.stack[i] || gGame.firstClick ||gGame.safeClick.amount===0)return
    var j=gGame.safeClick.stack[i].j
    i=gGame.safeClick.stack[i].i  
    gBoard[i][j].safeClick=true
    printMat(gBoard, '.board-container')
    gGame.safeClick.amount--
    gElSafeClick.innerText=`${gGame.safeClick.amount} Safe click`
    setTimeout(()=>{
        gBoard[i][j].safeClick=false
        printMat(gBoard, '.board-container')
    },2000)
}

function manuallyPosition(){
    if(!gGame.firstClick || gGame.manuallyPosition.on)return
    gGame.isOn=false
    gGame.manuallyPosition.amount=gLevel.MINES
    gGame.manuallyPosition.on=true
    gElTitle.innerText=`You have more ${gGame.manuallyPosition.amount} to put`
}

function activeManuallPos(i,j){
    if(gGame.manuallyPosition.amount>0){
        gBoard[i][j].isMine = true
        gGame.manuallyPosition.amount--
        gElTitle.innerText=`You have more ${gGame.manuallyPosition.amount} to put`
    }
    if(gGame.manuallyPosition.amount===0){
        gGame.isOn=true
        gElTitle.innerText=`Welcome to Mine Sweeper`
        initGame()
    }
}

