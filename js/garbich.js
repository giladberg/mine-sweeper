// function cellClicked(i, j) {
//     if (gGame.firstClick) firstClick(i,j)
//     if (gBoard[i][j].isShown) return
//     gBoard[i][j].isShown = true
//     if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) expandShown({ i, j }, gBoard)
//     printMat(gBoard, '.board-container')

// }

// function cellMarked(event, i, j) {
//     // event.preventDefault();
//     if (gGame.firstClick) firstClick(i,j)
//     if (gBoard[i][j].isMarked) {
//         gBoard[i][j].isMarked = false
//         gBoard[i][j].isShown = false
//         printMat(gBoard, '.board-container')
//         return
//     }
//     if (gBoard[i][j].isShown) return
//     if (event.button === 2) {
//         gBoard[i][j].isMarked = true
//         gBoard[i][j].isShown = true
//         printMat(gBoard, '.board-container')
//     }
// }