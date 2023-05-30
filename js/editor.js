let editor = CodeMirror.fromTextArea(document.getElementById('textarea'), {
    lineNumbers: true,
    mode: "htmlmixed",
    theme: "base16-dark",
    autoCloseTags: true,
    lineWrapping: true,
    tabSize: 2
});

let resultDom = document.getElementById('result-code');

//проверка запущен ли уровень
editor.setValue(`<style>\n\t.class {\n\t\tbackground-color: white;\n\t\twidth: 100px;\n\t\theight: 100px;\n\t}\n</style>\n<div class="class">\n\n</div>\n\n<!-- CSS CAIR EDU -->\n<!-- Это поле для вашего кода.\nПостарайтесь повторить заданную картинку.\nУдачи!\n(Скрипты и картинки запрещены, не смей читерить ;))-->`);
// editor.setValue(`
// <style>
//   .class {
//     background-color: #ffffff;
//     width: 100px;
//     height: 100px;
//   }  
// </style>
// <div class="class">
  
// </div>`);
resultDom.innerHTML = editor.getValue();

editor.save();

editor.on('change', () => {

    let resCode = editor.getValue().split('\n');
    let flagStyle = false;

    for (const key in resCode) {
        error.textContent = '';
        // console.log(error);
        if (resCode[key].includes('<style>') || resCode[key].includes('</style>')) {
            flagStyle = !flagStyle;
        }
        if (flagStyle) {
            if (resCode[key].includes('{')) {
                resCode[key] = '.result-conteiner ' + resCode[key];
            }
        }
        else if (resCode[key].includes('url')) {
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
    resultDom.innerHTML = resCode.join(' ');
});