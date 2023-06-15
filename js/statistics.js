/*
Данный файл является скриптом страницы статистики пользователя
Переменные:
    rating - объект для вывода рейтинга пользователя
    scores - объект для вывода очков пользователя
    levelsDone - объект для вывода количества пройденных уровней
    levels - массив объектов уровней
    currentLevels - массив объектов отфильтрованных и/или соответствующих поиску уровней
Функции:
    setLevels - функция вывода уровней
        Принимает в себя:
            condition - фильтр и/или строка поиска
*/

const rating = document.getElementById("rating"); // объект для вывода рейтинга
const scores = document.getElementById("scores"); // объект для вывода очков
const levelsDone = document.getElementById("levels-done"); // объект для вывода количества пройденных уровней
const levelsStatistic = document.getElementById("levels-statistic"); // объект для вывода статистики по уровням

let levels;
let currentLevels;

fetch(`http://localhost:3001/api/levels?idUser=${userInfo.id}&isStatistic=true`).then((res) => res.json())
.then(({results, statisticUser}) => {

    levels = results;
    currentLevels = results; 

    rating.textContent = `Рейтинг - ${statisticUser.rating}/${statisticUser.count}`;
    scores.textContent = `Собрано очков - ${statisticUser.scores || 0}`;
    levelsDone.textContent = `Пройдено уровней - ${statisticUser.done}/${statisticUser.levels}`;

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
    for (const level of currentLevels.filter(condition)) { // цикл, проходящий по отфильтрованным по категориям уровням
        if (!userInfo.isStaff && level.isChecked && !level.dateDelete) { // вывод доступных для учеников уровней
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
                                {
                                    if (level.maxScore === level.maxScoreUser) { // Пройден
                                        return '../img/icons/done_icon.png';
                                    } else if (level.maxScoreUser === null) { // Не начат
                                        return '../img/icons/start_icon.png';
                                    } else { // Начат
                                        return '../img/icons/pause_icon.png';
                                    }
                                }
                            }
                        )() // () - вызов стрелочной ф-ции
                    }" alt="">  
                </div>
            </div>
            <div class="d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
                <span>${level.maxScoreUser ? `${level.maxScoreUser} из ${level.maxScore} (${Math.floor(100 / level.maxScore * level.maxScoreUser)}%)` : `0 из ${level.maxScore} (0%)`}</span>
            </div>`;
        }
    }
}