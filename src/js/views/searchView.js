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

// Render all founded recipes
export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
};

// Limit a recipe title
const limitRecipeTitle = (title, limit=17) => {
    // Hold the new trucated array by words
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
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
    elements.searchResList.innerHTML = '';
};
