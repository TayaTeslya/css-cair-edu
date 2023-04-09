// localStorage.setItem('idLevel', '1'); //сохранить - локальное хранилище браузера
// localStorage.getItem('idLevel'); //получить - короче как сессионные переменные в пхп

// console.log(window.location);


const strsCode = document.getElementById('strs-code');
const strsCount = document.getElementById('strs-count');


function lastStrBackspace(event) {
    if (event.key === 'Backspace') { // удаление номера строки
        if (strsCode.children.length === 1 && (strsCode.children[0].textContent.length <= 0 || strsCode.children[0].innerHTML === '<br>' || strsCode.children[0].innerHTML === '</br>')) {
            event.preventDefault(); // чтобы div 1 строки не удалялся
        }
    }
}

strsCode.addEventListener('keydown', (event) => {
    lastStrBackspace(event);
});

strsCode.addEventListener('keyup', (event) => {

    lastStrBackspace(event);

    if (strsCode.children.length + 1 === strsCount.children.length) {  // кол-во номеров строк
        strsCount.removeChild(strsCount.lastChild);
    }
    else if (strsCode.children.length === strsCount.children.length + 1) {
        addCount(strsCount.children.length + 1);
    }
    else if (strsCode.children.length != strsCount.children.length) { // !!!! КОПИРОВАНИЕ, ВСТАВКА, УДАЛЕНИЕ НЕСКОЛЬКИХ СТРОК СРАЗУ - в css батле просто обновление
        updateCount();
    }
    else {
        // изменение высоты номера строки
        let selectedItem = window.getSelection().focusNode.parentNode;
        let indexEdit = [...strsCode.children].indexOf(selectedItem);
        if (strsCode.children[indexEdit]) {
            updateHeightCount(indexEdit);
        }
        // if (event.key === '<' || event.key === '>' || event.key === '{' || event.key === '}') {
        //     let focusIndex = window.getSelection().focusOffset;
        //     selectedItem.textContent = selectedItem.textContent.slice(0, focusIndex) + selectedItem.textContent.slice(focusIndex + 1, (selectedItem.textContent.length - 1));
        //     let span = document.createElement('span');
        //     span.style.color = '#959595';
        //     span.textContent = event.key;
        //     selectedItem.appendChild(span);
        // }
    }
    
});

strsCode.addEventListener('cut', (event) => {
    updateCount();
});

strsCode.addEventListener('paste', (event) => {
    
    event.preventDefault();
    let selectedItem =  window.getSelection().focusNode;
    let focusIndex = window.getSelection().focusOffset;
    let buffer = event.clipboardData.getData("text").split('\n');
    let textInStr;
    if (selectedItem === strsCode) {
        selectedItem = selectedItem.firstChild.firstChild;
    }
    for (const key in buffer) {
        console.log(key);
        let div = document.createElement('div');
        if (key === '0') {
            if (selectedItem.textContent !== '') {
                console.log(selectedItem.parentNode);
                textInStr = selectedItem.textContent;
                div.textContent = textInStr.slice(0, focusIndex) + buffer[key];
                selectedItem.parentNode.replaceWith(div);
            }
            else {
                div.textContent = buffer[key];
                selectedItem.after(div);
                strsCode.removeChild(selectedItem);
            }
        }
        else {
            div.textContent = buffer[key];
            selectedItem.after(div);
        }
        selectedItem = div;
    }
    selectedItem.textContent += textInStr.slice(focusIndex, textInStr.length - 1);
    updateCount();
});

function addCount(count) {
    let divCount = document.createElement('div');
    divCount.textContent = count;
    strsCount.appendChild(divCount);
}

function updateHeightCount(i) {
    if (getComputedStyle(strsCode.children[i]).height !== getComputedStyle(strsCount.children[i]).height) {
        strsCount.children[i].style.height = getComputedStyle(strsCode.children[i]).height;
    }
}

function updateCount() {
    while (strsCount.firstChild) { // удаление номеров строк
        strsCount.removeChild(strsCount.lastChild);
        console.log('lelele');
    }
    for (let i = 0; i < strsCode.children.length; i++) {
        addCount(i + 1);
        updateHeightCount(i);
    }
}

