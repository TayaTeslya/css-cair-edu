/*
Данный файл является скриптом главной страницы
Переменные:
    saveCodeToImg - объект кнопки сохранения прогресса прохождения уровня
    resultScore - объект для вывода результатов прохождения уровня
    maxScore - обхект для вывода максимального результата прохождения уровня
    hexCodesContainer - объект для вывода необходимых для прохождения hex-кодов
    author - объект для вывода автора уровня
    nameLevel - объект для вывода номера и названия уровня
    defaultImg - объект для вывода картинки уровня
    idLevel - id уровня из пути в поисковой строке
    reTryLevel - объект кнопки сброса прогресса уровня
Функции:
    saveCodeToImg.addEventListener - событие клика по кнопке "Сохранить"; проверка валидности введенного кода, сохранение и вывод результатов или вывод ошибки
    reTryLevel.addEventListener - событие клика по кнопке "Перепройти"; сброс прогресса уровня
*/

const saveCodeToImg = document.getElementById('save-code-to-img'); // кнопка "Сохранить"
const resultScore = document.getElementById('result-score'); // объект для вывода результата прохождения уровня
const maxScore = document.getElementById('max-score'); // объект для вывода максимального результата прохождения уровня
const hexCodesContainer = document.getElementsByClassName('hex-codes-container'); // объект для вывода необходимых для прохождения hex-кодов
const author = document.getElementsByClassName("card-author"); // объект для вывода автора уровня
const nameLevel = document.getElementsByClassName("card-name-level"); // объект для вывода номера и названия уровня
const defaultImg = document.getElementsByClassName("img-default"); // объект для вывода картинки уровня
const idLevel = location.hash.replace('#', ''); // id уровня из пути в поисковой строке
const reTryLevel = document.getElementById('re-try-level'); // объект кнопки сброса прогресса уровня

fetch(`http://localhost:3001/api/level?idUser=${userInfo.id}&idLevel=${idLevel}`).then((res) => res.json())
.then(({level, hexCodes, progress}) => {

    if (progress?.codeLevel.trim()) { // если код пользователя не пустой
        editor.setValue(progress.codeLevel);
    }

    for (let i = 0; i < 2; i++) { // Заполнение данных для больших и средних экранов
        defaultImg[i].src = level.thumbnail;
        if (level.author) {
            author[i].textContent = 'Автор - ' + level.author;
            nameLevel[i].textContent = `~${idLevel} - ${level.name}`;
        } 
        else {
            author[i].classList.add('d-none');
            nameLevel[i].textContent = `#${idLevel} - ${level.name}`;
        }
    }

    if (progress) {
        reTryLevel.classList.remove('d-none');
        resultScore.textContent = `${progress.score} из ${level.maxScore} (${(Math.floor(100 / level.maxScore * progress.score))}%)`; 
        maxScore.textContent = `${progress.maxScore} из ${level.maxScore} (${(Math.floor(100 / level.maxScore * progress.maxScore))}%)`;
    }
    else {
        resultScore.textContent = `0 из ${level.maxScore} (0%)`; 
        maxScore.textContent = `0 из ${level.maxScore} (0%)`;
    }

    for (const hexCode of hexCodes) { // Отображение hex-кодов
        hexCodesContainer[0].innerHTML += `
        <div class="hex d-flex align-items-center">
            <p class="circle-color" style="background-color:` + hexCode + `;"></p>
            <p class="text-color" style="color: ` + hexCode + `">` + hexCode + `</p>
        </div>`;
        hexCodesContainer[1].innerHTML += `
        <div class="hex d-flex align-items-center">
            <p class="circle-color" style="background-color:` + hexCode + `;"></p>
            <p class="text-color" style="color: ` + hexCode + `">` + hexCode + `</p>
        </div>`;
    }

    saveCodeToImg.addEventListener('click', () => { // событие клика по кнопке "Сохранить"
        if (!isValid) return;
        domtoimage.toPixelData(resultDom) // получение пикселей картинки из кода пользователя
        .then(function (imgDataUser) { 
            let canvas = document.createElement("canvas"); // создание канвы для отрисовки картинки уровня
            let ctx = canvas.getContext('2d');
            canvas.width = 300;
            canvas.height = 200;
            let imgDefault = new Image();
            imgDefault.src = level.thumbnail;
            imgDefault.setAttribute('crossOrigin', '');
            
            imgDefault.onload = function() { // после загрузки дефолтной картинки
                ctx.drawImage(imgDefault, 0, 0); // отрисовка картинки уровня в канвасе
                let imgDataDefault = ctx.getImageData(0, 0, document.getElementById('default-img').width, document.getElementById('default-img').height); // получение пикселей картинки уровня
                imgDataDefault = imgDataDefault.data;
                let result = 0; // переменная количества совпавших пикселей 
                for (let i = 0; i < imgDataDefault.length; i += 4) { // цикл попиксельного сравнения картинок
                    if (imgDataDefault[i] === imgDataUser[i]) {
                        if (imgDataDefault[i + 1] === imgDataUser[i + 1]) { // R
                            if (imgDataDefault[i + 2] === imgDataUser[i + 2]) { // G
                                if (imgDataDefault[i + 3] === imgDataUser[i + 3]) { // B
                                    result++;
                                }
                            }
                        }
                    }
                }
                result = (Math.floor(100 / (imgDataDefault.length / 4) * result)); // процент совпадения
                result = (Math.floor(level.maxScore * result / 100)); // количество очков
                if (progress) { // если пользователь ранее уже проходил уровень
                    fetch(`http://localhost:3001/api/level`, { 
                        method: 'PUT', 
                        headers: {'Content-Type' : 'application/json'}, 
                        body: JSON.stringify({
                            idLevel,
                            idUser: userInfo.id,
                            score: result,
                            maxScore: result > progress.maxScore ? result : progress.maxScore,
                            codeLevel: editor.getValue().trim()
                    })})
                    .then((res) => res.json()).then((res) => {
                    if (res) {
                        location.reload();
                    }
                }).catch((error) => {
                    console.log(error);
                });
                }
                else { // если пользователь на уровне впервые
    
                    if (!editor.getValue().trim()) return; // если код пустой
                    if (editor.getValue() === defaultCode) return; // если код равен изначальному коду
    
                    fetch(`http://localhost:3001/api/level`, { 
                            method: 'POST', 
                            headers: {'Content-Type' : 'application/json'}, 
                            body: JSON.stringify({
                                idLevel,
                                idUser: userInfo.id,
                                score: result,
                                codeLevel: editor.getValue().trim()
                        })})
                        .then((res) => res.json()).then((res) => {
                        if (res) {
                            location.reload();
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
            
            
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    });

}).catch((error) => {
    console.log(error);
});

reTryLevel.addEventListener('click', (event) => {
    fetch('http://localhost:3001/api/retrylevel', { 
        method: 'PUT', 
        headers: {'Content-Type' : 'application/json'}, 
        body: JSON.stringify({
            idLevel,
            idUser: userInfo.id
    })})
    .then((res) => {
        location.reload();
    }).catch((error) => {
        console.log(error);
    });
});


