const TYPES = {
    BURGER: 'burger',
    STUFFING: 'stuffing',
    TOPPING: 'topping',
}

const SIZES = {
    SMALL: {
        type: TYPES.BURGER,
        price: 50,
        cal: 20,
    },
    LARGE: {
        type: TYPES.BURGER,
        price: 100,
        cal: 40,
    }
}

const STUFFING = {
    CHEESE: {
        type: TYPES.STUFFING,
        price: 10,
        cal: 20,
    },
    SALAD: {
        type: TYPES.STUFFING,
        price: 20,
        cal: 5,
    },
    POTATO: {
        type: TYPES.STUFFING,
        price: 15,
        cal: 10,
    },
}

const TOPPINGS = {
    PEPPER: {
        type: TYPES.TOPPING,
        price: 15,
        cal: 0,
    },
    MAYO: {
        type: TYPES.TOPPING,
        price: 20,
        cal: 5,
    },
}

class Ingredient {
    constructor( {type, price, cal} ) {
        this._type = type;
        this._price = price;
        this._cal = cal;
    }
    getPrice() {
        return this._price;
    }
    getCal() {
        return this._cal;
    }
}

class Hamburger {
    constructor(size, stuffing) {
        this._size = size;
        this._stuffing = stuffing;
        this._toppings = [];
    }
    addTopping(topping) {
        this._toppings.push( topping );
    }
    removeTopping(topping) {
        const removedTopping = this._toppings.findIndex((item) => item === topping);
        if (removedTopping !== -1) {
            this._toppings = this._toppings.filter( (item, i) => i !== removedTopping );
        }
    }
    getToppings() {
        return this._toppings;
    }
    getSize() {
        return this._size;
    }
    getStuffing() {
        return this._stuffing;
    }
    setStuffing(stuffing){
        this._stuffing = stuffing;
    }
    calculatePrice() {
        return this._size.getPrice() + this._stuffing.getPrice() + this._toppings.reduce((acc, item) => acc + item.getPrice(), 0)
    }
    calculateCalories() {
        return this._size.getCal() + this._stuffing.getCal() + this._toppings.reduce((acc, item) => acc + item.getCal(), 0)
    }
}
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const $selectedSize = document.querySelector("input[name='size']:checked");
    const $selectedStuffing = document.querySelector("input[name='stuffing']:checked");

    let hamburgerSize;
    let hamburgerStuffing;

    if ($selectedSize.id === 'small') {
        hamburgerSize = new Ingredient(SIZES.SMALL);
    } else {
        hamburgerSize = new Ingredient(SIZES.LARGE);
    }

    if ($selectedStuffing.id === 'cheese') {
        hamburgerStuffing = new Ingredient(STUFFING.CHEESE);
    } else if ($selectedStuffing.id === 'salad'){
        hamburgerStuffing = new Ingredient(STUFFING.SALAD);
    } else {
        hamburgerStuffing = new Ingredient(STUFFING.POTATO);
    }

    const createdHamburger = new Hamburger(hamburgerSize, hamburgerStuffing);

    const $pepperTopping = document.getElementById('pepper');
    const $mayoTopping = document.getElementById('mayo');

    if ($pepperTopping.checked === true){
        createdHamburger.addTopping(new Ingredient(TOPPINGS.PEPPER));
    }
    if ($mayoTopping.checked === true){
        createdHamburger.addTopping(new Ingredient(TOPPINGS.MAYO));
    }
    console.log(createdHamburger);

    document.getElementById('price').innerHTML = createdHamburger.calculatePrice();
    document.getElementById('cal').innerHTML = createdHamburger.calculateCalories();
});
