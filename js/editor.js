const editor = CodeMirror.fromTextArea(document.getElementById('textarea'), { // объект поля ввода пользовательского кода - редактор кода
    lineNumbers: true, // отображение номеров строк 
    mode: "htmlmixed", // синтаксис html + css 
    theme: "base16-dark", // тема
    autoCloseTags: true, // автоматическое закрытие тегов
    lineWrapping: true,
    tabSize: 2
});

const resultDom = document.getElementById('result-code'); // объект для вывода результата пользовательского кода

//проверка запущен ли уровень в level.js!
editor.setValue(`<style>\n\t.class {\n\t\tbackground-color: white;\n\t\twidth: 100px;\n\t\theight: 100px;\n\t}\n</style>\n<div class="class">\n\n</div>\n\n<!-- CSS CAIR EDU -->\n<!-- Это поле для вашего кода.\nПостарайтесь повторить заданную картинку.\nУдачи!\n(Скрипты и картинки запрещены, не смей читерить ;))-->`); // начальный код уровней
resultDom.innerHTML = editor.getValue(); // отображение результата пользовательского кода

editor.on('change', () => { // событие изменения в редакторе кода
    let resCode = editor.getValue().split('\n'); // массив кода пользователя по строкам
    let flagStyle = false; // флаг, отображающий, находится ли строчка кода в тегах <style></style>
    for (const key in resCode) { 
        error.textContent = ''; // очищение строки с ошибкой
        if (resCode[key].includes('<style>') || resCode[key].includes('</style>')) { 
            flagStyle = !flagStyle;
        }
        if (flagStyle) {
            if (resCode[key].includes('{')) {
                resCode[key] = '.result-conteiner ' + resCode[key]; // добавление общего класса для всех селекторов, чтобы они не применялись вне объекта для вывода результата
            }
        }
        else if (resCode[key].includes('url')) { // запреты
            error.textContent = 'WARNING! url является запрещенным.';
            return;
        }
        else if (resCode[key].includes('<script>')) {
            error.textContent = 'WARNING! Тег <script> является запрещенным.';
            return;
        }
        else if (resCode[key].includes('<img')) {
            error.textContent = 'WARNING! <img> является запрещенным.';
            return;
        }
        else if (resCode[key].includes('<body')) {
            error.textContent = 'WARNING! Тег <body> является запрещенным.';
            return;
        }
        else if (resCode[key].includes('<article')) {
            error.textContent = 'WARNING! Тег <article является запрещенным.';
            return;
        }
        else if (resCode[key].includes('src')) {
            error.textContent = 'WARNING! scr является запрещенным.';
            return;
        }
        else if (resCode[key].includes('onload')) {
            error.textContent = 'WARNING! onload является запрещенным.';
            return;
        }
        else if (resCode[key].includes('onerror')) {
            error.textContent = 'WARNING! onerror является запрещенным.';
            return;
        }
    }
    resultDom.innerHTML = resCode.join(' '); // отображение результата пользовательского кода
});