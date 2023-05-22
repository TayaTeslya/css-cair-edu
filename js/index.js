const categoriesButton = document.getElementById("categories");
const categoriesList = document.getElementById("categories-list")
const favorite = document.getElementsByClassName("favorite");
const profileContainer = document.getElementById("profile-container");
const profileMenu = document.getElementById("profile-menu");

let selectedCategory = 0; // выбранная категория игр (по умолчанию - все)

categoriesButton.addEventListener('click', (event) => {
        categoriesList.classList.toggle('unvisible');
});

for (let i = 0; i < categoriesList.children.length; i++) { // выбор категории
    categoriesList.children[i].addEventListener('click', (event) =>  { 
        selectedCategory = i;
        if (categoriesList.children[i].textContent.trim() === 'Все') {
            categoriesButton.children[0].textContent = 'Категории';
            categoriesButton.classList.remove('white-category');
        } else {
            categoriesButton.children[0].textContent = categoriesList.children[i].textContent.trim();
            categoriesButton.classList.add('white-category');
        }
        categoriesList.classList.add('unvisible');
    });
}

profileContainer.addEventListener('click', (event) => {
    profileMenu.classList.toggle('unvisible');
});

categoriesList.addEventListener('mouseenter', (event) => { // удаление класса "выбрано" при наведении на категории
    categoriesList.children[selectedCategory].classList.remove('select-category');
});

categoriesList.addEventListener('mouseleave', (event) => { // добавление класса "выбрано" на выбранный элемент при сведении мыши с категорий
    categoriesList.children[selectedCategory].classList.add('select-category');
});

for (let i = 0; i < favorite.length; i++) {
    favorite[i].addEventListener('click', (event) => { // изменение иконки "избранное" при нажатии
        event.preventDefault(); //отключение стандартного поведение ссылки (родителя избранного)
        if (favorite[i].children[0].src.includes('/img/icons/not_favorite_icon.png')) {
            favorite[i].children[0].src = favorite[i].children[0].src.replace('not_favorite', 'favorite');
        }
        else {
            favorite[i].children[0].src = favorite[i].children[0].src.replace('favorite', 'not_favorite');
        }
        //вытаскивать айди, делать запрос на добавление в таблицу "избранное"
    });
}



        
