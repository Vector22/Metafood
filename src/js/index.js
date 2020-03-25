// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import ShoppingList from './models/ShoppingList';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
/*
    Global state of the app
    - search object
    - current recipe object
    - shopping list object 
    - liked receipes
*/
// le monde est bon 

const state = {};

/* ====================
*                      *
*   SEARCH CONTROLLER  *
*                      *
* =================== */

// Executed when we submit the search form
const controlSearch = async () => {
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

const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // 1- Prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected list item
        if (state.search) searchView.highLightSelected(id);

        // 2- Create Recipe object
        state.recipe = new Recipe(id);

        try {
            // 3- Get recipe data and parse ingredients
            // We want this happens asynchronous way: run on the background
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 4- Calculate cooking time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5- Render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (e) {
            // Alert the user
            alert('Something got wrong while processing recipe...');
            console.log(e);
        }
    }
};

// Do something when the url's hach variable change
// Note that this change happen each time we click
// on a recipe in the left liste

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipe));


/* =========================
*                            *
*   SHOPPING LIST CONTROLLER *
*                            *
* ========================== */

const controlShoppingList = () => {
    // Create a new list if not exist yet
    if (!state.shoppingList) state.shoppingList = new ShoppingList();

    // Add each ingredient to the shopping list
    state.recipe.ingredients.forEach(el => {
        const item = state.shoppingList.addItem(el.count, el.unit, el.ingredient);
        shoppingListView.renderItem(item);
    });
};

// Handle update and delete item from shoppingList ingredient
elements.shopping.addEventListener('click', el => {
    // Retrieve the id of the item
    const id = el.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from the state
        state.shoppingList.deleteItem(id);
        // Delete from the UI
        shoppingListView.deleteItem(id);
        // Handle the update button
    } else if (el.target.matches('.shopping__count-value')) {
        const val = parseFloat(el.target.value, 10);
        state.shoppingList.updateCount(id, val);
    }
});


/* =========================
*                            *
*   LIKES CONTROLLER         *
*                            *
* ========================== */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const recipeId = state.recipe.id;

    if (!state.likes.isLiked(recipeId)) {
        // [User has not liked the current recipe yet]

        // Add like to the state
        const newLike = state.likes.addLike(
            recipeId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeButton(true);

        // Add like to UI list
        likesView.renderLike(newLike);
    } else {
        // [User has liked the current recipe]

        // Remove like from the state
        state.likes.dislike(recipeId);

        // Toggle the like button
        likesView.toggleLikeButton(false);

        // Remove like from UI list
        likesView.dislike(recipeId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


/* ================================================
*                                                  *
*     HANDLE RECIPE'S BUTTONS CLICK CONTROLLER     *
*                                                  *
* =============================================== */

// Restore Lliked recipe
window.addEventListener('load', () => {
    // Create a new likes array
    state.likes = new Likes();
    // Restore the likes from the localStorage
    state.likes.restoreLikes();
    // Show / Hidde the menu like heart icon
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    // Render the existing likes 
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handle recipe buttons ( + & - & like & shoppingList) click
elements.recipe.addEventListener('click', el => {
    if (el.target.matches('.btn-decrease, .btn-decrease *')) {
        // The event is triggered by - button
        if (state.recipe.servings > 1) {
            // One person at less is required
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        } else {
            alert('Impossible to serve this recipe to less than one person');
        }
    } else if (el.target.matches('.btn-increase, .btn-increase *')) {
        // The event is triggered by + button
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (el.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        // Handle shopping cart button
        controlShoppingList();
    } else if (el.target.matches('.recipe__love, .recipe__love *')) {
        // Like contoller
        controlLike();
    }
});
