let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#resetbtn");
let msgcontainer = document.querySelector(".msgcontainer");
let msg = document.querySelector("#msg");
let twoPlayerBtn = document.querySelector("#twoPlayerBtn");
let vsComputerBtn = document.querySelector("#vsComputerBtn");

let turnO = true; // true for player (O), false for computer (X)
let gameOver = false; // Flag to check if the game is over
let vsComputer = false; // Flag to check if playing against the computer
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turnO = true;
    gameOver = false;
    enableboxes();
    msgcontainer.classList.add("hide");
};

twoPlayerBtn.addEventListener("click", () => {
    vsComputer = false;
    resetGame();
});

vsComputerBtn.addEventListener("click", () => {
    vsComputer = true;
    resetGame();
});

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!gameOver) {
            playerMove(box);
        }
    });
});

const playerMove = (box) => {
    if (box.innerText === "") {
        box.innerText = turnO ? "O" : "X";
        box.disabled = true;
        checkwinner();
        if (!gameOver) {
            turnO = !turnO;
            if (vsComputer && !turnO) {
                setTimeout(computerMove, 500); // Give a small delay for the computer move
            }
        }
    }
};

const computerMove = () => {
    if (!turnO && !gameOver) {
        let moveMade = false;

        // Try to win
        moveMade = tryToWinOrBlock("X");

        // Try to block
        if (!moveMade) {
            moveMade = tryToWinOrBlock("O");
        }

        // Make a random move
        if (!moveMade) {
            let availableBoxes = Array.from(boxes).filter(box => box.innerText === "");
            if (availableBoxes.length > 0) {
                let randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
                randomBox.innerText = "X";
                randomBox.disabled = true;
                checkwinner();
            }
        }
        turnO = true;
    }
};

const tryToWinOrBlock = (symbol) => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let boxA = boxes[a].innerText;
        let boxB = boxes[b].innerText;
        let boxC = boxes[c].innerText;

        if (boxA === symbol && boxB === symbol && boxC === "") {
            boxes[c].innerText = "X";
            boxes[c].disabled = true;
            checkwinner();
            return true;
        }
        if (boxA === symbol && boxB === "" && boxC === symbol) {
            boxes[b].innerText = "X";
            boxes[b].disabled = true;
            checkwinner();
            return true;
        }
        if (boxA === "" && boxB === symbol && boxC === symbol) {
            boxes[a].innerText = "X";
            boxes[a].disabled = true;
            checkwinner();
            return true;
        }
    }
    return false;
};

const disableboxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableboxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    if (vsComputer) {
        if (winner == 'O')
            msg.innerText = `Congratulations, You Win the Game`;
        else
            msg.innerText = `You Lost!`;
    } else {
        msg.innerText = `Congratulations, Winner is ${winner}`;
    }
    msgcontainer.classList.remove("hide");
    disableboxes();
    gameOver = true;
};

const showDraw = () => {
    msg.innerText = "It's a draw!";
    msgcontainer.classList.remove("hide");
    disableboxes();
    gameOver = true;
};

const checkwinner = () => {
    let winnerFound = false;

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let pos1 = boxes[a].innerText;
        let pos2 = boxes[b].innerText;
        let pos3 = boxes[c].innerText;

        if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
            if (pos1 == pos2 && pos2 == pos3) {
                showWinner(pos1);
                winnerFound = true;
                break;
            }
        }
    }

    if (!winnerFound) {
        checkDraw();
    }
};

const checkDraw = () => {
    let allBoxesFilled = true;

    for (let box of boxes) {
        if (box.innerText === "") {
            allBoxesFilled = false;
            break;
        }
    }

    if (allBoxesFilled) {
        showDraw();
    }
};

resetbtn.addEventListener("click", resetGame);
