//player
class Player {
    constructor(name){
        this.name = name;
        this.score = 0;
    }
    updateScore(points){
        this.score+=points;
    }
    resetScore(points){
        this.score=0;
    }
}



// Avatar
const style = "bottts";

// Update the avatar function
function updateAvatar(seed, targetId) {
    const avatarURL = `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
    const avatarElement = document.getElementById(targetId);
    if (avatarElement) {
        avatarElement.innerHTML = `
            <img src="${avatarURL}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Anonymous avatar update
    const anonyInput = document.querySelector('#anonyNickname');
    if (anonyInput) {
        anonyInput.addEventListener('input', (e) => {
            const seed = e.target.value.trim() || 'guest';
            updateAvatar(seed, 'avatarAnony');
        });
        
        updateAvatar('guest', 'avatarAnony');
    }

    // continue button in Help page
    const helpContinueBtn = document.querySelector('#help .continue-button');
    if (helpContinueBtn) {
        helpContinueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Settings.html';
        });
    }
    if (document.getElementById('ranking')) {
        updateLeaderboard();
    }
});


// Guest mode
function handleAnonymousLogin() {
    const nickname = document.querySelector('#anonyNickname').value.trim();
    
    if (!nickname) {
        alert('Please enter a nickname');
        return false;
    }

    try {
        // Check if user already exists
        const existingUser = localStorage.getItem('guestNickname');
        if (existingUser === nickname) {
            console.log('Existing user found:', nickname);
        } else {
            // Store new user
            localStorage.setItem('guestNickname', nickname);
            console.log('New user stored:', nickname);
        }

        // Store current session user
        localStorage.setItem('currentUser', nickname);
        
        // Navigate to settings
        window.location.href = 'Settings.html';
        return true;
    } catch (error) {
        console.error('Error handling login:', error);
        alert('An error occurred. Please try again.');
        return false;
    }
}

// //game mode selector
let numbersModeEnabled = false;
let colorsModeEnabled = false;
let lettersModeEnabled = false;

const selectLetters = document.getElementById("selectLetters");
const selectNumbers = document.getElementById("selectNumbers");
const selectColors = document.getElementById("selectColors");

selectLetters.addEventListener("click", () => {
    lettersModeEnabled = !lettersModeEnabled;
    console.log("enabled letters")
    updateSelectedCount()
});

selectNumbers.addEventListener("click", () => {
    numbersModeEnabled = !numbersModeEnabled;
    console.log("enabled numbers")
    updateSelectedCount()
});

selectColors.addEventListener("click", () => {
    colorsModeEnabled = !colorsModeEnabled;
    console.log("enabled colors")
    updateSelectedCount()
});
function updateSelectedCount() {
    const count = [
        lettersModeEnabled,
        numbersModeEnabled,
        colorsModeEnabled
    ].filter(Boolean).length;

    console.log("Count is:", count);
    document.getElementById("count").textContent = count;
}

// // // Game Function
const colorsModeColorRange = ["red", "lime", "blue", "yellow"];
const lettersModeRange = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let playOrder = [];
let numbersMode = [];
let colorsMode = [];
let lettersMode = [];

let playerInput = [];
let numbersModePlayerInput = [];
let colorsModePlayerInput = [];
let lettersModePlayerInput = [];

let currentRound = 1;
let score = 0;

let listenersAttached = false;
let listenersAttachedColors = false;
let listenersAttachedLetters = false;
let listenersAttachedNumbers = false;


const gameButton = document.querySelectorAll(".gameBox");
const colors = document.querySelectorAll(".color");
const submitButton = document.querySelector("#submit");
const inputField = document.querySelector("#inputField");

const popUp = document.querySelector(".popUp");
const closePopup = document.getElementById("closePopup");
const finalScore = document.getElementById("finalScore");

closePopup.addEventListener("click", () => {
    popUp.style.display = "none";
    startNewGame();
});


startNewGame();

