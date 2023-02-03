const homeScreen = (() => {
    const homeScreen = document.querySelector('.homeScreen');
    const startbutton = document.querySelector('.startGame');
    const cardplayer = document.querySelectorAll('.player');
    const cardbot = document.querySelectorAll('.bot');
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const humanGif = "https://media3.giphy.com/media/l41lGnxllmN3YqOyI/giphy.gif?cid=790b76113368c4979810fb9937cd32fde75df57029a73d06&rid=giphy.gif&ct=g";
    const botGif = "https://media1.giphy.com/media/xT77XUw1XMVGIxgove/giphy.gif?cid=790b7611a983627e3fcc436e051819772699d42fccc66822&rid=giphy.gif&ct=g";

    for(let i = 0; i < 2; i++) {
        cardplayer[i].addEventListener('click', (e) => {
            e.target.classList.add('keepTransition');
            chosenPlayer(i, e.target.classList[1], e.target.textContent);
            changeGif(i)
            showStartbutton()
            if(cardbot[i].classList.contains('keepTransition')) {
                cardbot[i].classList.remove('keepTransition');
                cardbot[i].classList.add('endTransition');
                window.setTimeout(() => cardbot[i].classList.remove('endTransition'), 300);
            }
        })
    
        cardbot[i].addEventListener('click', (e) => {
            e.target.classList.add('keepTransition');
            botType(e, cardplayer[i].classList.contains('keepTransition'))
            chosenPlayer(i, e.target.classList[1], e.target.textContent);
            changeGif(i)
            showStartbutton()
            if(cardplayer[i].classList.contains('keepTransition')) {
                cardplayer[i].classList.remove('keepTransition');
                cardplayer[i].classList.add('endTransition');
                window.setTimeout(() => cardplayer[i].classList.remove('endTransition'), 300);
            }
        })
    }

    const botType = (e, checkIfFirstSwitch) => {
        
        if(checkIfFirstSwitch === true) {
            if(e.target.textContent === 'Bot') {
                return e.target.textContent = 'Easy';
            }
            return;
        } else {
            changeBotDifficulty(e);
        }
  
    }

    const changeBotDifficulty = (e) => {
        switch(e.target.textContent) {
            case 'Easy':
                return e.target.textContent = 'Hard';
            case 'Hard':
               return e.target.textContent = 'Impossible';
            case 'Impossible':
               return e.target.textContent = 'Easy';
            default:
               return e.target.textContent = 'Easy';
        }
    }

    let chosenPlayer1 = null;
    let chosenPlayer2 = null;

    const chosenPlayer = (cardNumber, choice, botType) => {
        if(choice === 'bot') {
            if(cardNumber === 0) {
                 return chosenPlayer1 = botType +' bot';
            } else {
                 return chosenPlayer2 = botType +' bot';
            }
        } 

        if(Number(cardNumber) === 0) {
            return chosenPlayer1 = choice;
        } else {
            return chosenPlayer2 = choice;
        }
            
    }

    const getPlayer = (number) => {
        if(chosenPlayer1 === null || chosenPlayer2 === null) return;
        return number === 0 ? chosenPlayer1 : chosenPlayer2;
    }

    const showStartbutton = () => {
        if(chosenPlayer1 !== null && chosenPlayer2 !== null) {
            window.setTimeout(() => startbutton.style.display = 'inline-block', 500);
            
        }
    }

    const changeGif = (cardNumber) => {
        switch(cardNumber) {
            case 0:
                if(chosenPlayer1 === null) 
                return;
                if(chosenPlayer1 !== 'player') {
                    if(img1.src === botGif) 
                    return;
                    img1.src = botGif;
                } else {
                    if(img1.src === humanGif) 
                    return;
                    img1.src = humanGif;
                }

            case 1:
                if(chosenPlayer2 === null) 
                return;
                if(chosenPlayer2 !== 'player') {
                    if(img2.src === botGif) 
                    return;
                    img2.src = botGif;
                } else {
                    if(img2.src === humanGif) 
                    return;
                    img2.src = humanGif;
                }
        }
    }

    startbutton.addEventListener('click', (e) => {
        gameBoard.updatePlayer(0, chosenPlayer1);
        gameBoard.updatePlayer(1, chosenPlayer2);
        displayController.showBoard();
        homeScreen.style.display = 'none';
    })
    
   return {getPlayer}
})()


const Player = (sign, currentPlayer, playerType ) => {

    const getSign = () => {
        return sign;
    }

    let roundWinCount = 0;

    const getWinCount = () => {
        return roundWinCount;
    }

    const resetWinCount = () => {
        return roundWinCount = 0;
    }

    const getCurrent = () => {
        return currentPlayer;
    }

    const updateCurrent = (isPlayerCurrent) => {
        return currentPlayer = isPlayerCurrent;
    }

    const returnType = () => {
        return playerType;
    }

    const updateType = (type) => {
        return playerType = type;
    }

    const incrementWin = () => {
        return roundWinCount++;
    }

    return {
        getSign,
        getWinCount,
        incrementWin,
        updateType,
        returnType,
        getCurrent,
        updateCurrent,
        resetWinCount,
    }
}

