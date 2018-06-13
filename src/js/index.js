import Search from "./models/Search";
import Recipe from "./models/Recipe";
import ShoppingList from "./models/ShoppingList";
import LikedRecipes from "./models/LikedRecipes";
import {DOMelements as DOM, LoadingSpinner, DelLoadingSpinner} from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as ShoppingListView from "./views/shoppingListView";
import * as likedRecView from "./views/likedRecView";


// Global app controller

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */


const state = {};
//localStorage.removeItem("likedRecipes");

//*******************************  S E A R C H  ***************************************** */

const controlSearch = async () => {
    //1) get query from view
    const query = searchView.getInput();
    

    if (query){
        //2) add search object in state
        state.search = new Search(query);

        //3) prepare UI for results
        searchView.clearSearchField();
        searchView.clearPrevResults();
        LoadingSpinner (DOM.searchRes);

        try{
            //4) Search for recipes
            await state.search.searchResults();

            //5) Render results on UI
            DelLoadingSpinner();
            searchView.showSearchResults(state.search.recipes);
        }
        catch(error) {
            alert(`Search Error: ${error}`)
        };
    
    }
}


DOM.searchForm.addEventListener("submit", event => {
    event.preventDefault(); //so as to avoid reloading the page
    controlSearch();
});


DOM.searchResPages.addEventListener("click", event=>{
    let btn = event.target.closest(".btn-inline");
    if (btn) {
        searchView.clearPrevResults();       //clear results of old page to load the new page's data
        searchView.showSearchResults(state.search.recipes, parseInt(btn.dataset.goto, 10))
    }
});




//*******************************  G E T     R E C I P E S  ***************************************** */


const controlGetRecipe = async () => {
    //find id
    //console.log("bika stin controlgetrecipe");
    const recipeId = window.location.hash.replace('#', '');

    if (recipeId){

        //create state object
        state.curr_recipe = new Recipe(recipeId); 
       
        
        //prepare UI for results
        recipeView.clearPrevRecipe();
        if (state.search) searchView.highlightSelected(recipeId);
        LoadingSpinner(DOM.recipe);

        try{
            
            await state.curr_recipe.getRecipe();
           
            //convert ingredients and calculate time and servings
            state.curr_recipe.convertIngredients();
            state.curr_recipe.calcTime();
            state.curr_recipe.calcServings();
            //console.log(state.curr_recipe);

            //display new recipe data
            DelLoadingSpinner();
            recipeView.displayRecipe(state.curr_recipe, state.likes.isLiked(state.curr_recipe.id));
        }
        
        catch (error) { /*alert(`smth is wrong: ${error}`)*/ };
        
    }
}


//event listeners for changing recipe
["hashchange", "load"].forEach(  event => window.addEventListener(event, controlGetRecipe)  );


//event listeners for changing servings buttons
DOM.recipe.addEventListener('click', event => {

    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.curr_recipe.servings > 1) {
            state.curr_recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.curr_recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.curr_recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.curr_recipe);
    } 
});






//*******************************  S H O P P I N G      L I S T  ***************************************** */

const controlShoppingList = () => {
    //create list object if it doesnt exist already
    if (!state.list) state.list = new ShoppingList ();
    /*else {
        state.list.items.forEach( el => { 
            ShoppingListView.deleteItem(el.id) }); 
    }*/
    //console.log(state.list.items);
    if (state.list.items.length === 0 ){ 
        let btn = document.querySelector(".del"); 
        if (btn) ShoppingListView.removeClearAllBtn(btn);
    }
    

    //add current recipe's ingredients 
    state.curr_recipe.ingredients.forEach (element => {
            state.list.addItem(element.count, element.unit, element.ingredient);
    })
    

    //clear shopping list from doubles
    state.list.items.forEach( (el, index ) => { 
        for (let i = index + 1; i< state.list.items.length; i++){
            if (el.ingredient == state.list.items[i].ingredient){  
                //if the item already exists update quantity
                
                
                let total = el.count + state.list.items[i].count;

                state.list.deleteItem(state.list.items[i].id);
                state.list.updateCount(el.id, total);
                //console.log(`${el.ingredient} with total amount ${total}`);
                //ShoppingListView.deleteItem(el.id);
            }
        }
     });     
   
    //display cleared list
    //console.log(state.list.items);
    state.list.items.forEach( el => { 
        ShoppingListView.displayItem(el) });   
    
    if (state.list.items.length > 1) ShoppingListView.dipslayClearAllBtn();
    
}


