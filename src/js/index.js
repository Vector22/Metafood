// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
/*
    Global state of the app
    - search object
    - current recipe object
    - shopping list object
    - liked receipes
*/

const state = {};

/* ====================
*                      *
*   SEARCH CONTROLLER  *
*                      *
* =================== */

// Executed when we submit the search form
const controlSearch = async () => {
    console.log("I'm searching... ");
    // 1- Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2- Instantiate a Search object and add it to state
        state.search = new Search(query);

        try {
            // 3- Prepare the UI for the result
            searchView.clearInput();
            searchView.clearResults();
            renderLoader(elements.searchRes);

            // 4- Search for recipes
            await state.search.getResults();
            // 4-1) Clear the loader
            clearLoader();

            // 5- Render result on the UI
            searchView.renderResults(state.search.result);
        } catch (e) {
            alert('Hoops !!! An error has occured when retrieve data...');
            // Anyways clear the loader
            clearLoader();
        }
    }
};

// Add an event listenner on the search button when whe
// submit the form
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Add an event listenner on the pagination button
elements.searchResPages.addEventListener('click', e => {
    // Look for the nearest element with the macthing attribut(class, id...)
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);

        // Prepare the UI for the next page display
        searchView.clearResults();

        // Display the requested page with it's recipes
        searchView.renderResults(state.search.result, goToPage);
    }
});


/* ====================
*                      *
*   RECIPE CONTROLLER  *
*                      *
* =================== */

// Some tests
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // 1- Prepare UI for change

        // 2- Create Recipe object
        state.recipe = new Recipe(id);

        try {
            // 3- Get recipe data and parse ingredients
            // We want this happens asynchronous way: run on the background
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe.ingredients);

            // 4- Calculate cooking time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5- Render the recipe
            console.log(state.recipe);
        } catch (e) {
            // Alert the user
            alert('Something got wrong while processing recipe...');
        }
    }
};

// Do something when the url's hach variable change
// Note that this change happen each time we click
// on a recipe in the left liste

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipe));
