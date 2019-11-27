/* Define the Search model class */
import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        // We use a custom api made by jonas
        // Instead of food2fork api to avoid api key and
        // some proxy workaround
        const url = 'https://forkify-api.herokuapp.com/api/search?';

        try {
            // fetch the results
            const res = await axios(`${url}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch(e) {
            // statements
            console.log(e);
        }
    }
}