function startNewGame() {
    generateSequence();
    currentRound = 1;
    playerInput = [];
    console.log("Game Start");
    playSequenceAnimations(currentRound);
    console.log("modes enabled",colorsModeEnabled,lettersModeEnabled,numbersModeEnabled)
}

function generateSequence() {
    playOrder = [];
    for (let i = 0; i < 20; i++) {
        playOrder.push(Math.floor(Math.random() * 9) + 1);
    }
    if (colorsModeEnabled){
        colorsMode = [];
        for (let i = 0; i < 20; i++) {
            const randomColor = colorsModeColorRange[Math.floor(Math.random() * colorsModeColorRange.length)];
            colorsMode.push(randomColor); 
        }
        detectClickColors();
    }
    if (numbersModeEnabled) {
        numbersMode = [];
        for (let i = 0; i < 20; i++) {
            numbersMode.push(Math.floor(Math.random() * 9)+1);
        }
        detectClickSubmit();
    }
    if (lettersModeEnabled) {
        lettersMode = [];
        for (let i = 0; i < 20; i++){
            const randomLetter = lettersModeRange[Math.floor(Math.random() * lettersModeRange.length)];
            lettersMode.push(randomLetter);
        }
        detectClickSubmit();
    }
        console.log(lettersMode);
        console.log(numbersMode)
        console.log(colorsMode);
        console.log(playOrder);
        detectClick();
    }


function detectClick() {
    if (listenersAttached) return;
    gameButton.forEach((button) => {
        button.addEventListener("click", (event) => {
            const userClick = Number(event.target.id);
            playerInput.push(userClick);
            console.log("User Clicked (number):", userClick);
            console.log("Current Player Input:", playerInput);
            checkSequence();
        });
    }); 
    listenersAttached = true;
}

function detectClickColors(){
    if (listenersAttachedColors) return;
    colors.forEach((button) => {
        button.addEventListener("click", (event) => { 
            const userClick = event.target.id;
            colorsModePlayerInput.push(userClick);
            console.log("User Clicked (color):", userClick);
            console.log("Current Color Input:", colorsModePlayerInput);
            checkSequence();
        });
    });
    listenersAttachedColors = true;
}

function detectClickSubmit() {
    if (listenersAttachedLetters || listenersAttachedNumbers) return;

    submitButton.addEventListener("click", () => {
        const userInput = inputField.value.trim().toUpperCase();
        inputField.value = ""; 
        if (lettersModeEnabled) {
            lettersModePlayerInput = userInput.split("");
            console.log("Letter Input:", lettersModePlayerInput);
        }
        if (numbersModeEnabled) {
            numbersModePlayerInput = userInput.split("").map(Number); 
            console.log("Number Input:", numbersModePlayerInput);
        }
        checkSequence();
    });

    if (lettersModeEnabled) {
        listenersAttachedLetters = true;
        document.getElementById("inputField").placeholder = "Enter Letter Sequence";
        }
    if (numbersModeEnabled) {
        listenersAttachedNumbers = true;
        document.getElementById("inputField").placeholder = "Enter Number Sequence";
    }
}


