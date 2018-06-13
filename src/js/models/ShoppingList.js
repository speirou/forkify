import uniqid from "uniqid";

export default class ShoppingList {
    constructor (){
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        this.persistData();
    }

    deleteItem (ID){
        const i = this.items.findIndex (el => el.id === ID );
        this.items.splice(i,1);
        this.persistData();
    }

    emptyAll () {
        this.items = [];
        console.log('empty', this.items);
        this.persistData();
    }

    updateCount(ID, newCount){
        this.items.find(el=> el.id===ID).count = newCount;
    }

    persistData(){
        localStorage.setItem("shopping_list", JSON.stringify(this.items));
    }

    getStorage(){
        const storage = JSON.parse(localStorage.getItem("shopping_list"));
        if (storage) this.items = storage;
    }
}
