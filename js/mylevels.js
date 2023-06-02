const buttonsDeleteLevel = document.getElementsByClassName('button-delete-level'); // кнопка удаления уровня
const levelContainer = document.getElementById("levels-container"); // объект для вывода уровней

const searchLevel = document.getElementById('search-level'); // кнопка поиска уровней

let levels = [ // массив объектов уровней
    {"id": 5, "name": "Цветок", "thumbnail": "../img/levels/5.png", "checked": true, dateDelete: "24-03-21", "favorite": false, "author": "Имя Пользователя", idAuthor: 4, reason: 'Причина отклонения'},
    {"id": 2, "name": "Кружок", "thumbnail": "../img/levels/2.png", "checked": false, dateDelete: "", "favorite": true, "author": "Имя Пользователя", idAuthor: 1, reason: null},
    {"id": 1, "name": "Смайлик", "thumbnail": "../img/levels/1.png", "checked": true, dateDelete: "24-03-21", "favorite": true, "author": "Тася Тесля", idAuthor: 1, reason: 'Причина отклонения'},
    {"id": 3, "name": "Лампа", "thumbnail": "../img/levels/3.png", "checked": true, dateDelete: "", "favorite": false, "author": "Имя Пользователя", idAuthor: 0, reason: ''}
];

let checked; // флаг проверки уровня

setLevels((element) => true);

/**
 * функция вывода уровней в зависимости от выбранной категории
 * @param {function object} condition - функция, возвращающая true/false
 */
function setLevels(condition) {
    levelContainer.innerHTML = '';
    for (const level of levels.filter(condition)) {
        if (level.idAuthor === userInfo.id) { // если уровень создал авторизованный пользователь
            if (level.checked) {
                if (level.dateDelete) {
                    checked = "Отклонён";
                }
                else {
                    checked = "Выложен";
                }
            }
            else {
                checked = "На проверке";
            }
            levelContainer.innerHTML += 
            `<div class="d-flex py-0 px-0">
                <a title="${level.reason || ''}" id="${level.id}" href="${checked === "Выложен" ? `../pages/level.html#${level.id}` : `../pages/newlevel.html#${level.id}`}" class="d-flex card justify-content-between flex-column gap-2">
                    <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                        <img src="${level.thumbnail}" alt="">
                    </div>
                    <div class="d-flex card-description justify-content-between mx-3 my-2">
                        <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                            <p class="card-title ov-text">~<span>${level.id}</span> - ${level.name}</p>
                            <p class="${checked === "Отклонён" && "error"} card-author ov-text">${checked}</p>
                        </div>
                    </div>
                </a>
            </div>`;
        }  
    }
}

for (const buttonDeleteLevel of buttonsDeleteLevel) {
    buttonDeleteLevel.addEventListener('click', (event) => { // событие клика по кнопке 
        event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
        console.log(confirm('Вы действительно хотите удалить уровень? Данное действие отменить нельзя.')); 
    });
}

searchLevel.addEventListener('keyup', (event) => { // событие ввода данных в поле поиска
    let searchValue = searchLevel.value.trim().toLowerCase(); // переменная с искомой строкой
    setLevels((element) => element.name.toLowerCase().includes(searchValue) || (element.id === Number(searchValue)));
});