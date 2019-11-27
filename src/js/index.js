// Global app controller
import Search from './models/Search';
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

// Executed when we submit the search form
const controlSearch = async () => {
    console.log("I'm searching... ");
    // 1- Get query from view
    const query = searchView.getInput();

    if(query) {
        // 2- Instantiate a Search object and add it to state
        state.search = new Search(query);

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
    }
};

// Add an event listenner on the search button when whe
// submit the form
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
