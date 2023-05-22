const categoriesButton = document.getElementById("categories");
const categoriesList = document.getElementById("categories-list");

let selectedCategory = 0; // выбранная категория игр (по умолчанию - все)

categoriesButton.addEventListener('click', (event) => {
    categoriesList.classList.toggle('unvisible');
    console.log('loh');
});

categoriesList.addEventListener('mouseenter', (event) => { // удаление класса "выбрано" при наведении на категории
    categoriesList.children[selectedCategory].classList.remove('select-category');
});

categoriesList.addEventListener('mouseleave', (event) => { // добавление класса "выбрано" на выбранный элемент при сведении мыши с категорий
    categoriesList.children[selectedCategory].classList.add('select-category');
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