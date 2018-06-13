//The purpose of this class is to receive the requested search subject from the user 
//and to perform the API call



import axios from "axios";   ///axios similar to fetch for api calls
import {proxy, key} from "../config";

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async searchResults (){

        try {
            
            const results = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipes = results.data.recipes;
            //const data = await results.json() is not needed because results are already encoded in JSON
            console.log (this.recipes);
    
        }
        catch (error) {
            alert (error);
        }

    }
 
 }





