const rating = document.getElementById("rating"); // объект для вывода рейтинга
const scores = document.getElementById("scores"); // объект для вывода очков
const levelsDone = document.getElementById("levels-done"); // объект для вывода количества пройденных уровней
const levelsStatistic = document.getElementById("levels-statistic"); // объект для вывода статистики по уровням

let levels;
let searchLevel = false;

fetch(`http://localhost:3001/api/levels?idUser=${userInfo.id}&isStatistic=true`).then((res) => res.json())
.then(({results, statisticUser}) => {

    levels = results;

    rating.textContent = `Рейтинг - ${statisticUser.rating}/${statisticUser.count}`;
    scores.textContent = `Собрано очков - ${statisticUser.scores}`;
    levelsDone.textContent = `Пройдено уровней - ${statisticUser.done}/${statisticUser.levels}`;

    // let levels = [ // объект с уровнями
    //     {"id": 5, "name": "Цветок", "thumbnail": "../img/levels/5.png", "status": "Пройден", checked: true, "favorite": false, "author": "", maxSore: 4314, score: 234},
    //     {"id": 2, "name": "Кружок", "thumbnail": "../img/levels/2.png", "status": "Начат", checked: true, "favorite": true, "author": "", maxSore: 434, score: 24},
    //     {"id": 1, "name": "Смайликfsdfsdfsdfsdfsdfsdfd", "thumbnail": "../img/levels/1.png", checked: true, "status": "Не пройден", "favorite": true, "author": "Имя Пользователя", maxSore: 464, score: 67},
    //     {"id": 3, "name": "Лампа", "thumbnail": "../img/levels/3.png", checked: true, "status": "Не пройден", "favorite": false, "author": "Имя Пользователя", maxSore: 776, score: 775}
    // ]
    setLevels((element) => true); // вывод всех уровней


}).catch((error) => {
    console.log(error);
});

/**
     * функция вывода уровней в зависимости от выбранной категории
     * @param {function object} condition - функция, возвращающая true/false
     */
function setLevels(condition) {
    levelsStatistic.innerHTML = ''; // очищение объекта для вывода уровней
    for (const level of levels.filter(condition)) { // цикл, проходящий по отфильтрованным по категориям уровням
        if (!userInfo.isStaff && level.isChecked) { // вывод доступных для учеников уровней
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
                                if (level.maxScore === level.maxScoreUser) { // Пройден
                                    return '../img/icons/done_icon.png';
                                } else if (level.maxScoreUser > 0) { // Начат
                                    return '../img/icons/pause_icon.png';
                                } else { // Не начат
                                    return '../img/icons/start_icon.png';
                                }
                            }
                        )() // () - вызов стрелочной ф-ции
                    }" alt="">  
                </div>
            </div>
            <div class="d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
                <span>${level.maxScoreUser ? `${level.maxScoreUser} из ${level.maxScore} (${Math.floor(100 / level.maxScoreUser * level.maxScore)}%)` : `0 из ${level.maxScore} (0%)`}</span>
            </div>`;
        }
    }
}