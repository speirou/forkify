
import {DOMelements as DOM, } from "./base";
import {Fraction} from "fractional";




const createRecipe =  (curRecipe, isliked) => {
    let markups =[];
    let markupend="";
    let markupmain="";

    markupmain = `
        <figure class="recipe__fig">
        <img src=${curRecipe.img} alt=${curRecipe.title} class="recipe__img">
        <h1 class="recipe__title">
            <span>${curRecipe.title}</span>
        </h1>
    </figure>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${curRecipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${curRecipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${isliked? "": "-outlined"}"></use>
            </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
    `;

    curRecipe.ingredients.forEach((element, i) => {
        markups[i] = `    
                    <li class="recipe__item">
                        <svg class="recipe__icon">
                            <use href="img/icons.svg#icon-check"></use>
                        </svg>
                        <div class="recipe__count">${formatCount(element.count)}</div>
                        <div class="recipe__ingredient">
                            <span class="recipe__unit">${element.unit}</span>
                            ${element.ingredient}
                        </div>
                    </li>`
        //return markups;        
    }); 

    
        markupend = `
        <button class="btn-small list__btn">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${curRecipe.publisher}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href=${curRecipe.url} target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
    `
    return [markupmain, ... markups, markupend];
};


export const displayRecipe = (curRecipe, isliked) => {
    let totalMarkup = "";
    totalMarkup = createRecipe(curRecipe, isliked).join(" ");
    DOM.recipe.insertAdjacentHTML("afterbegin", totalMarkup);

};



const formatCount = (count) => {
    if (count){
        
        const newCount = Math.round(count * 100) / 100;
        const [int, dec] = newCount.toString().split(".").map(el => parseInt(el, 10));

        // count = 2.5 --> 5/2 --> 2 1/2
        // count = 0.5 --> 1/2

        if (!dec) return newCount;

        if (int === 0) {
            const fr = new Fraction(newCount);
            return `${Math.round( fr.numerator * 100)/100}/${Math.round(fr.denominator*100)/100}`;
        } else {
            const fr = new Fraction(newCount - int);
            return `${int}  ${Math.round( fr.numerator * 100)/100}/${Math.round(fr.denominator*100)/100}`;
        }
    }
    else return "?";
}



export const clearPrevRecipe = () => {
    DOM.recipe.innerHTML = "";
};



export const updateServingsIngredients = (newrecipe) => {
    //update servings
    document.querySelector(".recipe__info-data--people").textContent = newrecipe.servings;

    //update ingredients
    const allRecipeIngredients = Array.from(document.querySelectorAll(".recipe__count"));
    allRecipeIngredients.forEach( (el, i) => {
        el.textContent = formatCount(newrecipe.ingredients[i].count);
    });

};