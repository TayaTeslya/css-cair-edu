const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

profileContainer.addEventListener('click', (event) => {
    profileMenu.classList.toggle('unvisible');
});