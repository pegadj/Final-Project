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
    // Login avatar update
    const loginInput = document.querySelector('#loginNickname');
    if (loginInput) {
        loginInput.addEventListener('input', (e) => {
            const seed = e.target.value.trim() || 'user';
            updateAvatar(seed, 'avatarLogin');
        });
        
        updateAvatar('user', 'avatarLogin');
    }

    // Anonymous avatar update
    const anonyInput = document.querySelector('#anonyNickname');
    if (anonyInput) {
        anonyInput.addEventListener('input', (e) => {
            const seed = e.target.value.trim() || 'guest';
            updateAvatar(seed, 'avatarAnony');
        });
        
        updateAvatar('guest', 'avatarAnony');
    }
});


// Login validation
function validateLogin() {
  const username = document.getElementById('loginNickname').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    alert('Both username and password are required');
    return false;
  }

  // Check if user exists in localStorage
  const user = JSON.parse(localStorage.getItem(username));
  if (!user || user.password !== password) {
    alert('Invalid username or password');
    return false;
  }

  // Store logged in user
  localStorage.setItem('loggedInUser', username);
  return true;
}

// Register validation
function registerUser() {
  const username = document.getElementById('registerNickname').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!username || !password || !confirmPassword) {
    alert('All fields are required');
    return false;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return false;
  }

  if (localStorage.getItem(username)) {
    alert('Username already exists');
    return false;
  }

  // Save user data
  const user = {
    username: username,
    password: password,
    avatarSeed: username
  };

  localStorage.setItem(username, JSON.stringify(user));
  localStorage.setItem('loggedInUser', username);
  
  alert('Registration successful! Redirecting to settings...');
  window.location.href = 'Settings.html';
  return true;
}

// Guest mode
function handleAnonymousLogin() {
    const nickname = document.querySelector('#anonyNickname').value.trim();
    
    // Debug log
    console.log('Nickname entered:', nickname);

    if (!nickname) {
        alert('Please enter a nickname');
        return false;
    }

    try {
        localStorage.setItem('guestNickname', nickname);
        window.location.href = 'Settings.html';
        return true;
    } catch (error) {
        console.error('Error saving nickname:', error);
        alert('An error occurred. Please try again.');
        return false;
    }
}

//login functionality
function handleLogin() {
    const username = document.getElementById('loginNickname').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        alert('Both username and password are required');
        return false;
    }

    const user = JSON.parse(localStorage.getItem(username));
    if (!user || user.password !== password) {
        alert('Invalid username or password');
        return false;
    }

    localStorage.setItem('loggedInUser', username);
    window.location.href = 'Settings.html';
    return true;
}






// // Game Function

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
