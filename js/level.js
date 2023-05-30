const saveCodeToImg = document.getElementById('save-code-to-img');

const resultScore = document.getElementById('result-score');
const maxScore = document.getElementById('max-score');
const hexCodesContainer = document.getElementsByClassName('hex-codes-container');
const author = document.getElementsByClassName("card-author");


const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

// данные
const defaultImg = document.getElementsByClassName("img-default");

let level = {"id": 1, "thumbnail": "../img/levels/5.png", "codeLevel": "", "maxScoreUser": 433, "maxScore": 654, "score": 432, "author": "Имя пользователя", "hexCodes": ["#000000", "#9897AE", "#37385A", "#C0C3DB"]}
if (level["codeLevel"] !== "") {
    editor.setValue(level["codeLevel"]);
}
for (let i = 0; i < 2; i++) {
    defaultImg[i].src = level["thumbnail"];
    author[i].textContent = 'Автор - ' + level["author"];
}
resultScore.textContent = level["score"] + ' из ' + level["maxScore"] + ' (' + (Math.floor(100 / level["maxScore"] * level["score"])) + '%)';
maxScore.textContent = level["maxScoreUser"] + ' из ' + level["maxScore"] + ' (' + (Math.floor(100 / level["maxScore"] * level["maxScoreUser"])) + '%)';
for (const hexCode of level["hexCodes"]) {
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
// данные

profileContainer.addEventListener('click', (event) => {
    profileMenu.classList.toggle('unvisible');
});

saveCodeToImg.addEventListener('click', () => {

    domtoimage.toPixelData(resultDom)
    .then(function (pixels) {
    
            
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            canvas.width = 300;
            canvas.height = 200;

            ctx.drawImage(document.getElementById('default-img'), 0, 0);
            let imgDataDefault = ctx.getImageData(0, 0, document.getElementById('default-img').width, document.getElementById('default-img').height);

            let imgDataUser = pixels;

                let result = 0;

                for (let i = 0; i < imgDataDefault.data.length; i += 4) {
                    if (imgDataDefault.data[i] === imgDataUser[i]) {
                        if (imgDataDefault.data[i + 1] === imgDataUser[i + 1]) {
                            if (imgDataDefault.data[i + 2] === imgDataUser[i + 2]) {
                                if (imgDataDefault.data[i + 3] === imgDataUser[i + 3]) {
                                    result++;
                                }
                            }
                        }
                    }
                }
                result = (Math.floor(100 / (imgDataDefault.data.length / 4) * result));

                resultScore.textContent = (Math.floor((711 / 100) * result)) + ' из ' + 711 + ' (' + result + '%)';
                
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
});




