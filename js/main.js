const modalWindowAuth = document.querySelector('.modal-auth');
const loginForm = document.getElementById('logInForm');
const inputLogin = document.getElementById('login');
const inputPassword = document.getElementById('password');
const closeModalWindowAuthBtn = document.querySelector('.close-auth');
const loginButton = document.querySelector('.button-auth');
const logoutButton = document.querySelector('.button-out');
const userNameDisplay = document.querySelector('.user-name');
const list = document.querySelector('.cards-restaurants')

function isUserAuthorized() {
    const savedUser = localStorage.getItem('user');
    
    return savedUser ? 'restaurant.html' : null;
}

function createCard() {
    const card = document.createElement('div');
    card.className = 'card';

    const link = isUserAuthorized();
    console.log(link)
    const cardLink = link 
        ? `<a href="${link}" class="card card-restaurant">`
        : `<a href="#" class="card card-restaurant" onclick="openAuthModal()">`;

    card.insertAdjacentHTML('beforeend', `
        ${cardLink}
            <img src="img/tanuki/preview.jpg" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">Танукі</h3>
                    <span class="card-tag tag">60 хвилин</span>
                </div>
                <!-- /.card-heading -->
                <div class="card-info">
                    <div class="rating">
                        4.5
                    </div>
                    <div class="price">От 1 200 ₴</div>
                    <div class="category">Суші, роли</div>
                </div>
                <!-- /.card-info -->
            </div>
            <!-- /.card-text -->
        </a>
    `);
    return card;
}

function updateCards() {
    list.innerHTML = '';
    list.append(createCard())
    list.append(createCard())
    list.append(createCard())
}
updateCards()

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
    updateCards();
}

function logoutUser() {
    localStorage.removeItem('user');
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    userNameDisplay.textContent = '';
    updateCards();
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
