const favorite = document.getElementsByClassName("favorite");

const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

const buttonsDeleteLevel = document.getElementsByClassName('button-delete-level');

// данные

const username = document.getElementById("username");
const levelContainer = document.getElementById("levels-container");

let user = JSON.parse(localStorage.getItem("user"));
username.textContent = user["username"];
let levels = [
    {"id": 5, "name": "Цветок", "thumbnail": "../img/levels/5.png", "status": "Пройден", "favorite": false, "author": ""},
    {"id": 2, "name": "Кружок", "thumbnail": "../img/levels/2.png", "status": "Начат", "favorite": true, "author": ""},
    {"id": 1, "name": "Смайлик", "thumbnail": "../img/levels/1.png", "status": "Не пройден", "favorite": true, "author": "Имя Пользователя"},
    {"id": 3, "name": "Лампа", "thumbnail": "../img/levels/3.png", "status": "Не пройден", "favorite": false, "author": "Имя Пользователя"}
            ]

let favoriteThumbnail;
let statusThumbnail;
let authorLevel;
for (const level of levels) {
    if (level["author"] === user["username"]) {
        favoriteThumbnail = level["favorite"] ? '../img/icons/favorite_icon.png' : '../img/icons/not_favorite_icon.png';
        if (level["status"] === 'Пройден') {
            statusThumbnail = '../img/icons/done_icon.png';
        } else if (level["status"] === 'Начат') {
            statusThumbnail = '../img/icons/pause_icon.png';
        } else {
            statusThumbnail = '../img/icons/start_icon.png';
        }
        levelContainer.innerHTML += 
        `<div class="d-flex py-0 px-0">
            <a id="` + level["id"] + `" href="../pages/level.html#` + level["id"] + `" class="d-flex card justify-content-between flex-column gap-2">
                <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                    <img src="` + level["thumbnail"] + `" alt="">
                    <div id="1" class="favorite anime-little">
                        <img src="` + favoriteThumbnail + `" alt="">
                    </div>
                </div>
                <div class="d-flex card-description justify-content-between mx-3 my-2">
                    <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                        <p class="card-title ov-text">~<span>` + level["id"] + `</span> - ` + level["name"] + `</p>
                        <p class="card-author ov-text">` + level["author"] + `</p>
                    </div>
                    <div class="card-status-level d-flex col-1 col-sm-1 col-lg-1 col-md-1 justify-content-end">
                        <img src="` + statusThumbnail + `" alt="">
                    </div>
                </div>
            </a>
        </div>`;
    }  
}
// данные

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