DOM.recipe.addEventListener("click", event => {

    if (event.target.matches(".list__btn, .list__btn * ")) {
        controlShoppingList();
    }

} );


//event listeners for deleting and updating elements
DOM.list.addEventListener("click", event => {
    
    
    let item = event.target.closest(".shopping__item");
    // console.log(event.target);
    // console.log(item);

    if (event.target.matches(".shopping__delete, .shopping__delete *")) {
        //delete from list
        state.list.deleteItem(item.dataset.itemid);
        //delete from UI
        ShoppingListView.deleteItem(item.dataset.itemid);
    }
    else if (event.target.matches(".shopping__count-value")){
        state.list.updateCount(item.dataset.itemid, parseFloat(event.target.value, 10) );
    }

} );

DOM.list.addEventListener("click", event => {
   
    if ( event.target.matches(".del, .del *") ) {
        
        state.list.items.forEach( el => { ShoppingListView.deleteItem(el.id) }); 
        state.list.emptyAll();
        let btn = document.querySelector(".del"); 
        if (btn) ShoppingListView.removeClearAllBtn(btn);
        console.log(state.list.items); 
    }
    
})


//*******************************  L I K E S  ***************************************** */


const controlLikes = () => {
    //state object update
    if (!state.likes) state.likes = new LikedRecipes ();

    //add to the list of liked recipes
    if (!state.likes.isLiked(state.curr_recipe.id)){
        state.likes.addRecipe(state.curr_recipe);
        state.likes.persistData();
        likedRecView.displayLikedRecipe(state.curr_recipe);

    }
    else{ //remove it from liked recipes
        state.likes.removeRecipe(state.curr_recipe.id);
        likedRecView.removeLikedRecipe(state.curr_recipe.id);

    }
    //console.log(state.likes.recipes);
    // console.log(state.curr_recipe.title);
    // console.log(state.likes.isLiked(state.curr_recipe.id));
    likedRecView.heartButton(state.curr_recipe, state.likes.isLiked(state.curr_recipe.id));
    likedRecView.toggleLikeMenu(state.likes.recipes);
} 


//event listener for loading page event...handles the reload of liked recipes from localstorage
window.addEventListener("load", () => {
    
    //display recipe 
    controlGetRecipe();
    
    //create again our likedrecipes and shoppinglist objects
    state.likes = new LikedRecipes (); 
    state.list = new ShoppingList ();
    
    //retrive data from local storage
    state.likes.readPersistData();
    state.list.getStorage();

     //handle liked recipes menu appearence
     likedRecView.toggleLikeMenu(state.likes.recipes);

    //display again the liked recipes and shopping list
    state.likes.recipes.forEach( (el) => likedRecView.displayLikedRecipe(el) ); 
    
    
    console.log("after reloadeing lets find the error");
    console.log(state.curr_recipe);
    //controlShoppingList();
    if (state.list.items.length != 0 ){ 
        let btn = document.querySelector(".del"); 
        if (btn) ShoppingListView.removeClearAllBtn(btn);
    }
     state.list.items.forEach( el => ShoppingListView.displayItem(el) );   
    if (state.list.items.length > 1) ShoppingListView.dipslayClearAllBtn();
})


DOM.recipe.addEventListener("click", event => {
    if (event.target.matches(".recipe__love, .recipe__love *")) 
        controlLikes(state.curr_recipe);
})


DOM.likes.addEventListener("click", event => {
    if (event.target.matches(".likes__link, .likes__link *")) {
        //let requestedRec = event.target.closest(".likes__link");
        window.addEventListener("hashchange", controlGetRecipe);
    }
    
})

