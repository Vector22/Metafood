import { elements } from './base';
import { limitRecipeTitle } from './searchView';

// Toggle the appearence of the like button(heart icon)
export const toggleLikeButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute(
        'href',
        `img/icons.svg#${iconString}`
    );

};

// Toggle like menu heart icon
export const toggleLikeMenu = numLikes => {
    // If there are at less one liked recipe, the heart icon is showed
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// Render like item
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

// Remove liked recipe from the list
export const dislike = id => {
    // `.likes__link[href*="${id}"]`
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) {
        el.parentElement.removeChild(el);
    }
};