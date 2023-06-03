const favorite = document.getElementsByClassName("favorite"); // кнопка добавления в/удаления из избранного
const levelContainer = document.getElementById("levels-container"); // объект для вывода уровней
const searchLevel = document.getElementById('search-level'); // кнопка поиска уровней

let levels;
let currentLevels;
// let options = {author: '', name: '', }

fetch(`http://localhost:3001/api/levels?idUser=${userInfo.id}`).then((res) => res.json())
.then((res) => {
    levels = res;
    currentLevels = res;
    console.log(levels);

    setLevels((element) => true); // вывод всех уровней

    /**
     * функция вывода уровней в зависимости от выбранной категории
     * @param {function object} condition - функция, возвращающая true/false
     */
    for (let i = 0; i < favorite.length; i++) {
        favorite[i].addEventListener('click', (event) => { // событие клика по объекту избранное
            event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
            if (favorite[i].children[0].src.includes('/img/icons/not_favorite_icon.png')) { // изменение картинки избранного
                console.log('post');
                fetch(`http://localhost:3001/api/favorite`, { 
                        method: 'POST', 
                        headers: {'Content-Type' : 'application/json'}, 
                        body: JSON.stringify({
                            idUser: userInfo.id, 
                            idLevel: event.target.dataset.idLevel
                    })})
                    .then((res) => res.json()).then((res) => {
                    if (res) {
                        favorite[i].children[0].src = favorite[i].children[0].src.replace('not_favorite', 'favorite');
                    }
                });
            }
            else {
                console.log('delete');
                fetch(`http://localhost:3001/api/favorite`, { 
                        method: 'DELETE', 
                        headers: {'Content-Type' : 'application/json'}, 
                        body: JSON.stringify({
                            idUser: userInfo.id, 
                            idLevel: event.target.dataset.idLevel
                    })})
                    .then((res) => res.json()).then((res) => {
                    if (res) {
                        favorite[i].children[0].src = favorite[i].children[0].src.replace('favorite', 'not_favorite');
                    }
                });
            }
        });
    }

}).catch((error) => {
    console.log(error);
});

function setLevels(condition) {
    levelContainer.innerHTML = ''; // очищение объекта для вывода уровней
    currentLevels = currentLevels.filter(condition);
    for (const level of currentLevels) { // цикл, проходящий по отфильтрованным по категориям уровням
        if (!userInfo.isStaff && level.isPublished) { // вывод доступных для учеников уровней
            levelContainer.innerHTML += 
            `<div class="d-flex py-0 px-0">
                <a id="${level.id}" href="../pages/level.html#${level.id}" class="d-flex card justify-content-between flex-column gap-2">
                    <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                        <img src="${level.thumbnail}" alt="">
                        <div data-id-level='${level.id}' class="favorite anime-little">
                            <img src="${level.favorite ? '../img/icons/favorite_icon.png' : '../img/icons/not_favorite_icon.png'}" alt="">
                        </div>
                    </div>
                    <div class="d-flex card-description justify-content-between mx-3 my-2">
                        <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                            <p class="card-title ov-text">${level.author ? "~" : "#"}<span>${level.id}</span> - ${level.name}</p>
                            <p class="card-author ov-text">${level.author || ''}</p>
                        </div>
                        <div class="card-status-level d-flex col-1 col-sm-1 col-lg-1 col-md-1 justify-content-end">
                            <img src="${ 
                                (() => 
                                    {
                                        if (level.maxScore === level.maxScoreUser) { // Пройден
                                            return '../img/icons/done_icon.png';
                                        } else if (level.maxScoreUser > 0) { // Начат
                                            return '../img/icons/pause_icon.png';
                                        } else { // Не начат
                                            return '../img/icons/start_icon.png';
                                        }
                                    }
                                )() // () - вызов стрелочной ф-ции
                            }" alt="">  
                        </div>
                    </div>
                </a>
            </div>`;
        }
        else if (userInfo.isStaff) { // вывод всех уровней для администраторов
            levelContainer.innerHTML += 
            `<div class="d-flex py-0 px-0">
                <a id="${level.id}" href="../pages/newlevel.html#${level.id}" class="d-flex card justify-content-between flex-column gap-2">
                    <div class="card-img col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-center">
                        <img src="${level.thumbnail}" alt="">
                    </div>
                    <div class="d-flex card-description justify-content-between mx-3 my-2">
                        <div class="d-flex flex-column col-10 col-sm-10 col-lg-10 col-md-10">
                            <p class="card-title ov-text">${level.author ? "~" : "#"}<span>${level.id}</span> - ${level.name}</p>
                            <p class="card-author ov-text">${level.author}${!level.isPublished ? `<span class="error"> - На проверке</span>` : ""}</p>
                        </div>
                    </div>
                </a>
            </div>`;
        }
    }
}

searchLevel.addEventListener('keyup', (event) => { // событие ввода данных в поле поиска
    let searchValue = searchLevel.value.trim().toLowerCase(); // переменная с искомой строкой
    if (searchValue) { // если поле ввода не пустое
        setLevels((element) => element.author?.toLowerCase().includes(searchValue) || element.name.toLowerCase().includes(searchValue) || (element.id === Number(searchValue)));
    }
    else {
        currentLevels = levels;
        changeCategory();
    }
});


        
