const username = document.getElementById("username");
const rating = document.getElementById("rating");
const scores = document.getElementById("scores");
const levelsDone = document.getElementById("levels-done");
const usernameInfo = document.getElementById("username-info");
const github = document.getElementById("github");
const description = document.getElementById("description");

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
usernameInfo.textContent = userInfo.username;
github.value = userJSON.github;
description.value = userJSON.description;