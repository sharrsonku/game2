// // // gemaakt met behulp van https://www.youtube.com/watch?v=s6LrpUTQQn0
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const grid = $(".grid");
const resultDisplay = $(".result");
const playAgainButton = $("#playAgain");


let currentPlayerIndex = 260;
const width = 17;
let removeAliens = [];
let aliensId;
let isGoingRight = true;
let direction = 1;
let result = 0;
let gameInProgress = true;

// Initialize the game
function initializeGame() {
    grid.innerHTML = '';
    resultDisplay.innerHTML = '';
    playAgainButton.style.display = "none";
    
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        grid.appendChild(square);
    }
}

const squares = () => $$(".grid div");

// Define the aliens' initial positions
const aliens = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46
];

function drawAliens() {
    aliens.forEach((alien, index) => {
        if (!removeAliens.includes(index)) {
            squares()[alien].classList.add("alien");
        }
    });
}

function addPlayerImage(index) {
    const playerImage = document.createElement("img");
    playerImage.src = "ill/player.png";
    playerImage.classList.add("player-image");
    squares()[index].appendChild(playerImage);
}

function removePlayerImage(index) {
    const playerImage = squares()[index].querySelector(".player-image");
    if (playerImage) {
        playerImage.remove();
    }
}

function removeAliensFromGrid() {
    aliens.forEach(alien => {
        squares()[alien].classList.remove("alien");
    });
}

function movePlayer(e) {
    if (!gameInProgress) return; // Prevent movement if game is not in progress
    removePlayerImage(currentPlayerIndex);
    switch (e.key) {
        case "ArrowLeft":
            if (currentPlayerIndex % width !== 0) currentPlayerIndex -= 1;
            break;
        case "ArrowRight":
            if ((currentPlayerIndex + 1) % width !== 0) currentPlayerIndex += 1;
            break;
    }
    addPlayerImage(currentPlayerIndex);
}

function moveAliens() {
    if (!gameInProgress) return; // Prevent aliens movement if game is not in progress
    const leftEdge = aliens[0] % width === 0;
    const rightEdge = aliens[aliens.length - 1] % width === width - 1;
    removeAliensFromGrid();

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < aliens.length; i++) {
            aliens[i] += width + 1;
        }
        direction = -1;
        isGoingRight = false;
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < aliens.length; i++) {
            aliens[i] += width - 1;
        }
        direction = 1;
        isGoingRight = true;
    }

    for (let i = 0; i < aliens.length; i++) {
        aliens[i] += direction;
    }

    drawAliens();

    if (result >= 10) {
        clearInterval(aliensId);
        aliensId = setInterval(moveAliens, 300);
    }

    if (result >= 15) {
        clearInterval(aliensId);
        aliensId = setInterval(moveAliens, 500);
    }

    if (aliens.includes(currentPlayerIndex)) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(aliensId);
        gameInProgress = false;
        playAgainButton.style.display = "block";
    }

    if (removeAliens.length === aliens.length) {
        resultDisplay.innerHTML = "YOU WIN";
        clearInterval(aliensId);
        gameInProgress = false;
        playAgainButton.style.display = "block";
    }
}

function shoot(e) {
    if (!gameInProgress) return; // Prevent shooting if game is not in progress

    let laserId;
    let currentLaserIndex = currentPlayerIndex;

    const laserMp3 = document.getElementById("laserMp3");

    function moveLaser() {
        squares()[currentLaserIndex].classList.remove("laser");

        if (squares()[currentLaserIndex - width]) {
            squares()[currentLaserIndex - width].classList.remove("laser");
        }

        currentLaserIndex -= width;

        if (currentLaserIndex < 0) {
            clearInterval(laserId);
            return;
        }

        squares()[currentLaserIndex].classList.add("laser");

        if (squares()[currentLaserIndex].classList.contains("alien")) {
            const explosionSound = new Audio('laser.mp3');
            explosionSound.play();
            squares()[currentLaserIndex].classList.remove("laser", "alien");
            squares()[currentLaserIndex].classList.add("explosion");

            setTimeout(() => squares()[currentLaserIndex].classList.remove("explosion"), 100);

            const alienIndex = aliens.indexOf(currentLaserIndex);
            removeAliens.push(alienIndex);
            result++;
            resultDisplay.innerHTML = result;

            clearInterval(laserId);
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100);
        laserMp3.currentTime = 0;
        laserMp3.play();
    }
}

function startGame() {
    // Clear event listeners
    document.removeEventListener("keydown", movePlayer);
    document.removeEventListener("keydown", shoot);
    playAgainButton.removeEventListener("click", startGame);

    // Reset game state
    gameInProgress = true;
    currentPlayerIndex = 260;
    removeAliens = [];
    result = 0;
    direction = 1;
    isGoingRight = true;
    resultDisplay.innerHTML = result;

    // Clear any existing intervals
    clearInterval(aliensId);

    // Initialize the game environment
    initializeGame();
    drawAliens();
    addPlayerImage(currentPlayerIndex);

    // Add event listeners back
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keydown", shoot);
    playAgainButton.addEventListener("click", startGame);

    // Start the aliens movement interval
    aliensId = setInterval(moveAliens, 400);
}

// Initial setup
initializeGame();
drawAliens();
addPlayerImage(currentPlayerIndex);
document.addEventListener("keydown", movePlayer);
document.addEventListener("keydown", shoot);
playAgainButton.addEventListener("click", startGame);
aliensId = setInterval(moveAliens, 400);