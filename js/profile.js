const rating = document.getElementById("rating"); // объект для вывода рейтинга пользователя
const scores = document.getElementById("scores"); // объект для вывода очков пользователя
const levelsDone = document.getElementById("levels-done"); // объект для вывода количества пройденных уровней
const usernameInfo = document.getElementById("username-info"); // объект для вывода имени пользователя
const github = document.getElementById("github"); // поле для ввода сылки на гитхаб
const description = document.getElementById("description"); // поле для ввода информации о себе

// api запрос инфы о пользователе
let userJSON = { // объект  информации о пользователе
    "rating": 143, // место в рейтинге
    "usersLength": 894, // всего пользователей (для рейтинга)
    "scores": 5746, // собрано очков за все уровни (максимальных)
    "levelsDone": 324, // сколько уровеней пройдено
    "levelsLength": 5534, //сколько всего уровней
    "github": "github", // ссылка на гитхаб
    "description": "Я Тася!" // описание
}

rating.textContent = `Рейтинг - ${userJSON.rating}/${userJSON.usersLength}`;
scores.textContent = `Собрано очков - ${userJSON.scores}`;
levelsDone.textContent = `Пройдено уровней - ${userJSON.levelsDone}/${userJSON.levelsLength}`;
usernameInfo.textContent = userInfo.username;
github.value = userJSON.github;
description.value = userJSON.description;