const bots = (() => {

    const availableMoves = () => {
        const possibleMoves = [];
        gameBoard.gameArray.filter((el, i) => {
            if(el === null) {
                possibleMoves.push(i)
            }
        })
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return Object.freeze({possibleMoves, randomMove});
    }
    const easyBot = () => {
        gameBoard.setSignForBot(availableMoves().randomMove);
    } 

    return {easyBot}
})()


const gameBoard = (() => {
    const board = document.querySelector('.gameBoard');
    const playerX = Player('X', false, 'player');
    const playerO = Player('O', false, 'Easy');
    const gameArray = Array(9).fill(null);
    let roundCount = 1;
    const totalX = [];
    const totalO = [];
    let isItStalemate = null;
    

    const getRoundCount = () => {
        return roundCount;
    }

    const incrementRoundCount = () => {
        return roundCount++;
    }

    const resetRoundCount = () => {
        return roundCount = 1;
    }

    const updatePlayer = (number, type) => {
        return number === 0 ? playerX.updateType(type) : playerO.updateType(type)
    }

    const getPlayer = (number) => {
        return number === 0 ? playerX : playerO;
    }
    
    const currentPlayer = () => {
        return playerX.getCurrent() === true ? playerX : playerO;
    }

    const determineCurrentPlayer = () => {
        if(playerX.getCurrent() === false && playerO.getCurrent() === false) {
            playerX.updateCurrent(true);
            return playerX;
        } 
        if(playerX.getCurrent() === true) {
            playerX.updateCurrent(false);
            playerO.updateCurrent(true);
            return playerO;  
        } else if(playerO.getCurrent() === true) {
            playerO.updateCurrent(false);
            playerX.updateCurrent(true);
           return playerX;
       }
    }

    const playRound = (field) => {
        if(field === null) {
            bots.easyBot();
        } else {
            if(setTheSign(field) === null) return
        }
        checkWinner();
        if(isItStalemate !== false ) checkStalemate(); 
        determineCurrentPlayer();
        isBotCurrentPlayer();
        if(isItStalemate === null) displayController.highlightPlayer();     
    }

    const isBotCurrentPlayer = () => {
        if(currentPlayer().returnType() !== 'player' && isItStalemate === null && gameArray.some(el => el === null)) {
            board.removeEventListener('click', gameBoard.playRound);
            window.setTimeout(() => playRound(null), 500);
            if(playerX.returnType() !== 'player' && playerO.returnType() !== 'player') return;
            window.setTimeout(() => board.addEventListener('click', gameBoard.playRound), 1000);
        }
    }

    const setSignForBot = (randomMove) => {
        if(randomMove === undefined) return;
        const allGameCards = document.querySelectorAll('.gameCard');
        allGameCards[randomMove].textContent = currentPlayer().getSign();
        gameArray[randomMove] = currentPlayer().getSign();
        currentPlayer().getSign() === 'X' ? totalX.push(Number(randomMove)) : totalO.push(Number(randomMove)); 
    }
    
    const setTheSign = (field) => {
        const gameIndex = field.target.dataset.index;
        if(field.target === board) return null;
        if(gameArray[gameIndex] !== null) return null;
        gameArray[gameIndex] = currentPlayer().getSign();
        currentPlayer().getSign() === 'X' ? totalX.push(Number(gameIndex)) : totalO.push(Number(gameIndex)); 
        field.target.textContent = currentPlayer().getSign();
    }
    
    const checkStalemate = () => {
        if(!gameArray.some(el => el === null)) {
            isItStalemate = true;
            return roundOver(false);
        }
    }

    const checkWinner = () => {
        const winningMoves = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        winningMoves.forEach(el => {
            const countX = [];
            const countO = [];
            el.forEach(num => {
                if(isItStalemate === false) return;
                if(totalX.includes(num)) {
                    countX.push(num);
                    if(countX.length === 3) {
                        isItStalemate = false;
                        return roundOver(playerX, countX);
                    }
                }
                if(totalO.includes(num)) {
                    countO.push(num);
                    if(countO.length === 3) {
                        isItStalemate = false;
                        return roundOver(playerO, countO);
                    }
                }
            })
        });
    }

    const roundOver = (winner, winMarks) => {
        if(winner !== false) winner.incrementWin();
        displayController.endRound(playerX.getWinCount(), playerO.getWinCount(), winner);

        winner === false ? displayController.yellowForStale() : displayController.greenTheMarks(winMarks);
        window.setTimeout(() => {
            gameArray.fill(null);
            totalX.length = 0;
            totalO.length = 0;
            isItStalemate = null;
            displayController.clearBoardAndField();
        }, 2000);
        
        if(winner !== false && winner.getWinCount() === 3 ) {
            resetRoundCount();
            playerX.resetWinCount();
            playerO.resetWinCount();
            window.setTimeout(() => {
                displayController.gameOver();
            }, 3100);

        } else {
            incrementRoundCount();
            window.setTimeout(() => {
                displayController.startNewRound()
                isBotCurrentPlayer();
            }, 3100);
        }
    }

    return Object.freeze({ 
        updatePlayer, 
        getPlayer, 
        playRound,
        getRoundCount,
        currentPlayer,
        determineCurrentPlayer,
        isBotCurrentPlayer,
        setSignForBot,
        gameArray,
        getRoundCount,
        incrementRoundCount,
    })
})()


