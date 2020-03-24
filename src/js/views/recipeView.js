import { elements } from './base';
import { Fraction } from 'fractional';

// This function format a given number to a fraction
const formatCount = count => {
    if (count) {
        // 3.5 => 7/2 => 3 1/2
        // 0.5 => 1/2
        // Split the count number in 2 strings part and convert them to int again
        const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10));

        if (!dec) return count;  // There are no fraction part

        if (int === 0) {
            const f = new Fraction(count);
            return `${f.numerator} / ${f.denominator}`;
        } else {
            const f = new Fraction(count - int);
            return `${int} ${f.numerator} / ${f.denominator}`;
        }
    }
    return '?';
};

// This function create a new ingredient markup
const createIngredient = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;

export const renderRecipe = recipe => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart-outlined"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
            </ul>

            <button class="btn-small recipe__btn">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;

    // Insert the markup in the dom
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

// Update the servings ingredients view
export const updateServingsIngredients = recipe => {
    // Update the servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    // Update the ingredients
    const ingElements = Array.from(document.querySelectorAll('.recipe__count'));

    ingElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    });
};