function checkSequence() {
    if (lettersModePlayerInput.length > currentRound) {
        console.log("Too many inputs! Game Over!");
        endGame();
        return;
    }
        for (let i = 0; i < playerInput.length; i++) {
        if (playerInput[i] !== playOrder[i]) {
            console.log("Wrong Number Sequence! Game Over!");
            endGame();
            return;
        }
        else{
            score++
        }
    }

    if (colorsModeEnabled) {
        for (let i = 0; i < colorsModePlayerInput.length; i++) {
            if (colorsModePlayerInput[i] !== colorsMode[i]) {
                console.log("Wrong Color Sequence! Game Over!");
                endGame();
                return;
            }
            else{
            score++
            }
        }
    }

    if (lettersModeEnabled) {
        for (let i = 0; i < lettersModePlayerInput.length; i++) {
            if (lettersModePlayerInput[i] !== lettersMode[i]) {
                console.log("Wrong Letter Sequence! Game Over!");
                endGame();
                return;
            }
            else{
            score++
            }
        }
    }
    
    if (numbersModeEnabled) {
        for (let i = 0; i < numbersModePlayerInput.length; i++) {
            if (numbersModePlayerInput[i] !== numbersMode[i]) {
                console.log("Wrong Number Sequence! Game Over!");
                endGame();
                return;
            }
            else{
            score++
            }
        }
    }

    if (
        playerInput.length === currentRound &&
        (!colorsModeEnabled || colorsModePlayerInput.length === currentRound) &&
        (!lettersModeEnabled || lettersModePlayerInput.length === currentRound) &&
        (!numbersModeEnabled || numbersModePlayerInput.length === currentRound)
    ) {
        console.log("Correct Sequence! Next Round!");
        currentRound++;
        playerInput = [];
        colorsModePlayerInput = [];
        lettersModePlayerInput = [];
        numbersModePlayerInput = [];
        score+=4
        playSequenceAnimations(currentRound);
    }
}

function playSequenceAnimations(currentRound) {
    const baseDelay = 1000;
    const stepDelay = 800;

    for (let i = 0; i < currentRound; i++) {
        setTimeout(() => {
            const button = document.getElementById(playOrder[i]);

            // Save original styles
            const originalBg = button.style.backgroundColor;
            const originalText = button.textContent;

            // FLASH effect
            button.classList.add("flash");

            // COLORS MODE 
            if (colorsModeEnabled) {
                const color = colorsMode[i];
                button.style.backgroundColor = color;
            }

            // LETTERS MODE 
            if (lettersModeEnabled) {
                button.textContent = lettersMode[i];
            }

            // NUMBERS MODE 
            if (numbersModeEnabled && !lettersModeEnabled) {
                button.textContent = numbersMode[i];
            }

            // Clean up after flash
            setTimeout(() => {
                button.classList.remove("flash");

                // Restore styles
                button.style.backgroundColor = originalBg;
                button.textContent = originalText;

            }, 500);

        }, baseDelay + i * stepDelay);
    }
}

function callPopup() {
    popUp.style.display = "flex";
    finalScore.textContent = score;
}

function endGame() {
    playerInput = [];
    colorsModePlayerInput = [];
    lettersMode = [];
    numbersMode = [];
    colorsModePlayerInput = [];
    lettersModePlayerInput = [];
    numbersModePlayerInput = [];
    colorsMode = [];
    currentRound = 1;
    console.log("Game Over.");
    callPopup();
    score = 0;
}  

// Save score to leaderboard
saveScore(score);
// callPopup();
score = 0;


function saveScore(score) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    // Get existing leaderboard or create new one
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    // Find if user already has a score
    const existingUserIndex = leaderboard.findIndex(entry => entry.nickname === currentUser);
    
    //update score
    if (existingUserIndex !== -1) {
        if (score > leaderboard[existingUserIndex].score) {
            leaderboard[existingUserIndex].score = score;
            leaderboard[existingUserIndex].timestamp = Date.now();
        }
    } else {
        leaderboard.push({
            nickname: currentUser,
            score: score,
            timestamp: Date.now()
        });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    
    // only top 10 scores
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    updateLeaderboard();
}

function updateLeaderboard() {
    const rankingDiv = document.getElementById('ranking');
    if (!rankingDiv) return;

    // Get leaderboard data
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    // Clear current leaderboard
    rankingDiv.innerHTML = '';
    
    // Add each score to the leaderboard
    leaderboard.forEach((entry, index) => {
        const scoreElement = document.createElement('div');
        scoreElement.className = 'score-entry';
        scoreElement.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="user">${entry.nickname}</span>
            <span class="score">${entry.score}</span>
        `;
        rankingDiv.appendChild(scoreElement);
    });
}