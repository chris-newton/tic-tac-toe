// interface with game board data structure
const gameBoard = (function createGameBoard() {
    let board = [["", "", ""],
                 ["", "", ""],
                 ["", "", ""]];
    let emptySpaces = 9;

    const isFull = () => emptySpaces === 0;
    const getBoard = () => board;
    const checkSpaceEmpty = (i, j) => !board[i][j];

    const getSpace = function(i, j) {
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) {
            throw {name : "Out of Bounds", message : "too lazy to implement"}; 
        }
        return board[i][j];
    }
    
    const setSpace = function(mark, i, j) {
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) {
            throw {name : "Out of Bounds", message : "too lazy to implement"}; 
        }
        if (board[i][j]) {
            throw {name : "space already occupied", message : "too lazy to implement"}; 
        }
        board[i][j] = mark;
        emptySpaces--;
    }

    const clear = function() {
        board = [["", "", ""],["", "", ""],["", "", ""]];
        emptySpaces = 9;
    };

    return { isFull, getBoard, checkSpaceEmpty, getSpace, setSpace, clear };
})();

function createPlayer(name, mark) {
    // gets i and j from user and sets space on board
    const getName = () => name;
    const getMark = () => mark;

    return { getName, getMark };
}

const modalForm = document.querySelector(".name-entry");
modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    [name1, name2] = Object.entries(formProps);

    player1 = createPlayer(name1[1], "X"); 
    player2 = createPlayer(name2[1], "O"); 

    const modal = document.querySelector("dialog");
    modal.replaceChildren(); // wipe the modal clean
    modal.classList.toggle("hidden", true);

    game.start(player1, player2);
});

const game = (function createGame() {
    let outcome = null; // will be set to player1, player2, or "draw" by end of game
    let turn = null;
    let player1;
    let player2;

    const start = function(p1, p2) {
        turn = p1;
        player1 = p1;
        player2 = p2;
    }

    const getTurn = () => turn;
    const toggleTurn = () => turn = (turn === player1) ? player2 : player1;
    const getOutcome = () => outcome;

    // returns true iff player own
    const checkPlayerWon = function(player) {
        const mark = player.getMark();
        
        // check rows
        for (let i = 0; i < 3; i++) {
            if (gameBoard.getSpace(i, 0) === mark && 
                gameBoard.getSpace(i, 1) === mark && 
                gameBoard.getSpace(i, 2) === mark) {
                outcome = player;
                return true;
            }
        }
        // check columns
        for (let j = 0; j < 3; j++) {
            if (gameBoard.getSpace(0, j) === mark && 
                gameBoard.getSpace(1, j) === mark && 
                gameBoard.getSpace(2, j) === mark) {
                outcome = player;
                return true;
            }
        }
        // check diagonals
        if (gameBoard.getSpace(0, 0) == mark &&
            gameBoard.getSpace(1, 1) == mark && 
            gameBoard.getSpace(2, 2) == mark) {
            outcome = player;
            return true
        } else if (gameBoard.getSpace(0, 2) == mark &&
                gameBoard.getSpace(1, 1) == mark &&
                gameBoard.getSpace(2, 0) == mark) {
            outcome = player;
            return true
        }
        return false;
    }

    // check game status
    // returns true iff game has been won or draw
    const isOver = function() {
        // check draw
        if (checkPlayerWon(player1) || checkPlayerWon(player2)) {
            return true;
        } 
        return gameBoard.isFull();
    }

    const dispatchOutcome = function() {
        const modal = document.querySelector("dialog");
        const outcomeText = document.createElement("p");
        outcomeText.classList.add("outcome-text");
        
        switch (outcome) {
            case player1:
            case player2:
                outcomeText.innerText = outcome.getName() + " wins!";
                break;
            case null: 
                outcomeText.innerText = "draw.";
        }
        modal.appendChild(outcomeText);
        modal.classList.toggle("hidden");
        modal.classList.add("modal-show-outcome");
    }
    
    const modal = document.querySelector("dialog");
    const resetButton = document.querySelector(".reset");
    resetButton.addEventListener("click", () => {
        outcome = null;
        gameBoard.clear();
        displayController.render();
        start(player1, player2);
        modal.replaceChildren();
        modal.classList.toggle("hidden");
    });
    
    return { start, getTurn, toggleTurn, getOutcome, isOver, dispatchOutcome };
})();


// game logic
const displayController = (function createDisplayController() {
    // updates DOM with current state of board
    const render = function() {
        const board = gameBoard.getBoard();

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const selector = `.space${i}${j}`;
                let space = document.querySelector(selector);
                space.innerText = board[i][j];
            }
        }
    }

    // clicking a given space triggers the logic for a turn
    const buttons = document.querySelectorAll("button[class^='space'");
    buttons.forEach((button) => 
        button.addEventListener("click", (e) => {
            const currButton = e.target;
            const i = currButton.classList[0].slice(-2, -1); // the row index of the button
            const j = currButton.classList[0].slice(-1); // the column index
            const currTurn = game.getTurn(); // get the player whose turn it currently is 
            
            if (gameBoard.checkSpaceEmpty(i, j)) {
                gameBoard.setSpace(currTurn.getMark(), i, j);
                game.toggleTurn(); 
                displayController.render();
                
                if (game.isOver()) {
                    game.dispatchOutcome();
                }
            }
        })
    );

    return { render }
})();