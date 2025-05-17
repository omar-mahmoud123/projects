const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");
const player = document.getElementById("player");
const computer = document.getElementById("computer");
const options = ["rock", "paper", "scissors"];
const emojis = ["🪨", "📄", "✂️"];
const result = document.getElementById("result");
const playerScore = document.getElementById("playerScore");
const computerScore = document.getElementById("computerScore");
let randomOption;
let randomNum;
let playerDisplay;
let computerDisplay;
result.style.visibility = "hidden";
function playGame(played) {
    function calculateWinner(played, computer) {
        if (played == computer) {
            return "Tie 😐";
        } else if (
            (played == "paper" && computer == "rock") ||
            (played == "rock" && computer == "scissors") ||
            (played == "scissors" && computer == "paper")
        ) {
            playerScore.textContent = Number(playerScore.textContent) + 1;
            return "Player wins! 🥳";
        } else {
            computerScore.textContent = Number(computerScore.textContent) + 1;
            return "Computer wins! 🤖";
        }
    }
    randomNum = Math.floor(Math.random() * 3);
    randomOption = options[randomNum];
    const winner = calculateWinner(played, randomOption);
    computerDisplay =
        randomOption.charAt(0).toUpperCase() +
        randomOption.slice(1) +
        emojis[randomNum];
    computer.textContent = `Computer: ${computerDisplay}`;
    playerDisplay =
        played.charAt(0).toUpperCase() +
        played.slice(1) +
        emojis[options.indexOf(played)];
    player.textContent = `Player: ${playerDisplay}`;
    result.classList.remove("greenText", "redText");
    if (winner == "Player wins! 🥳") {
        result.classList.add("greenText");
    } else if (winner == "Computer wins! 🤖") {
        result.classList.add("redText");
    }
    result.textContent = winner;
    result.style.visibility = "visible";
}
