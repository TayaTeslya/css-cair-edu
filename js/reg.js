/*
Данный файл является скриптом формы регистрации
Переменные:
    login - объект поля ввода логина
    password - объект поля ввода пароля
    confirmPassword - объект поля повторного ввода пароля
    toggleVisibility - объект кнопки смены видимости текста в поле ввода пароля 
    confirmToggleVisibility - объект кнопки смены видимости текста в поле повторного ввода пароля
    reg - объект кнопки создания аккаунта
    error - объект для вывода ошибок
    username - объект для поля ввода имени пользователя
Функции:
    toggleVisibility.addEventListener - событие клика на кнопку смены видимости пароля в поле ввода пароля, вызывает функцию setToggleVisibility
    confirmToggleVisibility.addEventListener - событие клика на кнопку смены видимости пароля в поле ввода повторного пароля, вызывает функцию setToggleVisibility
    setToggleVisibility - функция смены видимости текста в поле ввода пароля и в поле повторного ввода пароля
        Принимает в себя:
            event - объект, хранящий в себе информацию о событии
            field - объект поля ввода
    reg.addEventListener - событие клика на кнопку "Создать аккаунт"; проверка валидности, создание аккаунта и открытие формы авторизации или вывод ошибки
*/

const login = document.getElementById('login'); // поле ввода логина
const password = document.getElementById('password'); // поле ввода пароля
const confirmPassword = document.getElementById('confirm-password'); // поле повторного ввода пароля
const toggleVisibility = document.getElementById('toggle-visibility'); // смена видимости пароля в поле ввода пароля
const confirmToggleVisibility = document.getElementById('confirm-toggle-visibility'); // смена видимости пароля в поле ввода повторного пароля
const reg = document.getElementById('reg'); // кнопка создания аккаунта
const error = document.getElementById('error'); // объект для вывода ошибок
const username = document.getElementById('username'); // объект для ввода имени пользователя

localStorage.clear();

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

reg.addEventListener('click', (event) => {
     // проверка валидности имени пользователя
     let usernameValue = username.value.trim();
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
    if (passwordValue.length === 0) {
        error.textContent = 'Введите пароль';
        return;
    }
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
    error.textContent = '';
    fetch(`http://localhost:3001/api/reg`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'}, 
        body: JSON.stringify({
            username: usernameValue,
            login: loginValue,
            password: passwordValue
        })
    }).then((res) => res.json())
    .then((res) => { // деструктуризация по названию в объекте, возвращаемом сервером
        if (res) {
            location = '../pages/auth.html';
        }
        else {
            error.textContent = 'Пожалуйста, выберите другой логин';
        }
    }).catch((error) => {
        console.log(error);
    });
});





