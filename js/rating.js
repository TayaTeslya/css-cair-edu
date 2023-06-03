const rating = document.getElementById("rating"); //  объект для вывода рейтинга
const scores = document.getElementById("scores"); // объект для вывода очков
const levelsDone = document.getElementById("levels-done"); // объект для вывода количества пройденных уровней
const userRating = document.getElementById("levels-statistic"); // объект для вывода рейтинга пользователей

fetch(`http://localhost:3001/api/rating?idUser=${userInfo.id}`).then((res) => res.json())
.then(({ratingList, ratingUser}) => { // деструктуризация по названию в объекте, возвращаемом сервером

    rating.textContent = `Рейтинг - ${ratingUser.rating}/${ratingUser.count}`;
    scores.textContent = `Собрано очков - ${ratingUser.scores}`;

    ratingList.map((rating, index) => { //rating - элемент массива - как foreach
        userRating.innerHTML += `
        <div class="${rating.idUser === userInfo.id ? 'select-category' : ''} d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
            <p>${index + 1}</p>
        </div>
        <div class="${rating.idUser === userInfo.id ? 'select-category' : ''} d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center">
            <a id="${rating.idUser}" href="../pages/profile.html#${rating.idUser}" class="d-flex w-100 align-items-center justify-content-start gap-3 px-3">
                <div class="profile-photo img-avatar d-flex align-items-center justify-content-center">
                    <img src="${rating.avatarPath}" alt=""/>
                </div>    
                <p class="ov-text">${rating.username}</p>
            </a>
        </div>
        <div class="${rating.idUser === userInfo.id ? 'select-category' : ''} d-flex col-lg-4 col-md-4 col-sm-4 col-4 align-items-center justify-content-center">
            <p>${rating.sumMaxScores || 0}</p>
        </div>`;
    });

}).catch((error) => {
    console.log(error);
});