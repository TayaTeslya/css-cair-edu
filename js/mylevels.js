const favorite = document.getElementsByClassName("favorite");

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