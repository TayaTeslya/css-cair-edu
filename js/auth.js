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
    if (/[&()+=\[\]{};':"\\|<>\/?]/g.test(password.value)) { 
        error.textContent = 'Неправильный логин и/или пароль';
        return;
    }
    if (/[&()+=\[\]{};':"\\|<>\/?]/g.test(login.value)) { 
        error.textContent = 'Неправильный логин и/или пароль';
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





