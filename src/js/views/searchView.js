import { elements } from './base';

// Return the value of the search input
export const getInput = () => elements.searchInput.value;

// Render the recipes on the UI

// Render one recipe
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    // Insert the generated markup in the DOM
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// Create buttons for switching recipes pages
// Type can be previous or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}"
    data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

// Render the buttons for switching recipes pages
const renderButtons = (page, numResults, resPerPage) => {
    // Total number of pages
    const pages = Math.ceil(numResults / resPerPage);
    // The button to create
    let button;

    // Render the buttons according to the page number
    if (page === 1 && pages > 1) {
        // The first page
        // Then render only the button to the next page
        button = createButton(page, 'next');
    } else if (page === pages) {
        // The last page
        // Then render only the button to the previous page
        button = createButton(page, 'prev');
    } else if (page < pages) {
        // Intermediary pages
        // Render two buttons, previous page and next page
        button = `
            ${button = createButton(page, 'prev')}
            ${button = createButton(page, 'next')}
        `;
    }

    // Add the created button to the dom
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// Render all founded recipes
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Variables that store the index of the displayed recipes
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // Display only resPerPage recipes on each page
    recipes.slice(start, end).forEach(renderRecipe);

    // Render the pagination button
    renderButtons(page, recipes.length, resPerPage)
};

// Limit a recipe title
const limitRecipeTitle = (title, limit = 17) => {
    // Hold the new truncated array by words
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            // acc stand for accumulator & cur for current
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // Return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;

};

// Clear the search input field
export const clearInput = () => {
    elements.searchInput.value = '';
};

// Clean the results section
export const clearResults = () => {
    // Remove all the recipes
    elements.searchResList.innerHTML = '';
    // Remove the navigation page button
    elements.searchResPages.innerHTML = '';
};

// Give a silver background to a selected recipe on the list
export const highLightSelected = id => {
    // Remove the previous selected class
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};
