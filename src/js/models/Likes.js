export default class Likes {
    constructor() {
        // Liked reciipe array;
        this.likes = [];
    }

    // Add recipe to likes list
    addLike(id, title, author, img) {
        const like = { id, title, author, img };

        this.likes.push(like);

        // Persist data in localstorage
        this.persistData();
        return like;
    }

    // Delete a recipe from the likes list
    dislike(id) {
        const index = this.likes.findIndex(el => el.id === id);

        this.likes.splice(index, 1);

        // Persist data in localstorage
        this.persistData();
        return this.likes;
    }

    // Check if a recipe is liked or not
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    // Return the number of liked recipes
    getNumLikes() {
        return this.likes.length;
    }

    // Persist data to the localStorage
    persistData() {
        // Convert the likes array in string before save
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    // Restore likes value from the localStorage
    restoreLikes() {
        // Convert back the format of the value to json
        const storageLikes = JSON.parse(localStorage.getItem('likes'));

        if (storageLikes) this.likes = storageLikes;
    }
};