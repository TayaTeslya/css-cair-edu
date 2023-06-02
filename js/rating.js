const rating = document.getElementById("rating"); //  объект для вывода рейтинга
const scores = document.getElementById("scores"); // объект для вывода очков
const levelsDone = document.getElementById("levels-done"); // объект для вывода количества пройденных уровней
const userRating = document.getElementById("levels-statistic"); // объект для вывода рейтинга пользователей

let userJSON = { // информация о пользователе
    "rating": "3", // место в рейтинге
    "scores": 46554, // собрано очков за все уровни (максимальных)
}

let ratingJSON = [ // объект с первой сотней пользователей в рейтинге
    {idUser: 4, sumMaxScore: 67548, username: 'Игнат Суханов', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 56346, username: 'Никита Беломестных', avatar: '../img/avatars/av1.png'},
    {idUser: 1, sumMaxScore: 46554, username: 'Тася Тесля', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 37346, username: 'Дима Певень', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 15636, username: 'Лиза Хрюкина', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 11245, username: 'Эмиль Куртаметов', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 9765, username: 'Настя Каренова', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 5, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
];

rating.textContent = `Место в топе - ${userJSON.rating}`;
scores.textContent = `Собрано очков - ${userJSON.scores}`;

ratingJSON.map((rating, index) => { //rating - элемент массива - как foreach
    userRating.innerHTML += `
    <div class="${rating.idUser === userInfo.id ? 'select-category' : ''} d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
        <p>${index + 1}</p>
    </div>
    <div class="${rating.idUser === userInfo.id ? 'select-category' : ''} d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center">
        <a id="${rating.idUser}" href="../pages/profile.html#${rating.idUser}" class="d-flex w-100 align-items-center justify-content-start gap-3 px-3">
            <div class="profile-photo img-avatar d-flex align-items-center justify-content-center">
                <img src="${rating.avatar}" alt=""/>
            </div>    
            <p class="ov-text">${rating.username}</p>
        </a>
    </div>
    <div class="${rating.idUser === userInfo.id ? 'select-category' : ''} d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
        <p>${rating.sumMaxScore}</p>
    </div>`;
});