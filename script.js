// interface with game board data structure
const gameBoard = (function createGameBoard() {
    let board = [["", "", ""],
                 ["", "", ""],
                 ["", "", ""]];
    let emptySpaces = 9;

    const isFull = () => emptySpaces === 0;
    const getBoard = () => board;

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
        if (mark !== "X" && mark !== "O") {
            throw {name: "Invalid mark", message: "too lazy to implement"};
        }
        if (board[i][j] == true) {
            throw {name: "Space already marked", message: "poop"};
        }
        board[i][j] = mark;
        emptySpaces--;
    }

    return { isFull, getBoard, getSpace, setSpace };
})();

function createPlayer(name, mark) {
    // gets i and j from user and sets space on board
    const getName = () => name;
    const getMark = () => mark;

    return { getName, getMark };
}

// game logic
const game = (function createGame(player1, player2) {
    let outcome = null; // will be set to player1, player2, or "draw" by end of game
    turn = player1;

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
        if (gameBoard.isFull()) {
            outcome = "draw";
            return true;
        } 
        return checkPlayerWon(player1) || checkPlayerWon(player2); 
    }

    const declareOutcome = function() {
        switch (outcome) {
            case player1:
                console.log(player1.getName() + " wins!");
                break;
            case player2:
                console.log(player2.getName() + " wins!");
                break;
            case "draw":
                console.log("draw.");
                break;
            default:
                console.log("you schouldn't be here");
        }
    }
    
    return { getTurn, toggleTurn, getOutcome, isOver, declareOutcome };
})(createPlayer("bob", "X"), createPlayer("alice", "O"));

const displayController = (function createDisplayController() {
    // updates DOM with current state of board
    const render = function() {
        const board = gameBoard.getBoard();

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const selector = `.space${i}${j} h3`;
                const mark = document.querySelector(selector);
                mark.innerText = board[i][j];
            }
        }
    }

    // add click listeners to spaces    
    const buttons = document.querySelectorAll("button[class^='space'");
    buttons.forEach((button) => 
        button.addEventListener("click", (e) => {
            const currButton = e.target;
            const i = currButton.classList[0].slice(-2, -1); // the class of the current button
            const j = currButton.classList[0].slice(-1); // the class of the current button
            const currTurn = game.getTurn(); // get the player whose turn it currently is 
            
            gameBoard.setSpace(currTurn.getMark(), i, j);
            game.toggleTurn(); 
            displayController.render();
           
            
            if (game.isOver()) {
                game.declareOutcome();
            }
        })
    );

    return { render }
})();
