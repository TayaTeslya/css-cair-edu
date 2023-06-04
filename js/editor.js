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
let defaultCode = `<style>\n\t.class {\n\t\tbackground-color: white;\n\t\twidth: 100px;\n\t\theight: 100px;\n\t}\n</style>\n<div class="class">\n\n</div>\n\n<!-- CSS CAIR EDU -->\n<!-- Это поле для вашего кода.\nПостарайтесь повторить заданную картинку.\nУдачи!\n(Скрипты и картинки запрещены, не смей читерить ;))-->`;
editor.setValue(defaultCode); // начальный код уровней
resultDom.innerHTML = editor.getValue(); // отображение результата пользовательского кода

let isValid = false; // флаг валидности

editor.on('change', () => { // событие изменения в редакторе кода
    let resCode = editor.getValue().split('\n'); // массив кода пользователя по строкам
    let flagStyle = false; // флаг, отображающий, находится ли строчка кода в тегах <style></style>
    isValid = false;
    find: { // для прерывания поиска запрещенных символов/тегов/слов и т.д.
        for (const key in resCode) { 
            error.textContent = ''; // очищение строки с ошибкой
            if (resCode[key].includes('<style>') || resCode[key].includes('</style>')) { 
                flagStyle = !flagStyle;
            }
            if (flagStyle && resCode[key].includes('{')) {
                resCode[key] = '.result-conteiner ' + resCode[key]; // добавление общего класса для всех селекторов, чтобы они не применялись вне объекта для вывода результата
            }
            if (resCode[key].includes('url')) { // запреты
                error.textContent = 'WARNING! url является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('<script>')) {
                error.textContent = 'WARNING! Тег <script> является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('img')) {
                error.textContent = 'WARNING! img является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('image')) {
                error.textContent = 'WARNING! image является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('<body')) {
                error.textContent = 'WARNING! Тег <body> является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('<article')) {
                error.textContent = 'WARNING! Тег <article является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('src')) {
                error.textContent = 'WARNING! scr является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('onload')) {
                error.textContent = 'WARNING! onload является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('onerror')) {
                error.textContent = 'WARNING! onerror является запрещенным.';
                break find;
            }
            else if (resCode[key].includes('rgba')) {
                error.textContent = 'WARNING! rgba является запрещенным. Пожалуйста, используйте rgb :).';
                break find;
            }
            else if (resCode[key].includes('hsl')) {
                error.textContent = 'WARNING! hsl является запрещенным. Пожалуйста, используйте rgb :).';
                break find;
            }
            else if (resCode[key].includes('gradient')) {
                error.textContent = 'WARNING! gradient является запрещенным.';
                break find;
            }
        }
        isValid = true;
    }
    resultDom.innerHTML = resCode.join(' '); // отображение результата пользовательского кода
});