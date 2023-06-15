/*
Данный файл является скриптом страницы статистики пользователя
Переменные:
    usernameInfo - объект поля ввода имени пользователя
    github - объект поля ввода сылки на гитхаб
    description - объект поля ввода информации о себе
    photoUser - объект для вывода аватара пользователя
    buttonSave - объект кнопки сохранения изменений
    error - объект для вывода ошибок
    login - объект поля ввода логина
    password - объект поля ввода пароля
    confirmPassword - объект поля повторного ввода пароля
    toggleVisibility - объект кнопки для смены видимости пароля в поле ввода пароля
    confirmToggleVisibility - объект кнопки для смены видимости пароля в поле ввода повторного пароля
    imgPicker - объект для выбора аватарки
    pickerOpener - объект для вызова выбора аватара
    avatarImages - объект вывода аватарки
    avatarPath - путь до аватарки
Функции:
    setToggleVisibility - функция смены видимости текста в поле ввода пароля и в поле повторного ввода пароля
        Принимает в себя:
            event - объект, хранящий в себе информацию о событии
            field - объект поля ввода
    buttonSave.addEventListener - событие клика по кнопке сохранения; проверка валидации, сохранение или вывод ошибки
*/

const usernameInfo = document.getElementById("username-info"); // объект для вывода имени пользователя
const github = document.getElementById("github"); // поле для ввода сылки на гитхаб
const description = document.getElementById("description"); // поле для ввода информации о себе
const photoUser = document.getElementById("photo-user"); // объект для вывода аватара пользователя
const buttonSave = document.getElementById("button-save"); // кнопка сохранения изменений
const error = document.getElementById("error"); // объект для вывода ошибок
const login = document.getElementById('login'); // поле ввода логина
const password = document.getElementById('password'); // поле ввода пароля
const confirmPassword = document.getElementById('confirm-password'); // поле повторного ввода пароля
const toggleVisibility = document.getElementById('toggle-visibility'); // смена видимости пароля в поле ввода пароля
const confirmToggleVisibility = document.getElementById('confirm-toggle-visibility'); // смена видимости пароля в поле ввода повторного пароля
const imgPicker = document.getElementById('img-picker'); // выбор аватарки
const pickerOpener = document.getElementById('picker-opener'); // объект для вызова выбора аватара
const avatarImages = document.getElementsByClassName('avatar-image'); // объект выбора аватара

let avatarPath; // выбранный аватар

toggleVisibility.addEventListener('click', (event) => setToggleVisibility(event, password));
confirmToggleVisibility.addEventListener('click', (event) => setToggleVisibility(event, confirmPassword));

function setToggleVisibility(event, field) {
    if (event.target.children[0].src.includes('not_')) {
        event.target.children[0].src = '../img/icons/visibility.png';
        field.type = 'password';
    }
    else {
        event.target.children[0].src = '../img/icons/not_visibility.png';
        field.type = 'text';
    }
}

for (let i = 1; i <= 5; i++) {
    imgPicker.innerHTML += `
    <div data-id="${i}" class="avatar-image avatar d-flex justify-content-center">
        <img class="" src="http://localhost:3001/avatars/${i}.png" alt="">
    </div>`;
}


for (const avatarImage of avatarImages) {
    avatarImage.addEventListener('click', () => {
        avatarPath = `http://localhost:3001/avatars/${avatarImage.dataset.id}.png`;
        photoUser.src = avatarPath;
    })
}

pickerOpener.addEventListener('click', (event) => {
    imgPicker.classList.toggle('d-none');
});

fetch(`http://localhost:3001/api/account?idUser=${userInfo.id}`).then((res) => res.json())
.then((infoUser) => {
    
    usernameInfo.value = infoUser.username;
    github.value = infoUser.github;
    description.value = infoUser.description;
    photoUser.src = infoUser.avatarPath;
    login.value = infoUser.login;

}).catch((error) => {
    console.log(error);
});

