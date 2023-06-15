/* 
Название: CSS CAIR EDU
Разработала: Тесля Т.Е.
Группа: ТИП-81
Дата и номер версии: 07.06.2023 v1.3
Язык: JavaScript
Краткое описание: игровой интерактивный модуль изучения HTML и CSS

Задание:
1) Реализовать вывод всех уровней с возможностью фильтрации и поиска
2) Создать редактор кода с подстветкой синтаксиса
3) Реализовать мгновенное отображение результатов пользовательского кода
4) Обеспечить сохранение данных
5) Реализовать форму прохождения уровней
6) Реализовать форму создания и редактирования уровней
7) Реализовать формы статистики и рейтинга пользователей
8) Реализовать авторизацию и регистрацию
9) Реализовать возможность изменения данных аккаунта
10) Реализовать возможность изменения аватара пользователя

Использованные формы:
1) index.html - главная страница с выводом уровней
2) reg.html - форма регистрации
3) auth.html - форма авторизации
4) level.html - страница прохождения уровней
5) newlevel.html - страница создания и редактирования уровней
6) mylevels.html - страница с выводом уровней пользователя
7) profile.html - страница с выводом профиля пользователей
8) statistic.html - страница с выводом статистики пользователя
9) rating.html - страница с формированием рейтинга пользователей
10) account.html - страница с редактированием данных аккаунта пользователя

Данный файл является скриптом формы авторизации
Переменные:
    login - объект поля ввода логина
    password - объект поля ввода пароля
    toggleVisibility - объект кнопки изменения видимости пароля
    auth - объект кнопки входа в аккаунт
    error - объект для вывода ошибок
Функции:
    toggleVisivility.addEventListener - событие клика по кнопке видимости; изменяет видимость текста в поле ввода пароля
    auth.addEventListener - событие клика по кнопке "Войти"; поиск аккаунта в базе данных, открытие главной страницы или вывод ошибки
*/

const login = document.getElementById('login'); // поле ввода логина
const password = document.getElementById('password'); // поле ввода пароля
const toggleVisivility = document.getElementById('toggle-visivility'); // смена видимости пароля в поле ввода пароля
const auth = document.getElementById('auth'); // кнопка входа в аккаунт
const error = document.getElementById('error'); // объект для вывода ошибок

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





