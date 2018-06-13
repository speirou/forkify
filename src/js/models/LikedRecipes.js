
export default class LikedRecipes {
    constructor(){
        this.recipes = [];
    }

    addRecipe (recipe){
        this.recipes.push(recipe);
        this.persistData();
    }

    removeRecipe (recipeID){
        const i = this.recipes.findIndex( el => el.id === recipeID );
        this.recipes.splice(i, 1);
        this.persistData();
    }

    isLiked(recipeID){
        return this.recipes.findIndex( el => el.id === recipeID ) !== - 1;
    }

    persistData() {
        localStorage.setItem( "likedRecipes", JSON.stringify(this.recipes) );
    }

    readPersistData() {
        const storage = JSON.parse( localStorage.getItem("likedRecipes") ) ;
        if (storage) this.recipes = storage;
    }

}