const saveCodeToImg = document.getElementById('save-code-to-img'); // кнопка "Сохранить"
const resultScore = document.getElementById('result-score'); // Объект для вывода результата прохождения уровня
const maxScore = document.getElementById('max-score'); // Объект для вывода максимального результата прохождения уровня
const hexCodesContainer = document.getElementsByClassName('hex-codes-container'); // Объект для вывода необходимых для прохождения hex-кодов
const author = document.getElementsByClassName("card-author"); // Объект для вывода автора уровня
const nameLevel = document.getElementsByClassName("card-name-level"); // Объект для вывода номера и названия уровня
const defaultImg = document.getElementsByClassName("img-default"); // Объект для вывода картинки уровня

let level = {"id": 1, name: "Кружок", "thumbnail": "../img/levels/2.png", // Информация об уровне
            "codeLevel": "", "maxScoreUser": 433, "maxScore": 654, "score": 432, 
            "author": "Имя пользователя", "hexCodes": ["#aa759f", "#99648e"]}; 

if (level.codeLevel.trim()) { // если код пользователя не пустой
    editor.setValue(level.codeLevel);
}

for (let i = 0; i < 2; i++) { // Заполнение данных для больших и средних экранов
    defaultImg[i].src = level.thumbnail;
    author[i].textContent = 'Автор - ' + level.author;
    nameLevel[i].textContent = `~${level.id} - ${level.name}`;
}

resultScore.textContent = `${level.score} из ${level.maxScore} ( ${(Math.floor(100 / level.maxScore * level.score))} %)`; 
maxScore.textContent = `${level.maxScoreUser} из ${level.maxScore} ( ${(Math.floor(100 / level.maxScore * level.maxScoreUser))} %)`;

for (const hexCode of level.hexCodes) { // Отображение hex-кодов
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
    domtoimage.toPixelData(resultDom) // получение пикселей картинки из кода пользователя
    .then(function (imgDataUser) { 
        var canvas = document.createElement("canvas"); // создание канвы для отрисовки картинки уровня
        var ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 200;
        ctx.drawImage(document.getElementById('default-img'), 0, 0); // отрисовка картинки уровня
        let imgDataDefault = ctx.getImageData(0, 0, document.getElementById('default-img').width, document.getElementById('default-img').height); // получение пикселей картинки уровня
        let result = 0; // переменная количества совпавших пикселей 
        for (let i = 0; i < imgDataDefault.data.length; i += 4) { // цикл попиксельного сравнения картинок
            if (imgDataDefault.data[i] === imgDataUser[i]) {
                if (imgDataDefault.data[i + 1] === imgDataUser[i + 1]) { // R
                    if (imgDataDefault.data[i + 2] === imgDataUser[i + 2]) { // G
                        if (imgDataDefault.data[i + 3] === imgDataUser[i + 3]) { // B
                            result++;
                        }
                    }
                }
            }
        }
        result = (Math.floor(100 / (imgDataDefault.data.length / 4) * result)); // результат в очках
        resultScore.textContent = `${(Math.floor((711 / 100) * result))} из ${level.maxScore} ( ${result} %`; // вывод результата в очках и в процентах
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
});




