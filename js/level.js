let saveCodeToImg = document.getElementById('save-code-to-img');
let img;

let resultScore = document.getElementById('result-score');

const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

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
            
                console.log(pixels);


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




