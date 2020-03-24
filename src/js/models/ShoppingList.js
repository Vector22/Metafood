import uniqid from 'uniqid';

export default class ShoppingList {
    constructor() {
        // The array that will contains the list items
        this.items = [];
    }

    // Function that add an item to the list
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };

        this.items.push(item);
        return item;
    }

    // Function that delete an item from the list
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [1, 2, 3] splice(1,2) -> returns [2, 3] original array is [1]
        // [1, 2, 3] slice(1,2) -> returns 4 original array is [1, 2, 3]
        this.items.splice(index, 1);
        return this.items;
    }

    // Update shopping list item ingredient count
    updateCount(id, newcount) {
        return this.items.find(el => el.id === id).count = newcount;
    }
};