const profileContainer = document.getElementById("profile-container"); // кнопка профиля
const profileMenu = document.getElementById("profile-menu"); // список навигации профиля
const username = document.getElementById("username"); // объект имени пользователя
const profilePhoto = document.getElementById("profile-photo"); // объект для вывода аватарки пользователя

let userInfo = JSON.parse(localStorage.getItem("user")); // получение объекта пользователя
username.textContent = userInfo.username;
profilePhoto.src = userInfo.avatarPath;

if (userInfo.isStaff) { // список навигации для администраторов
    profileMenu.innerHTML = `
    <a href="../pages/rating.html" class="category-bottom">
        Рейтинг
    </a>
    <a href="../pages/auth.html" class="category-bottom">
        Выйти из аккаунта
    </a>`;
}
else { // список навигации для учеников
    profileMenu.innerHTML = `
    <a href="../pages/profile.html#${userInfo.id}" class="category-top">
        Профиль
    </a>
    <a href="../pages/statistics.html" class="">
        Статистика
    </a>
    <a href="../pages/rating.html" class="category-bottom">
        Рейтинг
    </a>
    <a href="../pages/auth.html" class="category-bottom">
        Выйти из аккаунта
    </a>`;
}

profileContainer.addEventListener('click', (event) => { // событие клика по кнопке профиля
    profileMenu.classList.toggle('unvisible');
});