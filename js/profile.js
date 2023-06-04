const rating = document.getElementById("rating"); // объект для вывода рейтинга пользователя
const scores = document.getElementById("scores"); // объект для вывода очков пользователя
const levelsDone = document.getElementById("levels-done"); // объект для вывода количества пройденных уровней
const usernameInfo = document.getElementById("username-info"); // объект для вывода имени пользователя
const github = document.getElementById("github"); // поле для ввода сылки на гитхаб
const description = document.getElementById("description"); // поле для ввода информации о себе
const photoUser = document.getElementById("photo-user"); // объект для вывода аватара пользователя
const buttonSave = document.getElementById("button-save"); // кнопка сохранения изменений
const error = document.getElementById("error"); // объект для вывода ошибок

fetch(`http://localhost:3001/api/profile?idUser=${userInfo.id}`).then((res) => res.json())
.then(({infoUser, ratingUser}) => {
    
    if (userInfo.id !== infoUser.id) { // если пользователь не на своей странице, блочим изменение информации
        buttonSave.classList.add('d-none');
        description.disabled = true;
        github.disabled = true;
        // если отдельное приложение, блочить также имя пользователя и изменение аватара
    }

    rating.textContent = `Рейтинг - ${ratingUser.rating}/${ratingUser.count}`;
    scores.textContent = `Собрано очков - ${ratingUser.scores}`;
    levelsDone.textContent = `Пройдено уровней - ${ratingUser.done}/${ratingUser.levels}`;
    usernameInfo.textContent = infoUser.username;
    github.value = infoUser.github;
    description.value = infoUser.description;
    photoUser.src = infoUser.avatarPath;

}).catch((error) => {
    console.log(error);
});

buttonSave.addEventListener('click', (event) => {
    let linkGitHub = github.value.trim();
    let desc = description.value.trim();
    error.classList.remove('success');
    error.classList.add('error');
    if (linkGitHub.indexOf('https://github.com/') === 0 || linkGitHub.indexOf('github.com/') === 0 || linkGitHub.indexOf('http://github.com/') === 0 || linkGitHub === '') {
    
        if (linkGitHub.length > 100) {
            error.textContent = 'Ссылка на гитхаб должна содержать не более 100 символов..';
            return;
        }
        if (desc.length > 2000) {
            error.textContent = 'Описание должно содержать не более 2000 символов.';
            return;
        }
            
        fetch(`http://localhost:3001/api/profile`, { 
                method: 'PUT', 
                headers: {'Content-Type' : 'application/json'}, 
                body: JSON.stringify({
                    idUser: userInfo.id, 
                    description: desc,
                    link: linkGitHub
            })})
            .then((res) => res.json()).then((res) => {
            if (res) {
                error.classList.remove('error');
                error.classList.add('success');
                error.textContent = 'Данные успешно изменены.';
            }
        }).catch((error) => {

        });

    }
    else {
        error.textContent = 'Должна быть ссылка на гитхаб. Сторонние ресурсы запрещены.';
    }
})