const displayController = (() => {
    const gameScreen = document.querySelector('.gameScreen');
    const board = document.querySelector('.gameBoard');
    const allGameCards = document.querySelectorAll('.gameCard');
    const name1 = document.querySelector('.name1');
    const name2 = document.querySelector('.name2');
    const score1 = document.querySelector('.score1');
    const score2 = document.querySelector('.score2');
    const one = document.querySelector('.one');
    const two = document.querySelector('.two');
    const roundContainer = document.querySelector('.round');
    const roundText = document.querySelector('.roundText');
    const roundNumber = document.querySelector('.roundNumber');
    const returnHome = document.querySelector('.returnHome');

    const showBoard = () => {
        gameScreen.style.display = 'block';
        allGameCards.forEach(el => {
            el.classList.add('bouncy');
            window.setTimeout(() => el.classList.remove('bouncy'), 1500);
        })
        window.setTimeout(() => {
            name1.textContent = gameBoard.getPlayer(0).returnType();    
            name2.textContent = gameBoard.getPlayer(1).returnType();    
            gameBoard.determineCurrentPlayer();
            highlightPlayer();
            window.setTimeout(() => gameBoard.isBotCurrentPlayer(), 500);
            returnHome.addEventListener('click', returnToStart);
            board.addEventListener('click', gameBoard.playRound);
        }, 1500); 
    }

    const returnToStart = () => {
        location.reload();
    }

    const highlightPlayer = () => {
        if(gameBoard.currentPlayer().getSign() === 'X') {
            two.classList.remove('toColor');
            one.classList.add('toColor');

        } else {
            one.classList.remove('toColor');
            two.classList.add('toColor');
        }
    }

    const endRound = (playerXScore, playerOScore, winner) => {
        board.removeEventListener('click', gameBoard.playRound);
        score1.textContent = playerXScore;
        score2.textContent = playerOScore;
        if(winner === false) return;
        winner.getSign() === 'X' ? score1 : score2;
    }

    const clearBoardAndField = () => {
        allGameCards.forEach(el => {
            el.classList.remove('highlightWin');
            el.classList.remove('highlightDraw');
            roundText.textContent = 'Round';
            el.style = '';
            window.setTimeout(() => {
                el.textContent = '';
            }, 1000);
        })
    }

    const greenTheMarks = (winMarks) => {   
        allGameCards.forEach(el => {
            if(winMarks.includes(Number(el.dataset.index))) {
                el.classList.add('highlightWin');
            }
        })
    }

    const yellowForStale = () => {
        allGameCards.forEach(el => {
            el.classList.add('highlightDraw');
        })
    }

    const startNewRound = () => {
        board.addEventListener('click', gameBoard.playRound);
        roundNumber.textContent =  gameBoard.getRoundCount();
        highlightPlayer();
    }

    const gameOver = () => {
        roundText.textContent = 'GAME OVER';
        roundNumber.textContent = '';
        window.setTimeout(() => {
            roundText.textContent = '';
        }, 1000);
        window.setTimeout(() => {
            roundContainer.addEventListener('click', newGame)
            roundText.textContent = 'RESTART';
            roundNumber.textContent = '';
            roundContainer.style.cursor = 'pointer';
        }, 2000);
    }

    const newGame = () => {
        gameBoard.determineCurrentPlayer();
        clearBoardAndField();
        
        roundContainer.removeEventListener('click', newGame);
        roundContainer.style.cursor = 'default';
        
        score1.textContent = gameBoard.getPlayer(0).getWinCount();
        score2.textContent = gameBoard.getPlayer(1).getWinCount();
        
        roundText.textContent = 'Round ';
        roundNumber.textContent = gameBoard.getRoundCount();

        window.setTimeout(() => {
            gameBoard.isBotCurrentPlayer();
            board.addEventListener('click', gameBoard.playRound);
        }, 1000);
    }

    return {
        showBoard,
        highlightPlayer,
        greenTheMarks,
        clearBoardAndField,
        yellowForStale,
        startNewRound,
        endRound,
        gameOver,       
    }
})()
