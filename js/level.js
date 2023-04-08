// localStorage.setItem('idLevel', '1'); //сохранить - локальное хранилище браузера
// localStorage.getItem('idLevel'); //получить - короче как сессионные переменные в пхп

console.log(window.location);


const strsCode = document.getElementById('strs-code');


strsCode.addEventListener('keydown', (event) => {

});






// for (let i = 0; i < strsCode.children.length; i++) {
//     strsCode.children[i].addEventListener('keydown', workWithStrCode);
//     console.log(kek);
// }

// function workWithStrCode(event) {
//     // if (event.key === 'Enter') {
//     //     let div = document.createElement('div');
//     //     div.id = strsCode.children.length;
//     //     strsCode.appendChild(div);
//     //     div.focus();
//     //     div.addEventListener('keydown', workWithStrCode);
//     // }
//     console.log(event.key);
//     if (event.key === '<' || event.key === '>') {
//         console.log(event.key);
//     }
// }