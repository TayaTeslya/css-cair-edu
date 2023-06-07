const deleteButton = document.getElementById("delete-button"); // кнопка удаления уровня
const saveCodeToImg = document.getElementById('save-code-to-img'); // кнопка "Сохранить"
const nameLevel = document.getElementById('name-level'); // поле ввода названия уровня
const hexCodesContainer = document.getElementById("hex-codes"); // объект для вывода hex-кодов
const idLevel = location.hash.replace('#', ''); // id уровня из пути в поисковой строке
const scores = document.getElementById("scores"); // кол-во очков
const reason = document.getElementById("reason"); // причина удаления

let hexCodes = []; // массив для хранения всех hex-кодов
let idUser;

if (userInfo.isStaff) { // кнопка "Отклонить" для администратора
    if (idLevel) {
        deleteButton.classList.remove('d-none');
        reason.classList.remove('d-none');
    }
    scores.classList.remove('d-none');
    // вывод уровня редактирования администатором
}

if (idLevel) {
    fetch(`http://localhost:3001/api/newlevel?idLevel=${idLevel}`).then((res) => res.json())
    .then(({level, hexCodes}) => {
        idUser = level.idUser;
        if ((idUser !== userInfo.id || level.isChecked) && !userInfo.isStaff) {
            location = `../index.html`;
            return;
        }
        hexCodesContainer.innerHTML = '';
        for (const code of hexCodes) { // Отображение hex-кодов
            hexCodesContainer.innerHTML += `
            <div class="hex d-flex align-items-center">
                <p class="circle-color" style="background-color:` + code.hexCode + `;"></p>
                <p class="text-color" style="color: ` + code.hexCode + `">` + code.hexCode + `</p>
            </div>`;
        };
        nameLevel.value = level.name;
        editor.setValue(level.codeLevel);
        scores.value = level.maxScore;
    }).catch((error) => {
        console.log(error);
    });
}

saveCodeToImg.addEventListener('click', () => { // событие клика на кнопку сохранения

    if (userInfo.isStaff) {
        if (!scores.value.trim()) {
            error.classList.add('error');
            error.classList.remove('success');
            error.textContent = 'Введите количество очков';
            return;
        }
        if (!/^[0-9]+$/.test(scores.value.trim())) {
            error.classList.add('error');
            error.classList.remove('success');
            error.textContent = 'Количество очков должно быть целым числом';
            return;
        }
        if (scores.value.trim().length > 5) {
            error.classList.add('error');
            error.classList.remove('success');
            error.textContent = 'Количество очков не должно превышать 5 символов';
            return;
        }
        if (Number(scores.value.trim()) < 10) {
            error.classList.add('error');
            error.classList.remove('success');
            error.textContent = 'Количество очков должно быть не менее 10';
            return;
        }
    }

    if (nameLevel.value.trim().length === 0) {
        error.classList.add('error');
        error.classList.remove('success');
        error.textContent = 'Введите название уровня';
        return;
    }
    if (nameLevel.value.trim().length < 3) { // проверка на длину названия
        error.classList.add('error');
        error.classList.remove('success');
        error.textContent = 'Название должно содержать минимум 3 символа';
        return;
    }
    if (nameLevel.value.trim().length > 50) { // проверка на длину названия
        error.classList.add('error');
        error.classList.remove('success');
        error.textContent = 'Название должно содержать максимум 50 символов';
        return;
    }
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(nameLevel.value)) { // в названии можно использовать только буквы и цифры
        error.classList.add('error');
        error.classList.remove('success');
        error.textContent = 'Название должно содержать только буквы и цифры';
        return;
    }

    // проверка введения количества очков для админа !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            
    let resCode = editor.getValue().split('\n'); // массив строк када пользователя
    let property; // переменная значения свойства
    let hexCode; // переменная для преобразования цвета в hex-code

    for (const str of resCode) { // сохранение массива hex-кодов
        if (str.includes('color')) {
            property = str.split(':')[1]; // сохранение значения свойства
            if (property) {
                property = property.replaceAll(' ', '');
                property = property.slice(0, property.length - 1); // убираем ";" из свойства
                hexCode = getHexCode(property); // получаем hex-code цвета
                if (hexCode) hexCodes.push(hexCode); // если пустой, значит лежал не цвет
            }
        }
        else if (str.includes('border') || str.includes('background')) {
            property = str.split(':')[1].trim(); // сохранение значения свойства
            property = property.slice(0, property.length - 1); // убираем точку с запятой
            if (property.includes('#')) {
                property = property.slice(property.indexOf('#'), property.indexOf('#') + 7);
                hexCode = getHexCode(property); // получаем hex-code цвета
                if (hexCode) hexCodes.push(hexCode); // если пустой, значит лежал не цвет
            }
            else if (property.includes('rgb')) {
                property = property.slice(property.indexOf('rgb'), property.indexOf(')'));
                hexCode = getHexCode(property); // получаем hex-code цвета
                if (hexCode) hexCodes.push(hexCode); // если пустой, значит лежал не цвет
            }
            else {
                let properties = property.split(' ');
                for (const prop of properties) {
                    hexCode = getHexCode(prop.trim()); // получаем hex-code цвета
                    if (hexCode) hexCodes.push(hexCode); // если пустой, значит лежал не цвет
                }
            }
        }
    }
    hexCodes = [...new Set(hexCodes)];
    domtoimage.toPng(resultDom) 
    .then(function (dataUrl) { // сохранение base64 картинки из пользовательского кода
        idLevel ? editLevel(dataUrl) : addLevel(dataUrl); // запрос на редактирование/добавление уровня
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });

});


