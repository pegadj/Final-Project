// login
function showLogin() {
    document.getElementById('anony').style.display = 'none';
    document.getElementById('login').style.display = 'block';
  }

// Start button 
function handleStartClick(sectionId) {
    document.getElementById(sectionId).style.display = 'none';
    document.getElementById('settings').style.display = 'block';
}

document.querySelector('#anony .start-button').addEventListener('click', () => handleStartClick('anony'));
document.querySelector('#login .start-button').addEventListener('click', () => handleStartClick('login'));

//continue button
function handleStartClick(sectionId) {
    document.getElementById(sectionId).style.display = 'none';
    document.getElementById('settings').style.display = 'block';
}

document.querySelector('#help .continue-button').addEventListener('click', () => handleStartClick('help'));

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

  //color mode settings
