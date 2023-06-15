/*
Данный файл является скриптом страницы профиля пользователя
Переменные:
    rating - объект для вывода рейтинга пользователя
    scores - объект для вывода очков пользователя
    levelsDone - объект для вывода количества пройденных уровней
    usernameInfo - объект для вывода имени пользователя
    github - объект поля ввода сылки на гитхаб
    description - объект поля ввода описания пользователя
    photoUser - объект для вывода аватара пользователя
    idUserProfile - id уровня из пути в поисковой строкея
*/

const rating = document.getElementById("rating"); // объект для вывода рейтинга пользователя
const scores = document.getElementById("scores"); // объект для вывода очков пользователя
const levelsDone = document.getElementById("levels-done"); // объект для вывода количества пройденных уровней
const usernameInfo = document.getElementById("username-info"); // объект для вывода имени пользователя
const github = document.getElementById("github"); // поле для ввода сылки на гитхаб
const description = document.getElementById("description"); // поле для ввода информации о себе
const photoUser = document.getElementById("photo-user"); // объект для вывода аватара пользователя
const idUserProfile = location.hash.replace('#', ''); // id уровня из пути в поисковой строке

fetch(`http://localhost:3001/api/profile?idUser=${idUserProfile}`).then((res) => res.json())
.then(({infoUser, ratingUser}) => {
    
    rating.textContent = `Рейтинг - ${ratingUser.rating}/${ratingUser.count}`;
    scores.textContent = `Собрано очков - ${ratingUser.scores || 0}`;
    levelsDone.textContent = `Пройдено уровней - ${ratingUser.done}/${ratingUser.levels}`;
    usernameInfo.textContent = infoUser.username;
    github.value = infoUser.github;
    description.value = infoUser.description;
    photoUser.src = infoUser.avatarPath;

}).catch((error) => {
    console.log(error);
});