buttonSave.addEventListener('click', (event) => {
    let linkGitHub = github.value.trim();
    let desc = description.value.trim();
    // проверка валидности имени пользователя
    let usernameValue = usernameInfo.value.trim();
    if (/[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/g.test(usernameValue)) { 
        error.textContent = 'Имя может содержать только буквы, цифры, символ нижнего подчеркивания и пробел';
        return;
    }
    if (usernameValue.length === 0) {
        error.textContent = 'Введите имя пользователя';
        return;
    }
    if (usernameValue.length < 5) {
        error.textContent = 'Имя пользователя должно содержать минимум 5 символов';
        return;
    }
    if (usernameValue.length > 50) {
        error.textContent = 'Имя пользователя должно содержать максимум 50 символов';
        return;
    }
    if (usernameValue.includes('  ')) { 
        error.textContent = 'Имя пользователя не должно содержать два пробела подряд';
        return;
    }
    let loginValue = login.value.trim();
    // проверки валидности логина
    if (loginValue.length === 0) {
        error.textContent = 'Введите логин';
        return;
    }
    if (loginValue.length < 5) {
        error.textContent = 'Логин должно содержать минимум 5 символов';
        return;
    }
    if (loginValue.length > 20) {
        error.textContent = 'Логин должно содержать максимум 20 символов';
        return;
    }
    if (/[А-Яа-я!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/g.test(loginValue)) { 
        error.textContent = 'Логин может содержать только латинские буквы, цифры и символ нижнего подчеркивания';
        return;
    }
    if (/[\s]/g.test(loginValue)) {
        error.textContent = 'Логин не должен содержать пробелы';
        return;
    }
    if (/^[\d_]/g.test(loginValue)) {
        error.textContent = 'Логин должен начинаться с буквы';
        return;
    }
    // проверки валидности пароля
    let passwordValue = password.value;
    if (passwordValue.length > 0) {
        if (passwordValue.length < 8) {
            error.textContent = 'Пароль должен содержать минимум 8 символов';
            return;
        }
        if (passwordValue.length > 30) {
            error.textContent = 'Пароль должен содержать максимум 30 символов';
            return;
        }
        if (/[&()+=\[\]{};':"\\|<>\/?]/g.test(passwordValue)) { 
            error.textContent = 'Пароль не может содержать символы "( ) { } ? + < > [ ] = ; " \' : & | / \\"';
            return;
        }
        if (!/[!@#$%^*_,.\-]/g.test(passwordValue)) {
            error.textContent = 'Пароль должен содержать хотя-бы один спец-символ "! @ # $ % ^ * - _ , ."';
            return;
        }
        if (passwordValue.includes('  ')) { 
            error.textContent = 'Пароль не должен содержать два пробела подряд';
            return;
        }
        if (passwordValue !== confirmPassword.value) {
            error.textContent = 'Пароли не совпадают';
            return;
        }
    }
    error.textContent = '';
    if (!(linkGitHub.indexOf('https://github.com/') === 0 || linkGitHub.indexOf('github.com/') === 0 || linkGitHub.indexOf('http://github.com/') === 0 || linkGitHub === '')) {
        error.textContent = 'Должна быть ссылка на гитхаб. Сторонние ресурсы запрещены.';
        return;
    }

    if (linkGitHub.length > 100) {
        error.textContent = 'Ссылка на гитхаб должна содержать не более 100 символов..';
        return;
    }
    if (desc.length > 2000) {
        error.textContent = 'Описание должно содержать не более 2000 символов.';
        return;
    }
        
    fetch(`http://localhost:3001/api/account`, { 
            method: 'PUT', 
            headers: {'Content-Type' : 'application/json'}, 
            body: JSON.stringify({
                idUser: userInfo.id, 
                description: desc || '',
                github: linkGitHub || '',
                login: loginValue,
                password: passwordValue,
                username: usernameValue,
                avatarPath: avatarPath || userInfo.avatarPath
        })})
        .then((res) => res.json()).then((res) => {
        if (res) {
            localStorage.setItem("user", JSON.stringify({                                                         // сохранение в локальное хранилище браузера
                ...userInfo,                                                                                      // оставляем прошлые данные, перезаписываем имя и путь аватара
                username: usernameValue,                                                                          // Имя пользователя
                avatarPath: avatarPath || userInfo.avatarPath  // URL путь до аватара на сервере
            }));
            location.reload();
        }
    }).catch((error) => {
        error.textContent = 'Произошла ошибка.';
    });
    
})