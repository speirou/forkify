
import {DOMelements as DOM, } from "./base";


const createItem = (el) =>  
    `   <li class="shopping__item" data-itemid = ${el.id}>
            <div class="shopping__count">
                <input type="number" value=${el.count} step=${updateCount(el.count)} class="shopping__count-value">
                <p>${el.unit}</p>
            </div>
            <p class="shopping__description">${el.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;


export const displayItem = (item) => {
        DOM.list.insertAdjacentHTML("beforeend", createItem (item));
};

export const dipslayClearAllBtn = () => {
    DOM.list.insertAdjacentHTML("beforeend", `
                <button class="del">
                    <span>Clear all items</span>
                    <svg class="my_btn">
                        <use href=""></use>
                    </svg>
                </button>`);
}

export const removeClearAllBtn = (btn) => {
    btn.parentElement.removeChild(btn);
}

export const deleteItem = (itemID) => {
    const item = document.querySelector(`[data-itemid="${itemID}"]`);
    if (item) item.parentElement.removeChild(item);
}

const updateCount = (oldCount) => {
    let step;
  //  console.log(oldCount);

    if (! (oldCount % 1 === 0) ) {
        let decimal = oldCount - Math.floor(oldCount);
        if (decimal === 0.5) {step = 0.5}
        else step = 0.25;
    }
    else {
        if ( oldCount < 10 ) { step = 1; }
        else if ( oldCount < 100 ) { step = 10; }
        else if ( oldCount < 1000 ) { step = 100; }
    }
   // if (parseFloat(oldCount) < 1 ) { step = 0.05; }
    

    return step;
} 