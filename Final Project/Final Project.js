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
