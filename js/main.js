const modalWindowAuth = document.querySelector('.modal-auth');
const loginForm = document.getElementById('logInForm');
const inputLogin = document.getElementById('login');
const inputPassword = document.getElementById('password');
const closeModalWindowAuthBtn = document.querySelector('.close-auth');
const loginButton = document.querySelector('.button-auth');
const logoutButton = document.querySelector('.button-out');
const userNameDisplay = document.querySelector('.user-name');

function openAuthModal() {
    modalWindowAuth.style.display = 'flex';
    inputLogin.value = '';
    inputPassword.value = '';
    inputLogin.classList.remove('input-error');
    inputPassword.classList.remove('input-error');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    modalWindowAuth.style.display = 'none';
    document.body.style.overflow = '';
}

function loginUser(login) {
    localStorage.setItem('user', login);
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
    userNameDisplay.textContent = login;
    userNameDisplay.style.display = 'block';
    closeAuthModal();
}

function logoutUser() {
    localStorage.removeItem('user');
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    userNameDisplay.textContent = '';
}

window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        loginUser(savedUser);
    }
});

loginButton.addEventListener('click', openAuthModal);

logoutButton.addEventListener('click', logoutUser);

closeModalWindowAuthBtn.addEventListener('click', closeAuthModal);

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = inputLogin.value.trim();
    const password = inputPassword.value.trim();

    let hasError = false;

    if (!login) {
        inputLogin.classList.add('input-error');
        hasError = true;
    } else {
        inputLogin.classList.remove('input-error');
    }
    if (!password) {
        inputPassword.classList.add('input-error');
        hasError = true;
    } else {
        inputPassword.classList.remove('input-error');
    }

    if (!hasError) {
        loginUser(login);
    }
});

modalWindowAuth.addEventListener('click', (e) => {
    if (e.target === modalWindowAuth) {
        closeAuthModal();
    }
});