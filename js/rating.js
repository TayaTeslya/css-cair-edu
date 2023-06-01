const username = document.getElementById("username");
const rating = document.getElementById("rating");
const scores = document.getElementById("scores");
const levelsDone = document.getElementById("levels-done");
const levelsStatistic = document.getElementById("levels-statistic");

let userInfo = JSON.parse(localStorage.getItem("user"));

// api запрос инфы о пользователе
let userJSON = {
    "rating": 143, // место в рейтинге
    "scores": 5746, // собрано очков за все уровни (максимальных)
}

let ratingJSON = [ // первые 100 записей
    {idUser: 4, sumMaxScore: 67548, username: 'первое место ебатьsfsdfsdfsdfsdfsdfsdfd', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 6747, username: 'второе место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 2, sumMaxScore: 689, username: 'третье место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 1, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},
    {idUser: 6, sumMaxScore: 679, username: 'четвертое место ебать', avatar: '../img/avatars/av1.png'},

];

username.textContent = userInfo.username;
rating.textContent = `Место в топе - ${userJSON.rating}`;
scores.textContent = `Собрано очков - ${userJSON.scores}`;

ratingJSON.map((rating, index) => { //rating - элемент массива - как foreach
    levelsStatistic.innerHTML += `
    <div class="${rating.idUser === userInfo.id ? 'select-category' : ''} d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
        <p>${index}</p>
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