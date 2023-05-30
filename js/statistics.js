const categoriesButton = document.getElementById("categories");
const categoriesList = document.getElementById("categories-list");

let selectedCategory = 0; // выбранная категория игр (по умолчанию - все)

const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

const username = document.getElementById("username");
const rating = document.getElementById("rating");
const scores = document.getElementById("scores");
const levelsDone = document.getElementById("levels-done");
const levelsStatistic = document.getElementById("levels-statistic");

let userInfo = JSON.parse(localStorage.getItem("user"));

// api запрос инфы о пользователе
let userJSON = {
    "rating": 143, // место в рейтинге
    "usersLength": 894, // всего пользователей (для рейтинга)
    "scores": 5746, // собрано очков за все уровни (максимальных)
    "levelsDone": 324, // сколько уровеней пройдено
    "levelsLength": 5534, //сколько всего уровней
    "github": "github", // ссылка на гитхаб
    "description": "Я Тася!" // описание
}

username.textContent = userInfo.username;
rating.textContent = `Рейтинг - ${userJSON.rating}/${userJSON.usersLength}`;
scores.textContent = `Собрано очков - ${userJSON.scores}`;
levelsDone.textContent = `Пройдено уровней - ${userJSON.levelsDone}/${userJSON.levelsLength}`;

let levels = [
    {"id": 5, "name": "Цветок", "thumbnail": "../img/levels/5.png", "status": "Пройден", "favorite": false, "author": "", maxSore: 4314, score: 234},
    {"id": 2, "name": "Кружок", "thumbnail": "../img/levels/2.png", "status": "Начат", "favorite": true, "author": "", maxSore: 434, score: 24},
    {"id": 1, "name": "Смайликfsdfsdfsdfsdfsdfsdfd", "thumbnail": "../img/levels/1.png", "status": "Не пройден", "favorite": true, "author": "Имя Пользователя", maxSore: 464, score: 67},
    {"id": 3, "name": "Лампа", "thumbnail": "../img/levels/3.png", "status": "Не пройден", "favorite": false, "author": "Имя Пользователя", maxSore: 776, score: 775}
]

let statusThumbnail;
for (const level of levels) {
    levelsStatistic.innerHTML += 
    `<div class="d-flex col-lg-4 col-md-4 col-sm-4 col-4">
        <a id="${level.id}" href="../pages/level.html#${level.id}" class="d-flex w-100 align-items-center justify-content-center gap-3">
            <div class="img-level">
                <img src="${level.thumbnail}" alt=""/>
            </div>
            <span class="name-level">${level.author ? `~` : `#`}${level.id} - ${level.name}</span>
        </a>
    </div>
    <div class="d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
        <div class="img-progress">
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
    <div class="d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
        <span>${level.score} из ${level.maxSore} (${Math.floor(100 / level.maxSore * level.score)}%)</span>
    </div>`;
}


profileContainer.addEventListener('click', (event) => {
    profileMenu.classList.toggle('unvisible');
});

categoriesButton.addEventListener('click', (event) => {
    categoriesList.classList.toggle('unvisible');
});

categoriesList.addEventListener('mouseenter', (event) => { // удаление класса "выбрано" при наведении на категории
    categoriesList.children[selectedCategory].classList.remove('select-category');
});

categoriesList.addEventListener('mouseleave', (event) => { // добавление класса "выбрано" на выбранный элемент при сведении мыши с категорий
    categoriesList.children[selectedCategory].classList.add('select-category');
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