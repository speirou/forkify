
import {DOMelements as DOM, } from "./base";


const createLikedRecipe = (rec) => 
    ` <li>
        <a class="likes__link" href="#${rec.id}">
            <figure class="likes__fig">
                <img src=${rec.img} alt=${rec.title}>
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${rec.title}</h4>
                <p class="likes__author">${rec.publisher}</p>
            </div>
        </a>
    </li>`;


export const displayLikedRecipe = (recipe) => {
    DOM.likes.insertAdjacentHTML("beforeend", createLikedRecipe(recipe));
}

export const removeLikedRecipe = (recID) => {
    const item = document.querySelector(`[href*="${recID}"]`);
    item.parentNode.removeChild(item);
}

export const heartButton = (recipe, isliked) => {
    //icons.svg#icon-heart-outlined"
    let condition = isliked? "icon-heart" : "icon-heart-outlined";
    //console.log(condition);
    document.querySelector(".recipe__love use").setAttribute("href", `img/icons.svg#${condition}`);
}

export const toggleLikeMenu = (likelist) => {
    DOM.likesMenuIcon.style.visibility = likelist.length !== 0? "visible" : "hidden";
}