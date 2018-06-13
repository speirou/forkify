
export const DOMelements = {
    searchForm: document.querySelector(".search"),
    searchInput: document.querySelector(".search__field"),
    searchRes: document.querySelector(".results"),
    searchResList: document.querySelector(".results__list"), 
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    list: document.querySelector(".shopping__list"),
    likes: document.querySelector(".likes__list"),
    likesMenuIcon:  document.querySelector(".likes__field"),
};

export const LoadingSpinner = (parent) => {

    const loader = ` 
        <div class = "loader">
            <svg>
                <use href="img/icons.svg#icon-cw"> </use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const DelLoadingSpinner = () => {
    const loader = document.querySelector(".loader");
    if (loader) loader.parentNode.removeChild(loader);
};
