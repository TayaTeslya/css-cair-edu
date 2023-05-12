let editor = CodeMirror.fromTextArea(document.getElementById('textarea'), {
    lineNumbers: true,
    mode: "htmlmixed",
    theme: "base16-dark",
    autoCloseTags: true,
    lineWrapping: true,
    tabSize: 2
});

editor.save();

let resultDom = document.getElementById('result-code');
let error = document.getElementById('error');
let saveCodeToImg = document.getElementById('save-code-to-img');

//проверка запущен ли уровень
editor.setValue(`<style>\n\t.class {\n\t\tbackground-color: #AA759F;\n\t\twidth: 100px;\n\t\theight: 100px;\n\t}\n</style>\n<div class="class">\n\n</div>\n\n<!-- CSS CAIR EDU -->\n<!-- Это поле для вашего кода.\nПостарайтесь повторить заданную картинку.\nУдачи!\n(Скрипты и картинки запрещены, не смей читерить ;))-->`);
resultDom.innerHTML = editor.getValue();


editor.on('change', () => {
    let resCode = editor.getValue().split('\n');
    let flagStyle = false;
    for (const key in resCode) {
        error.textContent = 'нет';
        // console.log(error);
        if (resCode[key].includes('<style>') || resCode[key].includes('</style>')) {
            flagStyle = !flagStyle;
        }
        if (flagStyle) {
            if (resCode[key].includes('{')) {
                resCode[key] = '.result-conteiner ' + resCode[key];
            }
        }
        else if (resCode[key].includes('<script>')) {
            error.textContent = 'WARNING! Тег <script> является запрещенным.';
            return;
        }
        else if (resCode[key].includes('<img')) {
            error.textContent = 'WARNING! Тег <img> является запрещенным.';
            return;
        }
    }
    resultDom.innerHTML = resCode.join(' ');
});

saveCodeToImg.addEventListener('click', () => {
    domtoimage.toPng(resultDom)
    .then(function (dataUrl) {
        console.log(dataUrl);
        let img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
});




