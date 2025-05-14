// login
function showLogin() {
    document.getElementById('anony').style.display = 'none';
    document.getElementById('login').style.display = 'block';
  }

// Continue button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get continue buttons
    const anonyButton = document.querySelector('#anony .continue-button');
    const loginButton = document.querySelector('#login .continue-button');
    const helpButton = document.querySelector('#help .continue-button');

    // Add click event listeners
    anonyButton.addEventListener('click', () => {
        document.getElementById('anony').style.display = 'none';
        document.getElementById('settings').style.display = 'flex';
    });

    loginButton.addEventListener('click', () => {
        document.getElementById('login').style.display = 'none';
        document.getElementById('settings').style.display = 'flex';
    });

    helpButton.addEventListener('click', () => {
        document.getElementById('help').style.display = 'none';
        document.getElementById('settings').style.display = 'flex';
    });

});

// navigation functions
function showSection(sectionId) {
    const sections = ['anony', 'help', 'settings'];
    sections.forEach(id => {
      document.getElementById(id).style.display = (id === sectionId) ? 'block' : 'none';
    });
  }

// Avatar
const style = "bottts";

function updateAvatar(seed, targetId) {
  const avatarURL = `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  document.getElementById(targetId).innerHTML = `
    <img src="${avatarURL}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">
    `;
}

// Setup for #anony nickname input
const anonyNicknameInput = document.querySelector('#anony .nickname-input');
anonyNicknameInput.addEventListener('input', (e) => {
  const seed = e.target.value.trim() || 'guest';
  updateAvatar(seed, 'avatarAnony');
});

// Setup for #login nickname input
const loginNicknameInput = document.querySelector('#login .nickname-input');
loginNicknameInput.addEventListener('input', (e) => {
  const seed = e.target.value.trim() || 'user';
  updateAvatar(seed, 'avatarLogin');
});

// Initial avatars
updateAvatar('guest', 'avatarAnony');
updateAvatar('user', 'avatarLogin');

//select settings
document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('#modes button');
    const countDisplay = document.getElementById('count');
    const statusText = document.querySelector('.selected-mode');
    let selectedCount = 0;
    const maxSelections = 2; // Maximum 2 selections allowed
    
    modeButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isLettersButton = button.querySelector('#letters') !== null;
            const isNumbersButton = button.querySelector('#numbers') !== null;
            const isSelected = button.classList.contains('selected');
            
            // Check if trying to select both Letters and Numbers
            if (!isSelected && ((isLettersButton && hasNumbersSelected()) || 
                (isNumbersButton && hasLettersSelected()))) {
                alert("You cannot select both Letters and Numbers modes!");
                return;
            }
            
            // Check if trying to select a third mode
            if (!isSelected && selectedCount >= maxSelections) {
                alert("You can only select up to two modes!");
                return;
            }
            
            // Toggle selection
            if (isSelected) {
                button.classList.remove('selected');
                selectedCount--;
            } else {
                button.classList.add('selected');
                selectedCount++;
            }
            
            // Update counter and status
            countDisplay.textContent = selectedCount;
            updateStatusText();
        });
    });
    
    // Helper function to check if Letters mode is selected
    function hasLettersSelected() {
        return document.querySelector('#letters').closest('button').classList.contains('selected');
    }
    
    // Helper function to check if Numbers mode is selected
    function hasNumbersSelected() {
        return document.querySelector('#numbers').closest('button').classList.contains('selected');
    }
    
});

// Start button 
function handleStartClick(sectionId) {
    document.getElementById(sectionId).style.display = 'none';
    document.getElementById('game').style.display = 'block';
}

document.querySelector('#settings .start-button').addEventListener('click', () => handleStartClick('settings'));





// Game Function

const gameButton = document.querySelectorAll(".gameBox");
const colors = document.querySelectorAll(".colors");
const submitButton = document.querySelector("#submit");
const inputField = document.querySelector("#inputField");

startNewGame();

function startNewGame() {
    generateSequence();
    currentRound = 1;
    playerInput = [];
    console.log("Game Start");
    playSequenceAnimationLetters(currentRound);
    playSequenceAnimationColors(currentRound);
    playSequenceAnimationNumbers(currentRound);
    playSequenceAnimation(currentRound);
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

    if (lettersModeEnabled) listenersAttachedLetters = true;
    if (numbersModeEnabled) listenersAttachedNumbers = true;
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
        playSequenceAnimation(currentRound);

            if (colorsModeEnabled) {
                score+=2
                playSequenceAnimationColors(currentRound);
            }
            if (lettersModeEnabled) {
                score+=2
                playSequenceAnimationLetters(currentRound);
            }
            if (numbersModeEnabled) {
                score+=2
                playSequenceAnimationNumbers(currentRound);
        }
    }
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


function playSequenceAnimation(currentRound) {
    const baseDelay = 1000;
    const stepDelay = 800;

    for (let i = 0; i < currentRound; i++) {
        setTimeout(() => {
            const button = document.getElementById(playOrder[i]);
            button.classList.add("flash");
            setTimeout(() => {
                button.classList.remove("flash");
                console.log("Cleared seq on button", button.id);
            }, 500); 
        }, baseDelay + i * stepDelay);
    }
}

function playSequenceAnimationColors(currentRound) {
    const baseDelay = 1000;
    const stepDelay = 800;
    for (let i = 0; i < currentRound; i++) {
        setTimeout(() => {
            const button = document.getElementById(playOrder[i]);
            const color = colorsMode[i];
            const originalColor = button.style.backgroundColor;
            button.style.backgroundColor = color;
            button.classList.add("flash");
            setTimeout(() => {
                button.classList.remove("flash");
                button.style.backgroundColor = originalColor;
                console.log("Cleared color on button", button.id);
            }, 500); 
        }, baseDelay + i * stepDelay);  
    }
}
function playSequenceAnimationLetters(currentRound) {
    const baseDelay = 1000;
    const stepDelay = 800;

    for (let i = 0; i < currentRound; i++) {
        setTimeout(() => {
            const button = document.getElementById(playOrder[i]);
            const letter = lettersMode[i];
            button.textContent = letter; 
            setTimeout(() => {
                button.textContent = ""; 
                console.log("Cleared letter on button", button.id);
            }, 500);
        }, baseDelay + i * stepDelay);
    }
}
function playSequenceAnimationNumbers(currentRound) {
    const baseDelay = 1000;
    const stepDelay = 800;
    
    
    for (let i = 0; i < currentRound; i++) {
        setTimeout(() => {
            const button = document.getElementById(playOrder[i]);
            const number = numbersMode[i];
            button.textContent = number; 
            setTimeout(() => {
                button.textContent = "";
                console.log("Cleared number on button", button.id); 
            }, 500);
        }, baseDelay + i * stepDelay);
    }
}

function callPopup() {
    const popUp = document.querySelector(".popUp");
    const closePopup = document.getElementById("closePopup")
    const finalScore = document.getElementById("finalScore")

    popUp.style.display = "flex";
    finalScore.textContent = score;


    closePopup.addEventListener("click", () => {
        popUp.style.display = "none";
        startNewGame();
    });
}
