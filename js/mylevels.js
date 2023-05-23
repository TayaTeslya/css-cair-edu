const favorite = document.getElementsByClassName("favorite");

const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

const buttonsDeleteLevel = document.getElementsByClassName('button-delete-level');

profileContainer.addEventListener('click', (event) => {
    profileMenu.classList.toggle('unvisible');
});

for (let i = 0; i < favorite.length; i++) {
    favorite[i].addEventListener('click', (event) => { // изменение иконки "избранное" при нажатии
        event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
        if (favorite[i].children[0].src.includes('/img/icons/not_favorite_icon.png')) {
            favorite[i].children[0].src = favorite[i].children[0].src.replace('not_favorite', 'favorite');
        }
        else {
            favorite[i].children[0].src = favorite[i].children[0].src.replace('favorite', 'not_favorite');
        }
        //вытаскивать айди, делать запрос на добавление в таблицу "избранное"
    });
}

for (const buttonDeleteLevel of buttonsDeleteLevel) {
    buttonDeleteLevel.addEventListener('click', (event) => {
        event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
        console.log(confirm('Вы действительно хотите удалить уровень? Данное действие отменить нельзя.'));
    });
}
