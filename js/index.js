const favorite = document.getElementsByClassName("favorite"); // кнопка добавления в/удаления из избранного
const levelContainer = document.getElementById("levels-container"); // объект для вывода уровней
const searchLevel = document.getElementById('search-level'); // кнопка поиска уровней

localStorage.setItem("user", JSON.stringify({ // сохранение в локальное хранилище браузера
    "id": 1, 
    "username": "Тася Тесля",               // Имя пользователя
    "avatarPath": "../img/avatars/av1.png", // URL путь до аватара на сервере
    "isStaff": false                       // уровень доступа пользователя (false - ученик, ture - администратор)
}));

let levels = [ // массив с объектами уровней
    {"id": 1, "name": "Смайлик", "thumbnail": "../img/levels/1.png", "checked": false, "status": "Не пройден", "favorite": true, "author": "Имя Пользователя"},
    {"id": 2, "name": "Кружок", "thumbnail": "../img/levels/2.png", "checked": true, "status": "Начат", "favorite": true, "author": ""},
    {"id": 3, "name": "Лампа", "thumbnail": "../img/levels/3.png", "checked": true, "status": "Не пройден", "favorite": false, "author": ""},
    {"id": 5, "name": "Цветок", "thumbnail": "../img/levels/5.png", "checked": true, "status": "Пройден", "favorite": false, "author": "Имя Пользователя"},
    {"id": 8, "name": "Диван", "thumbnail": "../img/levels/4.png", "checked": true, "status": "Не пройден", "favorite": false, "author": ""},
    {"id": 8, "name": "Горы", "thumbnail": "../img/levels/46.png", "checked": true, "status": "Не пройден", "favorite": false, "author": ""},
];

setLevels((element) => true); // вывод всех уровней

/**
 * функция вывода уровней в зависимости от выбранной категории
 * @param {function object} condition - функция, возвращающая true/false
 */
function setLevels(condition) {
    levelContainer.innerHTML = ''; // очищение объекта для вывода уровней
    for (const level of levels.filter(condition)) { // цикл, проходящий по отфильтрованным по категориям уровням
        if (!userInfo.isStaff && level.checked) { // вывод доступных для учеников уровней
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
        else if (userInfo.isStaff) { // вывод всех уровней для администраторов
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
}

for (let i = 0; i < favorite.length; i++) {
    favorite[i].addEventListener('click', (event) => { // событие клика по объекту избранное
        event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
        if (favorite[i].children[0].src.includes('/img/icons/not_favorite_icon.png')) { // изменение картинки избранного
            favorite[i].children[0].src = favorite[i].children[0].src.replace('not_favorite', 'favorite');
        }
        else {
            favorite[i].children[0].src = favorite[i].children[0].src.replace('favorite', 'not_favorite');
        }
    });
}

searchLevel.addEventListener('keyup', (event) => { // событие ввода данных в поле поиска
    let searchValue = searchLevel.value.trim().toLowerCase(); // переменная с искомой строкой
    if (searchValue) { // если поле ввода не пустое
        setLevels((element) => element.author.toLowerCase().includes(searchValue) || element.name.toLowerCase().includes(searchValue) || (element.id === Number(searchValue)));
    }
    else {
        changeCategory();
    }
});





        
