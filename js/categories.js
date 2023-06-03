const categoriesButton = document.getElementById("categories"); // кнопка вывода списка категорий
const categoriesList = document.getElementById("categories-list"); // объект списка категорий

let selectedCategory = 0; // выбранная категория игр (по умолчанию - все)

if (userInfo.isStaff) { // категории для администратора
    categoriesList.innerHTML += `
    <p>
        На проверке
    </p>`;
}
else { // категории для ученика
    categoriesList.innerHTML += `
    <p>
        Избранное
    </p>
    <p>
        Пройденные
    </p>
    <p>
        Непройденные
    </p>`;
}

categoriesButton.addEventListener('click', (event) => { // событие клика по кнопке категорий
    categoriesList.classList.toggle('unvisible'); // отображение списка категорий
});

for (let i = 0; i < categoriesList.children.length; i++) { // добавление событий на каждую категорию в списке категорий
    categoriesList.children[i].addEventListener('click', (event) =>  { // событие клика по категории
        selectedCategory = i;
        if (categoriesList.children[i].textContent.trim() === 'Все') {
            categoriesButton.children[0].textContent = 'Категории';
            categoriesButton.classList.remove('white-category');
            currentLevels = levels;
            setLevels((element) => true); // отображение всех уровней
        } else {
            categoriesButton.children[0].textContent = categoriesList.children[i].textContent.trim();
            categoriesButton.classList.add('white-category');
            changeCategory(); // вызов функции отображения уровней по категории
        }
        categoriesList.classList.add('unvisible'); // скрытие списка категорий
    });
}

categoriesList.addEventListener('mouseenter', (event) => { // удаление класса "выбрано" с выбранной категории при наведении на список категорий
    categoriesList.children[selectedCategory].classList.remove('select-category');
});

categoriesList.addEventListener('mouseleave', (event) => { // добавление класса "выбрано" на выбранную категорию при сведении мыши со списка категорий
    categoriesList.children[selectedCategory].classList.add('select-category');
});

/**
 * функция формирования условия для вывода уровней с определенной категорией
 */
function changeCategory() {
    searchLevel.value = '';
    currentLevels = levels;
    switch (selectedCategory) {
        case 1: setLevels((element) => !element.author); break; // "Основные"
        case 2: setLevels((element) => element.author); break; // "Пользовательские"
        case 3: // "Избранное" для ученика, "На проверке" для администратора
            if (userInfo.isStaff) setLevels((element) => !element.checked); 
            else setLevels((element) => element.favorite); 
            break;
        case 4: setLevels((element) => element.maxScore === element.maxScoreUser); break; // "Пройденные"
        case 5: setLevels((element) => element.maxScore !== element.maxScoreUser); break;  // "Непройденные"
    }
}