const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

if (userInfo.isStaff) {
    profileMenu.innerHTML = `
    <a href="../pages/rating.html" class="category-bottom">
        Рейтинг
    </a>`;
}
else {
    profileMenu.innerHTML = `
    <a href="../pages/profile.html" class="category-top">
        Профиль
    </a>
    <a href="../pages/statistics.html" class="">
        Статистика
    </a>
    <a href="../pages/rating.html" class="category-bottom">
        Рейтинг
    </a>`;

}

profileContainer.addEventListener('click', (event) => {
    profileMenu.classList.toggle('unvisible');
});