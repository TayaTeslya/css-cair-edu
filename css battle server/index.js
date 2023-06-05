const mysql = require('mysql2');
const express = require('express'); // фреймворк для работы с сервером
const bodyParser = require('body-parser'); // библиотека для вытаскивания данных
const fileUpload = require('express-fileupload'); // библиотека для загрузки файлов на сервер
const cors = require('cors'); // библиотека для настройки работы с браузером
const fs = require('fs'); // для загрузки файлов на сервер
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

// GET

app.get('/api/user', (req, res) => { // req - запрос - то, что мы передаем при отправке запроса на сервер, res - результат, который сервер отправляет
    connection.query( // информация о авторизованном пользователе - для всех страниц
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

app.get('/api/levels', (req, res) => {  // index.html и statistics.html - все доступные пользователю уровни
    connection.query(
        `SELECT level.id, name, thumbnail, is_checked as isChecked, date_delete as dateDelete, level.max_score as maxScore, (select username from user where user.id = level.id_user) as author, (select favorite.id from favorite where favorite.id_level = level.id) as favorite, (select max_score from progress_level where progress_level.id_user = ${req.query.idUser} and progress_level.id_level = level.id) as maxScoreUser from level`, 
        (error, results, fields) => {
            if (req.query.isStatistic) {
                getRatingUser(req.query.idUser).then((statisticUser) => {
                    res.send({
                        results, 
                        statisticUser
                    });
                }).catch((error) => {
                    console.log(error);
                });
            } 
            else {
                res.send(results);
            }
        }
    );
});

app.get('/api/mylevels', (req, res) => { //mylevels.html
    connection.query(
        `select id, name, thumbnail, is_checked as isChecked, date_delete as dateDelete, reason from level where id_user = ${req.query.idUser}`, 
        (error, results, fields) => {
            res.send(results);
        }
    );
});

app.get('/api/level', (req, res) => { //level.html
    connection.query( // информация уровня
        `select max_score as maxScore, name, thumbnail, is_checked as isChecked, date_delete as dateDelete, reason, (select username from user where user.id = id_user) as author from level where id = ${req.query.idLevel}`, 
        (errorLevel, resultsLevel, fieldsLevel) => {
            getHexCodes(req.query.idLevel).then((resultsHexCodes) => {
                connection.query( // прогресс пользователя
                    `select score, max_score as maxScore, code_level as codeLevel from progress_level where id_level = ${req.query.idLevel} and id_user = ${req.query.idUser}`, 
                    (errorProgress, resultsProgress, fieldsProgress) => {
                        res.send({
                            level: resultsLevel[0],
                            hexCodes: resultsHexCodes.map((element) => element.hexCode),
                            progress: resultsProgress[0]
                        });
                    } 
                );
            });
        }
    );
});

app.get('/api/rating', (req, res) => { // rating.html
    connection.query(
        `select user.id, (select sum(max_score) from progress_level where id_user = user.id) as sumMaxScores, avatar_path as avatarPath, username from user where is_staff = 0 group by user.id order by sumMaxScores desc limit 100`,
        (error, results, fields) => {
            getRatingUser(req.query.idUser).then((ratingUser) => { // рейтинг пользователя и количество очков
                res.send({
                    ratingList: results, 
                    ratingUser
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    );
});

app.get('/api/profile', (req, res) => { // profile.html
    connection.query(
        `select id, link_github as github, description, username, avatar_path as avatarPath  from user where id=${req.query.idUser}`,
        (error, results, fields) => {
            getRatingUser(req.query.idUser).then((ratingUser) => { // рейтинг пользователя и количество очков
                res.send({
                    infoUser: results[0], 
                    ratingUser
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    );
});

app.get('/api/newlevel', (req, res) => { // newlevel.html - вывод информации об уровне при редактировании
    connection.query(
        `select name, code_level as codeLevel, id_user as idUser, max_score as maxScore from level where id = ${req.query.idLevel}`,
        (error, level, fields) => {
            getHexCodes(req.query.idLevel).then((hexCodes) => {
                res.send({
                    level: level[0],
                    hexCodes
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    );
});


// POST

app.post('/api/favorite', (req, res) => { // добавление в избранное
    connection.query(
        `insert into favorite (id_user, id_level) values (${req.body.idUser}, ${req.body.idLevel})`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.post('/api/level', (req, res) => { // level.html - первое прохождение уровня
    connection.query(
        `insert into progress_level (id_level, id_user, score, max_score, code_level) values (${req.body.idLevel}, ${req.body.idUser}, ${req.body.score}, ${req.body.score}, '${req.body.codeLevel}');`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.post('/api/newlevel', (req, res) => { // newlevel.html - создание уровня пользователем
    connection.query( // добавление уровня
        `insert into level (name, id_user, code_level, is_checked, max_score) values ('${req.body.name}', ${req.body.idUser}, '${req.body.codeLevel}', ${req.body.isChecked},
        ${req.body.maxScore})`, 
        (error, results, fields) => { // добавление hex-кодов
            let id = results.insertId;
            console.log(req.body.hexCodes);
            addHexCodes(id, req.body.hexCodes).then((hexDone) => {
                let thumbnail = `http://localhost:3001/levels/${id}.png`;
                connection.query( // добавление уровня
                    `update level set thumbnail = '${thumbnail}' where id = ${id}`, 
                    (error, results, fields) => { // добавление hex-кодов
                        console.log(req.files.file);
                        req.files.file.mv(`./img/levels/${id}.png`);
                        if (!error) res.send({id});
                        else res.send(false);
                    }
                );
            }).catch((error) => {
                console.log(error);
            })
        }
    );
});

// PUT

app.put('/api/profile', (req, res) => { // добавление в избранное
    connection.query(
        `update user set description = '${req.body.description}', link_github = '${req.body.link}' where id = ${req.body.idUser}`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.put('/api/level', (req, res) => { // level.html - перепрохождение уровня
    connection.query(
        `update progress_level set score = ${req.body.score}, max_score = ${req.body.maxScore}, code_level = '${req.body.codeLevel}' where id_user = ${req.body.idUser} and id_level = ${req.body.idLevel}`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.put('/api/editlevel', (req, res) => { // newlevel.html - редактирование уровня 
    connection.query( // добавление уровня
        `update level set reason = null, date_delete = null, name = '${req.body.name}', code_level = '${req.body.codeLevel}', is_checked = ${req.body.isChecked}, max_score = ${req.body.maxScore} where id = ${req.body.idLevel}`, 
        (error, results, fields) => { // добавление hex-кодов
            console.log(req.files.file);
            req.files.file.mv(`./img/levels/${req.body.idLevel}.png`);
            deleteHexCodes(req.body.idLevel).then((del) => {
                addHexCodes(req.body.idLevel, req.body.hexCodes).then((add) => {
                    if (!error) res.send({id: req.body.idLevel});
                    else res.send(false);
                });
            });
        }
    );
});

app.put('/api/deletelevel', (req, res) => { // newlevel.html - удаление уровня админом
    let today = new Date();
    connection.query( 
        `update level set reason = '${req.body.reason}', date_delete = '${today.getFullYear()}-${today.getMonth()}-${today.getDate()}' where id = ${req.body.idLevel}`, 
        (error, results, fields) => { 
            if (!error) res.send({id: req.body.idLevel});
            else res.send(false);
        }
    );
});

function deleteHexCodes(idLevel) {
    return new Promise((resolve, reject) => { // асинхронная ф-ция
        connection.query( // цвета уровня
        `delete from color where id_level = ${idLevel}`, 
            (error, results, fields) => {
                if (error) { // ошибка
                    reject(error);
                }
                else { // результат
                    resolve(results);
                }
            }
        );
    });
}

function addHexCodes(idLevel, hexCodes) {  // добавление цветов уровня
    return new Promise((resolve, reject) => { // асинхронная ф-ция
        let insert = 'insert into color (id_level, hex_code) values ';
        if (Array.isArray(hexCodes)) {
            for (const hexCode of hexCodes) {
                insert += `(${idLevel}, '${hexCode}'), `;
            }
            insert = insert.slice(0, insert.length - 2);
        }
        else {
            insert += `(${idLevel}, '${hexCodes}')`;
        }
        connection.query(
            insert,
            (error, results, fields) => {
                if (error) { // ошибка
                    reject(error);
                }
                else { // результат
                    resolve(results);
                }
            }
        );
    });
}

app.put('/api/editleveladmin', (req, res) => { // newlevel.html - редактирование уровня администратором
    let id = results.insertId;
    let thumbnail = `http://localhost:3001/levels/${id}.png`;
    connection.query( // добавление уровня
        `update level set thumbnail = '${thumbnail}' where id = ${id}`, 
        (error, results, fields) => { // добавление hex-кодов
            console.log(req.files.file);
            req.files.file.mv(`./img/levels/${id}.png`);
            if (!error) res.send({id});
            else res.send(false);
        }
    );
});

// DELETE

app.delete('/api/favorite', (req, res) => { // удаление из избранное
    connection.query(
        `delete from favorite where id_level = ${req.body.idLevel} and id_user = ${req.body.idUser}`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.delete('/api/deletelevels', (req, res) => { // автоматическое удаление уровней (при заходе на страницу mylevels.html)
    connection.query(
        `delete from level where date_delete <= CURRENT_DATE()`, 
        (error, results, fields) => {
            if (!error) res.send(true);
            else res.send(false);
        }
    );
});

app.delete('/api/mylevels', (req, res) => {  // удаление уровней по кнопке на странице mylevels.html
    deleteHexCodes(req.body.idLevel).then((del) => {
        connection.query(
            `delete from level where id = ${req.body.idLevel}`, 
            (error, results, fields) => {
                if (!error) res.send(true);
                else res.send(false);
                console.log(error);
            }
        );
     });
});

// FUNCTIONS


function getRatingUser(idUser) { // формирование строки рейтинга "Рейтинг - 124/3254" и "Очки - 5345"
    return new Promise((resolve, reject) => { // асинхронная ф-ция
        connection.query(
            `select user.id, (select sum(max_score) from progress_level where id_user = user.id) as sumScores, (select count(level.id) from level) as countLevels, (select count(progress_level.id) from progress_level, level where progress_level.id_user = user.id and progress_level.max_score = level.max_score and id_level = level.id) as countProgressLevels from user where is_staff = 0 group by user.id order by sumScores desc`,
            (error, results, fields) => {
                if (error) { // ошибка
                    reject(error);
                }
                else { // результат
                    resolve({
                        rating: results.indexOf(results.find((element) => element.id === Number(idUser))) + 1, 
                        count: results.length,
                        scores: results.find((element) => element.id === Number(idUser)).sumScores,
                        levels: results.find((element) => element.id === Number(idUser)).countLevels,
                        done: results.find((element) => element.id === Number(idUser)).countProgressLevels
                    });
                }
            }
        );
    });
}

function getHexCodes(idLevel) { // получение hex-кодов
    return new Promise((resolve, reject) => { // асинхронная ф-ция
        connection.query( // цвета уровня
        `select hex_code as hexCode from color where id_level = ${idLevel}`, 
            (error, results, fields) => {
                if (error) { // ошибка
                    reject(error);
                }
                else { // результат
                    resolve(results);
                }
            }
        );
    });
}

app.listen('3001', () => { // запуск сервера
    console.log('server started');
});


