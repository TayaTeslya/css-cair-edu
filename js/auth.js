const login = document.getElementById('login'); // поле ввода логина
const password = document.getElementById('password'); // поле ввода пароля
const toggleVisivility = document.getElementById('toggle-visivility'); // смена видимости пароля в поле ввода пароля
const auth = document.getElementById('auth'); // кнопка входа в аккаунт
const error = document.getElementById('error');

localStorage.clear();

toggleVisivility.addEventListener('click', (event) => { // изменение видимости текста в поле ввода пароля
    if (toggleVisivility.children[0].src.includes('not_')) {
        toggleVisivility.children[0].src = '../img/icons/visibility.png';
        password.type = 'password';
    }
    else {
        toggleVisivility.children[0].src = '../img/icons/not_visibility.png';
        password.type = 'text';
    }
});

auth.addEventListener('click', (event) => {
    // let loginValue = login.value.trim();
    // // проверки валидности логина
    // if (loginValue.length === 0) {
    //     error.textContent = 'Введите логин';
    //     return;
    // }
    // if (loginValue.length < 5) {
    //     error.textContent = 'Логин должно содержать минимум 5 символов';
    //     return;
    // }
    // if (loginValue.length > 20) {
    //     error.textContent = 'Логин должно содержать максимум 20 символов';
    //     return;
    // }
    // if (/[А-Яа-я!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/g.test(loginValue)) { 
    //     error.textContent = 'Логин может содержать только латинские буквы, цифры и символ нижнего подчеркивания';
    //     return;
    // }
    // if (/[\s]/g.test(loginValue)) {
    //     error.textContent = 'Логин не должен содержать пробелы';
    //     return;
    // }
    // if (/^[\d_]/g.test(loginValue)) {
    //     error.textContent = 'Логин должен начинаться с буквы';
    //     return;
    // }
    // // проверки валидности пароля
    // let passwordValue = password.value;
    // if (passwordValue.length === 0) {
    //     error.textContent = 'Введите пароль';
    //     return;
    // }
    // if (passwordValue.length < 8) {
    //     error.textContent = 'Пароль должен содержать минимум 8 символов';
    //     return;
    // }
    // if (passwordValue.length > 30) {
    //     error.textContent = 'Пароль должен содержать максимум 30 символов';
    //     return;
    // }
    // if (/[&()+=\[\]{};':"\\|<>\/?]/g.test(passwordValue)) { 
    //     error.textContent = 'Пароль не может содержать символы "( ) { } ? + < > [ ] = ; " \' : & | / \\"';
    //     return;
    // }
    // if (!/[!@#$%^*_,.\-]/g.test(passwordValue)) {
    //     error.textContent = 'Пароль должен содержать хотя-бы один спец-символ "! @ # $ % ^ * - _ , ."';
    //     return;
    // }
    // if (passwordValue.includes('  ')) { 
    //     error.textContent = 'Пароль не должен содержать два пробела подряд';
    //     return;
    // }
    if (/[&()+=\[\]{};':"\\|<>\/?]/g.test(password.value)) { 
        return;
    }
    if (/[&()+=\[\]{};':"\\|<>\/?]/g.test(login.value)) { 
        return;
    }
    error.textContent = '';
    fetch(`http://localhost:3001/api/auth`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'}, 
        body: JSON.stringify({
            login: login.value,
            password: password.value
        })
    }).then((res) => res.json())
    .then((res) => { // деструктуризация по названию в объекте, возвращаемом сервером
        if (res) {
            localStorage.setItem("user", JSON.stringify({ // сохранение в локальное хранилище браузера
                id: res.id, 
                username: res.username,               // Имя пользователя
                avatarPath: res.avatarPath,           // URL путь до аватара на сервере
                isStaff: res.isStaff                  // уровень доступа пользователя (false - ученик, ture - администратор)
            }));
            location = '../index.html';
        }
        else {
            error.textContent = 'Неправильный логин и/или пароль';
        }
    }).catch((error) => {
        console.log(error);
    });
});





