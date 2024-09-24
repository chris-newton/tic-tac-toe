// interface with game board data structure
const gameBoard = (function createGameBoard() {
    let board = [["", "", ""],
                 ["", "", ""],
                 ["", "", ""]];
    let emptySpaces = 9;

    const isFull = () => emptySpaces === 0;

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

    return { isFull, getSpace, setSpace };
})();

function createPlayer(name, mark) {
    // gets i and j from user and sets space on board
    const getName = () => name;
    const getMark = () => mark;

    const move = function() {
        console.log(name + "'s turn");

        const i = parseInt(prompt("pick row"));
        const j = parseInt(prompt("pick column"));
        gameBoard.setSpace(mark, i, j);
    }

    return { getName, getMark, move };
}

// game logic
const game = (function createGame(player1, player2) {
    let outcome = null; // will be set to player1, player2, or "draw" by end of game

    const start = function() {
        turn = player1;

        // loop turns until game over
        while (!isOver()) {
            turn.move();
            turn = (turn === player1) ? player2 : player1; // flip currPlayer
        }

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

    return { start };
})(createPlayer("bob", "X"), createPlayer("alice", "O"));

game.start();