deleteButton.addEventListener('click', (event) => {
    if (userInfo.isStaff && !reason.value.trim() && idUser) {
        error.classList.add('error');
        error.classList.remove('success');
        error.textContent = 'Напишите причину удаления';
        return;
    }
    deleteLevel();
});

function deleteLevel() {
    if (idUser) {
        const formData = new FormData(); // объект для хранения данных отправляемой формы
        formData.append('idLevel', idLevel);
        formData.append('reason', reason.value.trim());
        fetch(`http://localhost:3001/api/deletelevel`, { 
            method: 'PUT', 
            body: formData
        })
        .then((res) => res.json()).then((res) => {
            if (res) {
                location.reload();
            }
        });
    }
    else {
        if (confirm('Вы действительно хотите удалить уровень? Данное действие отменить нельзя.')) {
            console.log('sdf');
            fetch(`http://localhost:3001/api/mylevels`, { 
                method: 'DELETE', 
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    idLevel
                })
            }).then((res) => {
                if (res) location = '../index.html';
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}


function editLevel(dataUrl) { // редактирование уровня

    let img = dataURLtoFile(dataUrl);
    const formData = new FormData(); // объект для хранения данных отправляемой формы
    formData.append('idLevel', idLevel);
    formData.append('file', img);
    formData.append('name', nameLevel.value.trim());
    formData.append('codeLevel', editor.getValue().trim());
    formData.append('isChecked', userInfo.isStaff ? 1 : 0);
    formData.append('maxScore', userInfo.isStaff ? scores.value.trim() : 0); // ! ПОЛЕ ДЛЯ ВВОДА КОЛ-ВА ОЧКОВ !!!
    for (const hexCode of hexCodes) {
        formData.append('hexCodes', hexCode);
    }
    fetch(`http://localhost:3001/api/editlevel`, { 
        method: 'PUT', 
        body: formData
    })
    .then((res) => res.json()).then((res) => {
        if (res) {
            location.reload();
        }
    });

}

function addLevel(dataUrl) { // добавление нового уровня

    let img = dataURLtoFile(dataUrl);
    const formData = new FormData(); // объект для хранения данных отправляемой формы
    formData.append('file', img);
    formData.append('idUser', userInfo.isStaff ? null : userInfo.id);
    formData.append('name', nameLevel.value.trim());
    formData.append('codeLevel', editor.getValue().trim());
    formData.append('isChecked', userInfo.isStaff ? 1 : 0);
    formData.append('maxScore', userInfo.isStaff ? scores.value.trim() : 0); // ! ПОЛЕ ДЛЯ ВВОДА КОЛ-ВА ОЧКОВ !!!
    for (const hexCode of hexCodes) {
        formData.append('hexCodes', hexCode);
    }
    fetch(`http://localhost:3001/api/newlevel`, { 
        method: 'POST', 
        body: formData
    })
    .then((res) => res.json()).then((res) => {
        if (res) {
            location = `${location}#${res.id}`;
        }
    });

}

 /**
  * Функция, возвращающая hex-код цвета
  * @param {String} color - цвет 
  * @returns {String}
  */
function getHexCode(color) {
    if (colorNameToHex(color)) return colorNameToHex(color); // если color - название цвета
    else if (color.includes('#')) return color; // если color - hex-код
    else if (color.includes('rgb')) return rgbToHex(color); // если color - rgb()
    return ''; // если color - не цвет
}

/**
 * Функция, преобразующая rgb в hex-code
 * @param {String} color - цвет rgb()
 * @returns {String}
 */
function rgbToHex(color) {
    color = color.replaceAll(' ', '').replace('rgb', '').replace('(', '').replace(')', '').replace('a', ''); 
    console.log(color);
    let arrRGB = color.split(','); // массив из r, g, b
    console.log(arrRGB);
    return "#" + componentToHex(Number(arrRGB[0])) + componentToHex(Number(arrRGB[1])) + componentToHex(Number(arrRGB[2]));
}

/**
 * 
 * @param {String} c - компонент цвета (r, g или b)
 * @returns {String}
 */
function componentToHex(c) {
    let hex = c.toString(16); // преобразование в 16-ричную систему
    return hex.length == 1 ? "0" + hex : hex;
} 

/**
 * 
 * @param {String} color - название цвета 
 * @returns {String|Boolean}
 */
function colorNameToHex(color) {
    let colors = {"aliceblue":"#f0f8ff", "antiquewhite":"#faebd7", "aqua":"#00ffff", "aquamarine":"#7fffd4", "azure":"#f0ffff",
    "beige":"#f5f5dc", "bisque":"#ffe4c4", "black":"#000000", "blanchedalmond":"#ffebcd", "blue":"#0000ff", "blueviolet":"#8a2be2",
    "brown":"#a52a2a", "burlywood":"#deb887", "cadetblue":"#5f9ea0", "chartreuse":"#7fff00", "chocolate":"#d2691e", "coral":"#ff7f50",
    "cornflowerblue":"#6495ed", "cornsilk":"#fff8dc", "crimson":"#dc143c", "cyan":"#00ffff", "darkblue":"#00008b", "darkcyan":"#008b8b",
    "darkgoldenrod":"#b8860b", "darkgray":"#a9a9a9", "darkgreen":"#006400", "darkkhaki":"#bdb76b", "darkolivegreen":"#556b2f", 
    "darkorange":"#ff8c00", "darkorange":"#ff8c00", "darkorchid":"#9932cc", "darkred":"#8b0000", "darksalmon":"#e9967a", "darkseagreen":"#8fbc8f",
    "darkslateblue":"#483d8b", "darkslategray":"#2f4f4f", "darkturquoise":"#00ced1", "darkviolet":"#9400d3", "deeppink":"#ff1493",
    "deepskyblue":"#00bfff", "dimgray":"#696969", "dodgerblue":"#1e90ff", "firebrick":"#b22222", "floralwhite":"#fffaf0", "forestgreen":"#228b22",
    "fuchsia":"#ff00ff", "gainsboro":"#dcdcdc", "ghostwhite":"#f8f8ff", "gold":"#ffd700", "goldenrod":"#daa520", "gray":"#808080", 
    "green":"#008000","greenyellow":"#adff2f", "honeydew":"#f0fff0", "hotpink":"#ff69b4", "indianred ":"#cd5c5c", "indigo":"#4b0082", 
    "ivory":"#fffff0", "khaki":"#f0e68c", "lavender":"#e6e6fa", "lavenderblush":"#fff0f5", "lawngreen":"#7cfc00", "lemonchiffon":"#fffacd", 
    "lightblue":"#add8e6", "lightcoral":"#f08080", "lightcyan":"#e0ffff", "lightgoldenrodyellow":"#fafad2", "lightgrey":"#d3d3d3", 
    "lightgreen":"#90ee90", "lightpink":"#ffb6c1", "lightsalmon":"#ffa07a", "lightseagreen":"#20b2aa", "lightskyblue":"#87cefa", 
    "lightslategray":"#778899", "lightsteelblue":"#b0c4de", "lightyellow":"#ffffe0", "lime":"#00ff00", "limegreen":"#32cd32", "linen":"#faf0e6",
    "magenta":"#ff00ff", "maroon":"#800000", "mediumaquamarine":"#66cdaa", "mediumblue":"#0000cd", "mediumorchid":"#ba55d3", "mediumpurple":"#9370d8",
    "mediumseagreen":"#3cb371", "mediumslateblue":"#7b68ee", "mediumspringgreen":"#00fa9a", "mediumturquoise":"#48d1cc", "mediumvioletred":"#c71585", 
    "midnightblue":"#191970", "mintcream":"#f5fffa", "mistyrose":"#ffe4e1", "moccasin":"#ffe4b5", "navajowhite":"#ffdead", "navy":"#000080",
    "oldlace":"#fdf5e6", "olive":"#808000", "olivedrab":"#6b8e23", "orange":"#ffa500", "orangered":"#ff4500", "orchid":"#da70d6", "palegoldenrod":"#eee8aa",
    "palegreen":"#98fb98", "paleturquoise":"#afeeee", "palevioletred":"#d87093", "papayawhip":"#ffefd5", "peachpuff":"#ffdab9", "peru":"#cd853f",
    "pink":"#ffc0cb", "plum":"#dda0dd", "powderblue":"#b0e0e6", "purple":"#800080", "rebeccapurple":"#663399", "red":"#ff0000", "rosybrown":"#bc8f8f",
    "royalblue":"#4169e1", "saddlebrown":"#8b4513", "salmon":"#fa8072", "sandybrown":"#f4a460", "seagreen":"#2e8b57", "seashell":"#fff5ee", 
    "sienna":"#a0522d", "silver":"#c0c0c0", "skyblue":"#87ceeb", "slateblue":"#6a5acd", "slategray":"#708090", "snow":"#fffafa", "springgreen":"#00ff7f",
    "steelblue":"#4682b4", "tan":"#d2b48c", "teal":"#008080", "thistle":"#d8bfd8", "tomato":"#ff6347", "turquoise":"#40e0d0", "violet":"#ee82ee",
    "wheat":"#f5deb3", "white":"#ffffff", "whitesmoke":"#f5f5f5", "yellow":"#ffff00", "yellowgreen":"#9acd32"};
    if (typeof colors[color.toLowerCase()] != 'undefined') return colors[color.toLowerCase()];
    return false;
}

function dataURLtoFile(dataurl) { // преобразование base64 в файл
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'filename', {type:mime});
}