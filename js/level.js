// localStorage.setItem('idLevel', '1'); //сохранить - локальное хранилище браузера
// localStorage.getItem('idLevel'); //получить - короче как сессионные переменные в пхп

// console.log(window.location);


const strsCode = document.getElementById('strs-code');
const strsCount = document.getElementById('strs-count');

strsCode.addEventListener('keypress', (event) => {
    if (event.key === 'Backspace') { // удаление номера строки
        if (strsCode.children.length === 1 && strsCode.children[0].textContent.length <= 0) {
            event.preventDefault(); // чтобы div 1 строки не удалялся
        }
    }
});

strsCode.addEventListener('keyup', (event) => {
    if (strsCode.children.length + 1 === strsCount.children.length) { 
        strsCount.removeChild(strsCount.lastChild);
    }
    else if (strsCode.children.length === strsCount.children.length + 1) {
        let divCount = document.createElement('div');
        divCount.textContent = strsCount.children.length + 1;
        strsCount.appendChild(divCount);
    }
    if (strsCode.children.length != strsCount.children.length) { // !!!! КОПИРОВАНИЕ, ВСТАВКА, УДАЛЕНИЕ НЕСКОЛЬКИХ СТРОК СРАЗУ - в css батлле просто обновление

    }
    else {
        // изменение высоты номера строки
        let selectedItem = window.getSelection().focusNode.parentNode;
        let indexEdit = [...strsCode.children].indexOf(selectedItem);
        if (getComputedStyle(strsCode.children[indexEdit]).height !== getComputedStyle(strsCount.children[indexEdit]).height) {
            strsCount.children[indexEdit].style.height = getComputedStyle(strsCode.children[indexEdit]).height;
        }
        if (event.key === '<' || event.key === '>' || event.key === '{' || event.key === '}') {
            let focusIndex = window.getSelection().focusOffset;
            selectedItem.textContent = selectedItem.textContent.slice(0, focusIndex) + selectedItem.textContent.slice(focusIndex + 1, (selectedItem.textContent.length - 1));
            let span = document.createElement('span');
            span.style.color = '#959595';
            span.textContent = event.key;
            selectedItem.appendChild(span);
        }
    }
    
});


