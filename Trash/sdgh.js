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


document.addEventListener("DOMContentLoaded", () => {    
    const selectLetters = document.getElementById("selectLetters");
    const selectNumbers = document.getElementById("selectNumbers");
    const selectColors = document.getElementById("selectColors");

    if(selectLetters) {
        selectLetters.addEventListener("click", () => {
            lettersModeEnabled = !lettersModeEnabled;
            selectLetters.classList.toggle('selected', lettersModeEnabled);
            localStorage.setItem("lettersModeEnabled", lettersModeEnabled);
            console.log("enabled letters");
            updateSelectedCount();
        });
    }

    if(selectNumbers) {
        selectNumbers.addEventListener("click", () => {
            numbersModeEnabled = !numbersModeEnabled;
            selectNumbers.classList.toggle('selected', numbersModeEnabled);
            localStorage.setItem("numbersModeEnabled", numbersModeEnabled);
            console.log("enabled numbers");
            updateSelectedCount();
        });
    }

    if(selectColors) {
        selectColors.addEventListener("click", () => {
            colorsModeEnabled = !colorsModeEnabled;
            selectColors.classList.toggle('selected', colorsModeEnabled);
            localStorage.setItem("colorsModeEnabled", colorsModeEnabled);
            console.log("enabled colors");
            updateSelectedCount();
        });
    }
});