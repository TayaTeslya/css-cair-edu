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

saveCodeToImg.addEventListener('click', () => {
    domtoimage.toPng(resultDom)
    .then(function (dataUrl) {
            
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            canvas.width = 300;
            canvas.height = 200;

            ctx.drawImage(document.getElementById('default-img'), 0, 0);
            let imgDataDefault = ctx.getImageData(0, 0, document.getElementById('default-img').width, document.getElementById('default-img').height);

            let imgDataUser;
            
            var imageUser = new Image();

            imageUser.src = dataUrl;

            imageUser.onload = function() {
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imageUser, 0, 0);
                var imageData = ctx.getImageData(0, 0, imageUser.width, imageUser.height);
                imgDataUser = imageData;
                

                console.log(imgDataUser.data.slice(0, 4));
                console.log(imgDataDefault.data.slice(0, 4));


                let result = 0;

                for (let i = 0; i < imgDataDefault.data.length; i += 4) {
                    if (imgDataDefault.data[i] === imgDataUser.data[i]) {
                        if (imgDataDefault.data[i + 1] === imgDataUser.data[i + 1]) {
                            if (imgDataDefault.data[i + 2] === imgDataUser.data[i + 2]) {
                                // if (imgDataDefault.data[i + 3] === imgDataUser.data[i + 3]) {
                                    result++;
                                    // console.log('--------------');
                                    // console.log(imgDataDefault.data[i], imgDataUser.data[i]);
                                    // console.log(imgDataDefault.data[i + 1], imgDataUser.data[i + 1]);
                                    // console.log(imgDataDefault.data[i + 2], imgDataUser.data[i + 2]);
                                    // console.log(imgDataDefault.data[i + 3], imgDataUser.data[i + 3]);
                                // }
                            }
                        }
                    }
                }

                // for (let i = 0; i < imgDataDefault.data.length / 4; i += 1) {
                //     if (imgDataDefault.data[i] === imgDataUser.data[i]) {
                //         if (imgDataDefault.data[i + 60000] === imgDataUser.data[i + 60000]) {
                //             if (imgDataDefault.data[i + 120000] === imgDataUser.data[i + 120000]) {
                //                 // if (imgDataDefault.data[i + 180000] === imgDataUser.data[i + 180000]) {
                //                     result++;
                //                     // console.log('--------------');
                //                     // console.log(imgDataDefault.data[i], imgDataUser.data[i]);
                //                     // console.log(imgDataDefault.data[i + 1], imgDataUser.data[i + 1]);
                //                     // console.log(imgDataDefault.data[i + 2], imgDataUser.data[i + 2]);
                //                     // console.log(imgDataDefault.data[i + 3], imgDataUser.data[i + 3]);
                //                 // }
                //             }
                //         }
                //     }
                // }
                
                console.log(100 / (imgDataDefault.data.length / 4) * result);


            }

            

    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
});




