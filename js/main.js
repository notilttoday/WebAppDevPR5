const modalWindowAuth = document.querySelector('.modal-auth');
const loginForm = document.getElementById('logInForm');
const inputLogin = document.getElementById('login');
const inputPassword = document.getElementById('password');
const closeModalWindowAuthBtn = document.querySelector('.close-auth');
const loginButton = document.querySelector('.button-auth');
const logoutButton = document.querySelector('.button-out');
const userNameDisplay = document.querySelector('.user-name');
const list = document.querySelector('.cards-restaurants')
const search = document.querySelector('.input-search');
const restaurantCardsContainer = document.querySelector('.cards-restaurants');
const sectionTitle = document.querySelector('.section-title');

function createRestaurantCard(restaurant) {
    const { name, image, stars, price, kitchen, products, time_of_delivery } = restaurant;

    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.products = products;

    card.insertAdjacentHTML('beforeend', `
        <a href="#" class="card-link">
            <img src="${image}" alt="${name}" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${time_of_delivery} хвилин</span>
                </div>
                <div class="card-info">
                    <div class="rating">${stars}</div>
                    <div class="price">Від ${price} ₴</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </a>
    `);
    return card;
}

function createMenuItemCard(item) {
    const { name, description, price, image } = item;

    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="${name}" class="card-image" />
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
                <div class="ingredients">${description}</div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary button-add-cart">
                    <span class="button-card-text">У кошик</span>
                </button>
                <strong class="card-price-bold">${price} ₴</strong>
            </div>
        </div>
    `);
    return card;
}

async function fetchRestaurants() {
    try {
        const response = await fetch('./json/partners.json');
        if (!response.ok) throw new Error('Не вдалося завантажити дані ресторанів');
        const restaurants = await response.json();
        list.innerHTML = '';
        restaurants.forEach(restaurant => {
            const card = createRestaurantCard(restaurant);
            list.append(card);
        });
    } catch (error) {
        console.error('Помилка:', error);
    }
}

async function fetchMenu(menuPath) {
    try {
        const response = await fetch(`./json/${menuPath}`);
        if (!response.ok) throw new Error('Не вдалося завантажити меню');
        const menu = await response.json();
        menuList.innerHTML = '';
        menu.forEach(item => {
            const card = createMenuItemCard(item);
            menuList.append(card);
        });
    } catch (error) {
        console.error('Помилка:', error);
    }
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        menu: params.get('menu'),
        stars: params.get('stars'),
        price: params.get('price'),
        category: params.get('category'),
    };
}

async function loadRestaurantMenu() {
    const restaurantTitle = document.querySelector('.restaurant-title');
    const rating = document.querySelector('.rating');
    const price = document.querySelector('.price');
    const category = document.querySelector('.category');
    const cardsMenu = document.querySelector('.cards-menu');

    if (!restaurantTitle || !rating || !price || !category || !cardsMenu) {
        console.warn('Ця функція працює лише на сторінці restaurant.html');
        return;
    }

    const { name, menu, stars, price: menuPrice, category: menuCategory } = getQueryParams();

    restaurantTitle.textContent = name;
    rating.textContent = stars;
    price.textContent = `${menuPrice}`;
    category.textContent = menuCategory;

    try {
        const response = await fetch(`./json/${menu}`);
        if (!response.ok) throw new Error('Не вдалося завантажити меню');
        const menuItems = await response.json();

        cardsMenu.innerHTML = '';
        menuItems.forEach((item) => {
            const menuCard = createMenuItemCard(item);
            cardsMenu.append(menuCard);
        });
    } catch (error) {
        console.error('Помилка при завантаженні меню:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadRestaurantMenu)

list.addEventListener('click', (event) => {
    const cardLink = event.target.closest('.card-link');

    if (cardLink) {
        if (!localStorage.getItem('user')) {
            event.preventDefault();
            openAuthModal();
        } else {
            const card = cardLink.closest('.card');
            const menuPath = card.dataset.products;
            const restaurantName = card.querySelector('.card-title').textContent;
            const stars = card.querySelector('.rating').textContent;
            const price = card.querySelector('.price').textContent;
            const category = card.querySelector('.category').textContent;

            window.location.href = `restaurant.html?name=${restaurantName}&menu=${menuPath}&stars=${stars}&price=${price}&category=${category}`;
        }
    }
});

fetchRestaurants();

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

list.addEventListener('click', (event) => {
    const cardLink = event.target.closest('.card-link');

    if (cardLink && !localStorage.getItem('user')) {
        event.preventDefault();
        openAuthModal();
    }
});

search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();

        const cards = restaurantCardsContainer.querySelectorAll('.card');

        if (!query) {
            sectionTitle.textContent = 'Ресторани';

            search.classList.add('input-error');

            setTimeout(() => {
                search.classList.remove('input-error');
            }, 1500);

            search.value = '';

            cards.forEach(card => {
                card.style.display = '';
            });

            return;
        }
        
        sectionTitle.textContent = 'Результат пошуку';

        cards.forEach(card => {
            const restaurantName = card.querySelector('.card-title').textContent.toLowerCase();
            const restaurantCategory = card.querySelector('.category').textContent.toLowerCase();

            if (restaurantName.includes(query.toLowerCase()) || restaurantCategory.includes(query.toLowerCase())) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});