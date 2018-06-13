
import axios from "axios";
import {proxy, key} from "../config";


export default class Recipe {
    constructor (id){
        this.id=id;
    }

    async getRecipe (){
        try {
            
            const recipe = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = recipe.data.recipe.title;
            this.publisher = recipe.data.recipe.publisher;
            this.img = recipe.data.recipe.image_url;
            this.url = recipe.data.recipe.source_url;
            this.ingredients = recipe.data.recipe.ingredients;

            //const data = await results.json() is not needed because results are already encoded in JSON
            //console.log (recipe);
        }
        catch (error) {
            alert ("something is wrong!!!");
        }
    }

    calcTime(){
        //lets assume that every 3 ingedients take 15 minutes to prepare
        const numIngred = this.ingredients.length;
        const periods = Math.ceil( numIngred / 3);
        this.time = periods * 15;
    }

    calcServings(){
        const servings = Math.round (Math.random() * 7 + 2);   //random number 2-8 
        this.servings = servings;
    }

    convertIngredients (){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {

            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //get rid of parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count, unit, ingredients
            const arrIng = ingredient.split(" ");
            const unitIndex = arrIng.findIndex(el => units.includes(el));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;

        } );
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        
        //update servings
        const newServings = ( type==="inc"? this.servings + 1 : this.servings - 1 ) ;

        //update ingredients
        this.ingredients.forEach (el => el.count =  Math.round( newServings / this.servings *10 ) /10 * el.count )

        this.servings = newServings;
    }

}