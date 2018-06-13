//UI for search

import {DOMelements as DOM, } from "./base";


//*******************search input*******************
export const getInput = () =>  DOM.searchInput.value;
export const clearSearchField = () => {DOM.searchInput.value = ""};



//******************show recipes resulting from search*********************** 

//we want all titles to take just 1 line and show up to 17 letters
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(` `).reduce( (acc, cur) => {
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(` `)}...`;
    }
    return title;

};

const AddRecipeList = el => {
    
    const markup = `,
        <li>
        <a class="results__link results__link--active" href="#${el.recipe_id}">
            <figure class="results__fig">
                <img src=${el.image_url} alt=${el.title}>
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(el.title)}</h4>
                <p class="results__author"${el.publisher}</p>
            </div>
        </a>
        </li>`;
    DOM.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const showSearchResults = (recipes, page=1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage; 
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(element => AddRecipeList(element) );
    showPageButtons(page, recipes.length , resPerPage);
};

const createPageButtons = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>
`;


const showPageButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createPageButtons(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createPageButtons(page, 'prev')}
            ${createPageButtons(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createPageButtons(page, 'prev');
    }
    DOM.searchResPages.insertAdjacentHTML('afterbegin', button);
};

//*******************clear recipes resulting from previous searches***************************** 
export const clearPrevResults = () => {  
    DOM.searchResList.innerHTML = "" ;
    DOM.searchResPages.innerHTML = "";
};



//*******************highlight selected recipe***************************** 
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

