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
        } catch (e) {
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
    calcServings() {
        this.servings = 4;
    }

    // Tries to harmonize the units of measurement of
    // ingredients
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce',
            'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp',
            'cup', 'pound'];
        // Fix the case where units are kg or g
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {

            // 1- Harmonize units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2- Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3- Parse ingredients into count, unit and ingredient
            // First we convert the ingredient into array
            const arrIng = ingredient.split(' ');

            // Try to find the index of ingredient unit inside the parsed array
            // If one word of unitShort is present in arrIng return it index
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            // The new formated ingredient object
            let objectIng;

            if (unitIndex > -1) {
                // There is an unit (and many situations can happens)
                // Ex: 2 1/2 cups, arrCount = [2, 1/2]
                // Ex: 4 spoons, arrCount = [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objectIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but 1st elt is number
                objectIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                // We will set up a new one
                objectIng = {
                    count: 1,
                    unit: '',
                    // ingredient : ingredient
                    ingredient  // The ES6 way
                };
            }

            return objectIng;
        });

        this.ingredients = newIngredients;
    }

    // Update the ingredients list when we click on
    // + or - sign om the UI
    updateServings(type) {
        // Update serving ('dec stand for decrease, inc: increase')
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Update ingredients
        this.ingredients.forEach(ingre => {
            ingre.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }

}
