// localStorage.setItem('idLevel', '1'); //сохранить - локальное хранилище браузера
// localStorage.getItem('idLevel'); //получить - короче как сессионные переменные в пхп

// console.log(window.location);


const strsCode = document.getElementById('strs-code');
const strsCount = document.getElementById('strs-count');


strsCode.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        let divCount = document.createElement('div');
        divCount.textContent = strsCount.children.length + 1;
        strsCount.appendChild(divCount);
        // window.getSelection().focusNode.addEventListener('resize', (event) => {
        //     console.log(event);
        // });
        // console.log(window.getSelection().focusNode);
        // console.log(strsCode.children[0]);
    }
    else {
        let indexEdit;
        for (let i = 0; i < strsCode.children.length; i++) {
            if (strsCode.children[i] === window.getSelection().focusNode.parentNode) {
                indexEdit = i;
                break;
            }
        }
        if (getComputedStyle(strsCode.children[indexEdit]).height !== getComputedStyle(strsCount.children[indexEdit]).height) {
            strsCount.children[indexEdit].style.height = getComputedStyle(strsCode.children[indexEdit]).height;
        }
    }
    if (event.key === 'Backspace') {
        if (strsCode.children.length === 1 && strsCode.children[0].textContent.length <= 0) {
            event.preventDefault(); // чтобы div 1 строки не удалялся
        }
    }
});


