const categoriesButton = document.getElementById("categories");
const categoriesList = document.getElementById("categories-list")
const favorite = document.getElementsByClassName("favorite");

const username = document.getElementById("username");
const levelContainer = document.getElementById("levels-container");

localStorage.setItem("user", JSON.stringify({
    "id": 1,
    "username": "ТАСЯ !!!",        // Имя пользователя, пример "XXxx_zubenchik_xxXX"
    "fullName": "Имя пользователя",        // ФИО пользователя, пример "Зубенко Михаил Петрович"
    "avatarPath": "../img/avatars/av1.png",      // URL путь до аватара на сервере, можно вставить в `src` аттрибут <img> напрямую, пример "/static/media/3434hff36ff.png"
    "isStaff": false      // Пользователь-администратор, пример true или false
}));

let selectedCategory = 0; // выбранная категория игр (по умолчанию - все)

// данные
let userInfo = JSON.parse(localStorage.getItem("user"));
username.textContent = userInfo.username;
let levels = [
    {"id": 5, "name": "Цветок", "thumbnail": "../img/levels/5.png", "checked": true, "status": "Пройден", "favorite": false, "author": "Имя Пользователя"},
    {"id": 2, "name": "Кружок", "thumbnail": "../img/levels/2.png", "checked": true, "status": "Начат", "favorite": true, "author": ""},
    {"id": 1, "name": "Смайлик", "thumbnail": "../img/levels/1.png", "checked": false, "status": "Не пройден", "favorite": true, "author": "Имя Пользователя"},
    {"id": 3, "name": "Лампа", "thumbnail": "../img/levels/3.png", "checked": true, "status": "Не пройден", "favorite": false, "author": ""}
            ];

for (const level of levels) {
    if (!userInfo.isStaff && level.checked) {

        levelContainer.innerHTML += 
        `<div class="d-flex py-0 px-0">
            <a id="${level.id}" href="../pages/level.html#${level.id}" class="d-flex card justify-content-between flex-column gap-2">
                <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                    <img src="${level.thumbnail}" alt="">
                    <div id="1" class="favorite anime-little">
                        <img src="${level.favorite ? '../img/icons/favorite_icon.png' : '../img/icons/not_favorite_icon.png'}" alt="">
                    </div>
                </div>
                <div class="d-flex card-description justify-content-between mx-3 my-2">
                    <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                        <p class="card-title ov-text">${level.author ? "~" : "#"}<span>${level.id}</span> - ${level.name}</p>
                        <p class="card-author ov-text">` + level.author + `</p>
                    </div>
                    <div class="card-status-level d-flex col-1 col-sm-1 col-lg-1 col-md-1 justify-content-end">
                        <img src="${ 
                            (() => 
                                {
                                    if (level.status === 'Пройден') {
                                        return '../img/icons/done_icon.png';
                                    } else if (level.status === 'Начат') {
                                        return '../img/icons/pause_icon.png';
                                    } else {
                                        return '../img/icons/start_icon.png';
                                    }
                                }
                            )() // () - вызов стрелочной ф-ции
                        }" alt="">  
                    </div>
                </div>
            </a>
        </div>`;
    }
    else if (userInfo.isStaff) {
        levelContainer.innerHTML += 
        `<div class="d-flex py-0 px-0">
            <a id="${level.id}" href="../pages/newlevel.html#${level.id}" class="d-flex card justify-content-between flex-column gap-2">
                <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                    <img src="${level.thumbnail}" alt="">
                </div>
                <div class="d-flex card-description justify-content-between mx-3 my-2">
                    <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                        <p class="card-title ov-text">${level.author ? "~" : "#"}<span>${level.id}</span> - ${level.name}</p>
                        <p class="card-author ov-text">${level.author}${!level.checked ? `<span class="error"> - На проверке</span>` : ""}</p>
                    </div>
                </div>
            </a>
        </div>`;
    }
}
// данные

categoriesButton.addEventListener('click', (event) => {
        categoriesList.classList.toggle('unvisible');
});

for (let i = 0; i < categoriesList.children.length; i++) { // выбор категории
    categoriesList.children[i].addEventListener('click', (event) =>  { 
        selectedCategory = i;
        if (categoriesList.children[i].textContent.trim() === 'Все') {
            categoriesButton.children[0].textContent = 'Категории';
            categoriesButton.classList.remove('white-category');
        } else {
            categoriesButton.children[0].textContent = categoriesList.children[i].textContent.trim();
            categoriesButton.classList.add('white-category');
        }
        categoriesList.classList.add('unvisible');
    });
}

categoriesList.addEventListener('mouseenter', (event) => { // удаление класса "выбрано" при наведении на категории
    categoriesList.children[selectedCategory].classList.remove('select-category');
});

categoriesList.addEventListener('mouseleave', (event) => { // добавление класса "выбрано" на выбранный элемент при сведении мыши с категорий
    categoriesList.children[selectedCategory].classList.add('select-category');
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



        
