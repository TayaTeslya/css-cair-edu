const mysql = require('mysql2');
const express = require('express'); // фреймворк для работы с сервером
const bodyParser = require('body-parser'); // библиотека для вытаскивания данных
const fileUpload = require('express-fileupload'); // библиотека для загрузки файлов на сервер
const cors = require('cors'); // библиотека для настройки работы с браузером
// import { createServer } from "http"; // создание сервера, работающего с помощью http

const app = express(); // создание объекта сервера

// настрока парсера сервера для запросов
app.use(bodyParser.urlencoded({ extended: true })); // декодирование из url
app.use(bodyParser.json()); // парсит json
app.use(cors()); 
app.use(fileUpload()); // загрузка файлов
app.use(express.static('img')); // публичный доступ к файлам в папке img
app.use(express.json()); // парсит json

const connection = mysql.createConnection({ // подключение к БД
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'css_cair_edu'
});

app.all('*', function(req, res, next) {  // настройки Core для запросов
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Credentials', 'true'); 
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS'); // методы
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next(); // промежуточная проверка
});

app.get('/api/user', (req, res) => { // req - запрос - то, что мы передаем при отправке запроса на сервер, res - результат, который сервер отправляет
    connection.query(
        `select * from user where id = ${req.query.idUser}`, (error, results, fields) => {
            res.send({
                id: results[0].id,
                username: results[0].username,
                avatarPath: results[0].avatar_path,
                isStaff: results[0].is_staff,
            });
        }
    );
});

app.get('/api/levels', (req, res) => { // req - запрос - то, что мы передаем при отправке запроса на сервер, res - результат, который сервер отправляет
    connection.query(
        `SELECT level.id, name, thumbnail, is_published as isPublished, level.max_score as maxScore, (select username from user where user.id = level.id_user) as author, (select favorite.id from favorite where favorite.id_level = level.id) as favorite, (select max_score from progress_level where progress_level.id_user = ${req.query.idUser} and progress_level.id_level = level.id) as maxScoreUser from level`, 
        (error, results, fields) => {
            res.send(results);
        }
    );
});

app.post('/api/favorite', (req, res) => {
    connection.query(
        `insert into favorite (id_user, id_level) values (${req.body.idUser}, ${req.body.idLevel})`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.delete('/api/favorite', (req, res) => {
    connection.query(
        `delete from favorite where id_level = ${req.body.idLevel} and id_user = ${req.body.idUser}`, 
        (error, results, fields) => {
            console.log(error);
            console.log(req.body);
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.listen('3001', () => {
    console.log('server started');
});


