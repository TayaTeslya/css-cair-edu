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
let img;

//проверка запущен ли уровень
// editor.setValue(`<style>\n\t.class {\n\t\tbackground-color: #AA759F;\n\t\twidth: 100px;\n\t\theight: 100px;\n\t}\n</style>\n<div class="class">\n\n</div>\n\n<!-- CSS CAIR EDU -->\n<!-- Это поле для вашего кода.\nПостарайтесь повторить заданную картинку.\nУдачи!\n(Скрипты и картинки запрещены, не смей читерить ;))-->`);
editor.setValue(`<style>
    .class {
        background-color: #AA759F;
        width: 100%;
        height: 100%;
        display: flex;
    }
  .circle {
       background-color: black;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 10px;
  }
</style>
<div class="class">
    <div class="circle">

  </div>
</div>`);
resultDom.innerHTML = editor.getValue();


editor.on('change', () => {
    let resultDom = document.getElementById('result-code');
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
        else if (resCode[key].includes('<script>')) {
            error.textContent = 'WARNING! Тег <script> является запрещенным.';
            return;
        }
        else if (resCode[key].includes('<img')) {
            error.textContent = 'WARNING! Тег <img> является запрещенным.';
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

function getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

saveCodeToImg.addEventListener('click', () => {
    domtoimage.toPng(resultDom)
    .then(function (dataUrl) {
        let base64Default = getBase64Image(document.getElementById('default-img'));
        let base64User = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
        if (base64Default.includes(base64User)) {
            console.log(base64Default);
            console.log(base64User);
            let result = 0;
            console.log(base64Default.length);
            for (let i = 0;  i < base64Default.length; i += 6) {
                if (base64Default.slice(i, i + 7).includes(base64User.slice(i, i + 7))) {
                    result += 6;
                }
            }
            console.log('Всего:' + base64Default.length + '; рез:' + result + '; проц:' + 100 / base64Default.length * result + '%');
        }
        else {
            let result = 0;
            console.log(base64Default.length);
            for (let i = 0;  i < base64Default.length; i += 6) {
                if (base64Default.slice(i, i + 7).includes(base64User.slice(i, i + 7))) {
                    result += 6;
                }
            }
            console.log('Всего:' + base64Default.length + '; рез:' + result + '; проц:' + 100 / base64Default.length * result + '%');
            console.log(base64Default);
            console.log(base64User);
        }
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
});




