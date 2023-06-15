/*
Данный файл является скриптом главной страницы
Переменные:
    favorite - объект кнопки добавления в/удаления из избранного
    levelContainer - объект для вывода уровней
    userButton - объект кнопок для учеников
    adminButton - объект кнопок для администраторов
    levels - массив объектов уровней
    currentLevels - массив объектов отфильтрованных и/или соответствующих поиску уровней
Функции:
    setLevels - функция вывода уровней
        Принимает в себя:
            condition - фильтр и/или строка поиска
*/

const favorite = document.getElementsByClassName("favorite"); // кнопка добавления в/удаления из избранного
const levelContainer = document.getElementById("levels-container"); // объект для вывода уровней
const userButton = document.getElementById("user-button"); // объект кнопок для учеников
const adminButton = document.getElementById("admin-button"); // объект кнопок для администраторов

let levels;
let currentLevels;

if (userInfo.isStaff) {
    userButton.classList.add('d-none');
    adminButton.classList.remove('d-none');
}

fetch(`http://localhost:3001/api/levels?idUser=${userInfo.id}`).then((res) => res.json())
.then((res) => {
    levels = res;
    currentLevels = res;

    setLevels((element) => true); // вывод всех уровней

    /**
     * функция вывода уровней в зависимости от выбранной категории
     * @param {function object} condition - функция, возвращающая true/false
     */
    for (let i = 0; i < favorite.length; i++) {
        favorite[i].addEventListener('click', (event) => { // событие клика по объекту избранное
            event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
            if (favorite[i].children[0].src.includes('/img/icons/not_favorite_icon.png')) { // изменение картинки избранного
                fetch(`http://localhost:3001/api/favorite`, { 
                        method: 'POST', 
                        headers: {'Content-Type' : 'application/json'}, 
                        body: JSON.stringify({
                            idUser: userInfo.id, 
                            idLevel: event.target.dataset.idLevel
                    })})
                    .then((res) => res.json()).then((res) => {
                    if (res) {
                        favorite[i].children[0].src = favorite[i].children[0].src.replace('not_favorite', 'favorite');
                    }
                });
            }
            else {
                fetch(`http://localhost:3001/api/favorite`, { 
                        method: 'DELETE', 
                        headers: {'Content-Type' : 'application/json'}, 
                        body: JSON.stringify({
                            idUser: userInfo.id, 
                            idLevel: event.target.dataset.idLevel
                    })})
                    .then((res) => res.json()).then((res) => {
                    if (res) {
                        favorite[i].children[0].src = favorite[i].children[0].src.replace('favorite', 'not_favorite');
                    }
                });
            }
        });
    }

}).catch((error) => {
    console.log(error);
});

function setLevels(condition) {
    levelContainer.innerHTML = ''; // очищение объекта для вывода уровней
    currentLevels = currentLevels.filter(condition);
    for (const level of currentLevels) { // цикл, проходящий по отфильтрованным по категориям уровням
        if (!userInfo.isStaff && level.isChecked && !level.dateDelete) { // вывод доступных для учеников уровней
            levelContainer.innerHTML += 
            `<div class="d-flex py-0 px-0">
                <a id="${level.id}" href="../pages/level.html#${level.id}" class="d-flex card justify-content-between flex-column gap-2">
                    <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                        <img src="${level.thumbnail}" alt="">
                        <div data-id-level='${level.id}' class="favorite anime-little">
                            <img src="${level.favorite ? '../img/icons/favorite_icon.png' : '../img/icons/not_favorite_icon.png'}" alt="">
                        </div>
                    </div>
                    <div class="d-flex card-description justify-content-between mx-3 my-2">
                        <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                            <p class="card-title ov-text">${level.author ? "~" : "#"}<span>${level.id}</span> - ${level.name}</p>
                            <p class="card-author ov-text">${level.author || ''}</p>
                        </div>
                        <div class="card-status-level d-flex col-1 col-sm-1 col-lg-1 col-md-1 justify-content-end">
                            <img src="${ 
                                (() => 
                                    {
                                        if (level.maxScore === level.maxScoreUser) { // Пройден
                                            return '../img/icons/done_icon.png';
                                        } else if (level.maxScoreUser === null) { // Не начат
                                            return '../img/icons/start_icon.png';
                                        } else { // Начат
                                            return '../img/icons/pause_icon.png';
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
            if (level.isChecked) {
                if (level.dateDelete) {
                    checked = ' - Отклонён';
                }
                else {
                    checked = '';
                }
            }
            else {
                checked = ' - Не проверен';
            }
            levelContainer.innerHTML += 
            `<div class="d-flex py-0 px-0">
                <a id="${level.id}" href="../pages/newlevel.html#${level.id}" class="d-flex card justify-content-between flex-column gap-2">
                    <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                        <img src="${level.thumbnail}" alt="">
                    </div>
                    <div class="d-flex card-description justify-content-between mx-3 my-2">
                        <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                            <p class="card-title ov-text">${level.author ? "~" : "#"}<span>${level.id}</span> - ${level.name}</p>
                            <p class="card-author ov-text">${level.author || ''}<span class="error">${checked}</span></p>
                        </div>
                    </div>
                </a>
            </div>`;
        }
    }
}




        
