/* Define the Recipe model class */

import axios from 'axios';


export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        const url = "https://forkify-api.herokuapp.com/api/get?";
        try {

            const result = await axios(`${url}rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch(e) {
            // statements
            console.log(e);
            // Alert the user that an error has occured
            alert('Something get wrong...');
        }
    }

    // Calculate the time to cook a recipe
    // We suppose that 3 ingredients take 10
    // minutes for be prepared
    calcTime() {
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 10;
    }

    // Served for 4 persons
    calcSevings() {
        this.servings = 4;
    }

    //

}
