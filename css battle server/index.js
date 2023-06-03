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
        `SELECT level.id, name, thumbnail, is_checked as isChecked, level.max_score as maxScore, (select username from user where user.id = level.id_user) as author, (select favorite.id from favorite where favorite.id_level = level.id) as favorite, (select max_score from progress_level where progress_level.id_user = ${req.query.idUser} and progress_level.id_level = level.id) as maxScoreUser from level`, 
        (error, results, fields) => {
            res.send(results);
        }
    );
});

app.get('/api/mylevels', (req, res) => { 
    connection.query(
        `select id, name, thumbnail, is_checked as isChecked, date_delete as dateDelete, reason from level where id_user = ${req.query.idUser}`, 
        (error, results, fields) => {
            res.send(results);
        }
    );
});

app.get('/api/rating', (req, res) => { 
    connection.query(
        `select user.id, (select sum(max_score) from progress_level where id_user = user.id) as sumMaxScores, avatar_path as avatarPath, username from user where is_staff = 0 group by user.id order by sumMaxScores desc limit 100`,
        (error, results, fields) => {
            getRatingUser(req.query.idUser).then((ratingUser) => {
                res.send({ratingList: results, 
                    ratingUser});
            }).catch((error) => {
                console.log(error);
            });
        }
    );
});

function getRatingUser(idUser) { // формирование строки рейтинга "Рейтинг - 124/3254"
    let response = new Promise((resolve, reject) => { // асинхронная ф-ция
        connection.query(
            `select user.id, (select sum(max_score) from progress_level where id_user = user.id) as sumScores from user where is_staff = 0 group by user.id order by sumScores desc`,
            (error, results, fields) => {
                if (error) { // ошибка
                    reject(error);
                }
                else { // результат
                    resolve({
                        rating: results.indexOf(results.find((element) => element.id === Number(idUser))) + 1, 
                        count: results.length,
                        scores: results.find((element) => element.id === Number(idUser)).sumScores
                    });
                }
            }
        );
    });
    return response;
}


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
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.delete('/api/deletelevels', (req, res) => {
    connection.query(
        `delete from level where date_delete <= CURRENT_DATE()`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.delete('/api/mylevels', (req, res) => { 
    connection.query(
        `delete from level where id = ${req.body.idLevel}`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
            console.log(error);
        }
    );
});

app.listen('3001', () => {
    console.log('server started');
});


