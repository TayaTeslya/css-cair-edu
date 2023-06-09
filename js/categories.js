/*
Данный файл является скриптом фильтрации и поиска уровней
Переменные:
    categoriesButton - объект кнопки вывода списка категорий
    categoriesList - объект списка категорий
    searchLevel - объект поля ввода поиска уровней
    selectedCategory - выбранная категория игр (по умолчанию - все)
Функции:
    categoriesButton.addEventListener - событие клика по кнопке вывода списка категорий; меняет видимость объекта списка категорий
    changeCategory - функция смены выбранной категории
    searchLevel.addEventListener - событие ввода в поле ввода поиска; вызов функции вывода уровней с передачей текста поля поиска
*/

const categoriesButton = document.getElementById("categories"); // кнопка вывода списка категорий
const categoriesList = document.getElementById("categories-list"); // объект списка категорий
const searchLevel = document.getElementById('search-level'); // кнопка поиска уровней

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
        Начатые
    </p>
    <p>
        Не начатые
    </p>
    `;
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
            changeCategory();
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
            if (userInfo.isStaff) setLevels((element) => !element.isChecked); 
            else setLevels((element) => element.favorite); 
            break;
        case 4: setLevels((element) => element.maxScore === element.maxScoreUser); break; // "Пройденные"
        case 5: setLevels((element) => element.maxScoreUser !== null && element.maxScoreUser < element.maxScore); break;  // "Начатые"
        case 6: setLevels((element) => element.maxScoreUser === null); break;  // "Не начатые"
        default: setLevels((element) => true); break; 
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