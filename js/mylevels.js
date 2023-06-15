const buttonsDeleteLevel = document.getElementsByClassName('button-delete-level'); // кнопка удаления уровня
const levelContainer = document.getElementById("levels-container"); // объект для вывода уровней
const searchLevel = document.getElementById('search-level'); // кнопка поиска уровней

let checked; // флаг проверки уровня
let levels; // массив объектов с уровнями

fetch(`http://localhost:3001/api/deletelevels`, { 
    method: 'DELETE', 
    headers: {'Content-Type' : 'application/json'}
})
.then((res) => {
    console.log('lkek');
    fetch(`http://localhost:3001/api/mylevels?idUser=${userInfo.id}`).then((res) => res.json())
    .then((res) => {

        levels = res;

        setLevels((element) => true);

        for (const buttonDeleteLevel of buttonsDeleteLevel) {
            buttonDeleteLevel.addEventListener('click', (event) => { // событие клика по кнопке 
                event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
                if (confirm('Вы действительно хотите удалить уровень? Данное действие отменить нельзя.')) {
                    console.log('sdf');
                    fetch(`http://localhost:3001/api/mylevels`, { 
                        method: 'DELETE', 
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify({
                            idLevel: event.target.dataset.idLevel
                        })
                    }).then((res) => {
                        if (res) location.reload();
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            });
        }
    }).catch((error) => {
        console.log(error);
    });
}).catch((error) => {
    console.log(error);
});

/**
     * функция вывода уровней в зависимости от выбранной категории
     * @param {function object} condition - функция, возвращающая true/false
     */
function setLevels(condition) {
    levelContainer.innerHTML = '';
    for (const level of levels.filter(condition)) {
        if (level.isChecked) {
            if (level.dateDelete) {
                checked = "Отклонён";
            }
            else {
                checked = "Выложен";
            }
        }
        else {
            checked = "На проверке";
        }
        levelContainer.innerHTML += 
        `<div class="d-flex py-0 px-0">
            <a title="${getDateDelete(level.reason, level.dateDelete)}" id="${level.id}" href="${checked === "Выложен" ? `../pages/level.html#${level.id}` : `../pages/newlevel.html#${level.id}`}" class="d-flex card justify-content-between flex-column gap-2">
                <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                    <img src="${level.thumbnail}" alt="">
                </div>
                <div class="d-flex card-description justify-content-between mx-3 my-2">
                    <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                        <p class="card-title ov-text">~<span>${level.id}</span> - ${level.name}</p>
                        <p class="${checked === "Отклонён" && "error"} card-author ov-text">${checked}</p>
                    </div>
                    ${ 
                        !level.isChecked || level.dateDelete ? `
                        <div data-id-level='${level.id}' class="button-delete-level card-status-level d-flex col-1 col-sm-1 col-lg-1 col-md-1 justify-content-end">
                            <img src="../img/icons/delete_icon.png" alt="">
                        </div> ` : ''
                    }
                </div>
            </a>
        </div>`;
    } 
}

function getDateDelete(reason, dateDelete) {
    return dateDelete ? `${reason}. Уровень автоматически удалится через ${getNumberOfDays(dateDelete)}.` : '';
}

function getNumberOfDays(end) {
    
    const date1 = new Date();
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.ceil(diffInTime / oneDay);

    if (diffInDays === 1) {
        return `${diffInDays} день`;
    }
    else if (diffInDays < 5) {
        return `${diffInDays} дня`;
    }
    return `${diffInDays} дней`;
}

searchLevel.addEventListener('keyup', (event) => { // событие ввода данных в поле поиска
    let searchValue = searchLevel.value.trim().toLowerCase(); // переменная с искомой строкой
    setLevels((element) => element.name.toLowerCase().includes(searchValue) || (element.id === Number(searchValue)));
});