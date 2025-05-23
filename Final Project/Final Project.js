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

function deleteStoredData() {
    try {
        localStorage.removeItem('guestNickname');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('leaderboard');
        
        const rankingDiv = document.getElementById('ranking');
        if (rankingDiv) {
            rankingDiv.innerHTML = '';
        }
        
        console.log('All stored data has been deleted');
    } catch (error) {
        console.error('Error deleting stored data:', error);
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
            window.location.href = 'Home.html';
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
        window.location.href = 'Help.html';
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

document.addEventListener("DOMContentLoaded", () => {    
    const selectLetters = document.getElementById("selectLetters");
    const selectNumbers = document.getElementById("selectNumbers");
    const selectColors = document.getElementById("selectColors");
    
    lettersModeEnabled = localStorage.getItem("lettersModeEnabled") === "true";
    numbersModeEnabled = localStorage.getItem("numbersModeEnabled") === "true";
    colorsModeEnabled = localStorage.getItem("colorsModeEnabled") === "true";

    const closePopup = document.getElementById("closePopup");
    if(closePopup){
        closePopup.addEventListener("click", () => {
            const popUp = document.querySelector(".popUp");
            popUp.style.display = "none";
            startNewGame();
        });
    }
    detectClick()
    detectClickColors()
    detectClickSubmit()
    
    if(selectLetters){
        selectLetters.addEventListener("click", () => {
            lastSelectedMode = 'letters';
            lettersModeEnabled = !lettersModeEnabled;
            selectLetters.classList.toggle('selected', lettersModeEnabled);
            updateSelectedCount();
        });
    }
    if(selectNumbers){
        selectNumbers.addEventListener("click", () => {
            lastSelectedMode = 'numbers';
            numbersModeEnabled = !numbersModeEnabled;
            selectNumbers.classList.toggle('selected', numbersModeEnabled);
            updateSelectedCount();
        });
    }
    if(selectColors){
        selectColors.addEventListener("click", () => {
            lastSelectedMode = 'colors';
            colorsModeEnabled = !colorsModeEnabled;
            selectColors.classList.toggle('selected', colorsModeEnabled);
            updateSelectedCount();
        });
    }
    startNewGame()
});
function updateSelectedCount() {
    const count = [
        lettersModeEnabled,
        numbersModeEnabled,
        colorsModeEnabled
    ].filter(Boolean).length;

    // Get references to mode buttons
    const lettersBtn = document.getElementById("selectLetters");
    const numbersBtn = document.getElementById("selectNumbers");
    const colorsBtn = document.getElementById("selectColors");
    const startBtn = document.querySelector(".start-button");

    // Handle letters and numbers incompatibility
    if (lettersModeEnabled && numbersModeEnabled) {
        // If user tries to select both, disable the last selection
        if (lastSelectedMode === 'letters') {
            lettersModeEnabled = false;
            lettersBtn.classList.remove('selected');
            alert("You cannot select both Letters and Numbers modes!");
        } else {
            numbersModeEnabled = false;
            numbersBtn.classList.remove('selected');
            alert("You cannot select both Letters and Numbers modes!");
        }
    }

    localStorage.setItem("lettersModeEnabled", lettersModeEnabled);
    localStorage.setItem("numbersModeEnabled", numbersModeEnabled);
    localStorage.setItem("colorsModeEnabled", colorsModeEnabled);

    // Enable/disable start button based on selection
    if (count === 0) {
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";
        startBtn.style.cursor = "not-allowed";
    } else {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.style.cursor = "pointer";
    }

    console.log("Count is:", count);
    document.getElementById("count").textContent = count;
}

// // Game Function
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
let submitListenerAttached = false;
let isAnimating = false;

let placeholders = [];

let toClick = new Audio("./Toom Click.wav");
let click = new Audio("./user click.mp3")
let inputClick = new Audio("./input click.mp3")

let lastSelectedMode = '';

const gameButton = document.querySelectorAll(".gameBox");
const colors = document.querySelectorAll(".color");
const submitButton = document.querySelector("#submit");
const inputField = document.querySelector("#inputField");

function startNewGame() {
    generateSequence();
    currentRound = 1;
    playerInput = [];
    numbersModePlayerInput = [];
    colorsModePlayerInput = [];
    lettersModePlayerInput = [];
    placeholders = [];
    console.log("Game Start");
    playSequenceAnimations(currentRound);
    console.log("modes enabled",colorsModeEnabled,lettersModeEnabled,numbersModeEnabled)
    if (lettersModeEnabled) placeholders.push("Letters");
    if (numbersModeEnabled) placeholders.push("Numbers");

    document.addEventListener("DOMContentLoaded", () => {
        inputField.placeholder = `Enter ${placeholders.join(" & ")} Sequence`;
    });
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
    }
    if (numbersModeEnabled) {
        numbersMode = [];
        for (let i = 0; i < 20; i++) {
            numbersMode.push(Math.floor(Math.random() * 9)+1);
        }
    }
    if (lettersModeEnabled) {
        lettersMode = [];
        for (let i = 0; i < 20; i++){
            const randomLetter = lettersModeRange[Math.floor(Math.random() * lettersModeRange.length)];
            lettersMode.push(randomLetter);
        }
    }
        console.log(lettersMode);
        console.log(numbersMode)
        console.log(colorsMode);
        console.log(playOrder);
    }


function detectClick() {
    if (listenersAttached) return;
    gameButton.forEach((button) => {
        button.addEventListener("click", (event) => {
            if (isAnimating) return;
            click.currentTime = 0;
            click.play();
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
            if (isAnimating) return;
            inputClick.currentTime = 0;
            inputClick.play();
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
    if (submitListenerAttached) return;
    if(submitButton){
        submitButton.addEventListener("click", () => {
            if (isAnimating) return;
            inputClick.currentTime = 0;
            inputClick.play();
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
    }
    submitListenerAttached = true;
}

function checkSequence() {
    if (lettersModePlayerInput.length > currentRound) {
        console.log("Too many inputs! Game Over!");
        endGame();
        return;
    }
    if (numbersModePlayerInput.length > currentRound) {
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
        playSequenceAnimations(currentRound);
    }
}

function playSequenceAnimations(currentRound) {
    isAnimating = true; 
    const baseDelay = 1000;
    const stepDelay = 800;

    for (let i = 0; i < currentRound; i++) {
        setTimeout(() => {
            const button = document.getElementById(playOrder[i]);

            // Save original styles & display flash effect
                const originalBg = button.style.backgroundColor;
                const originalText = button.textContent;    
                button.classList.add("flash");
                toClick.currentTime = 0;
                toClick.play();


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

            if (i === currentRound - 1) {
                    isAnimating = false;
            }

            }, 500);

        }, baseDelay + i * stepDelay);
        
    }
}


function endGame() {
    playerInput = [];
    colorsMode = [];
    lettersMode = [];
    numbersMode = [];
    colorsModePlayerInput = [];
    lettersModePlayerInput = [];
    numbersModePlayerInput = [];
    currentRound = 1;
    console.log("Game Over.");
    callPopup();
    saveScore(score);
    score = 0;
}  
function callPopup() {
    const popUp = document.querySelector(".popUp");
    const finalScore = document.getElementById("finalScore");

    popUp.style.display = "flex";
    finalScore.textContent = score;
}



function saveScore(score) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    const existingUserIndex = leaderboard.findIndex(entry => entry.nickname === currentUser);

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
    
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    updateLeaderboard();
}

function updateLeaderboard() {
    const rankingDiv = document.getElementById('ranking');
    if (!rankingDiv) return;

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    rankingDiv.innerHTML = '';

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

//function to reset game modes
function resetGameModes() {
    localStorage.setItem("lettersModeEnabled", "false");
    localStorage.setItem("numbersModeEnabled", "false");
    localStorage.setItem("colorsModeEnabled", "false");
    
    const lettersBtn = document.getElementById("selectLetters");
    const numbersBtn = document.getElementById("selectNumbers");
    const colorsBtn = document.getElementById("selectColors");
    
    if (lettersBtn) lettersBtn.classList.remove('selected');
    if (numbersBtn) numbersBtn.classList.remove('selected');
    if (colorsBtn) colorsBtn.classList.remove('selected');
    
    const countElement = document.getElementById("count");
    if (countElement) countElement.textContent = "0";
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('Home.html')) {
        resetGameModes();
        
        // Reset the enabled flags
        lettersModeEnabled = false;
        numbersModeEnabled = false;
        colorsModeEnabled = false;
        
        // Update the UI state
        updateSelectedCount();
    }
});