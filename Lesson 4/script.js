const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

class GoodsItem {
    constructor(title, price, quantity, id) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
    }

    render() {
        return `<div data-id="${this.id}" class="goods-item"><h3>${this.title}</h3><p>$${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor(cart) {
        this.goods = [];
        this.filtered = [];
        this._cart = cart;
        this._element = document.querySelector('.goods-list');
        this._element.addEventListener('click', this._onClick.bind(this))
    }

    filter(searchString) {
        searchString = searchString.trim();

        if (searchString.length === 0) {
            this.filtered = this.goods;
            this.render();
            return;
        }
        const reg = new RegExp(searchString, 'i');
        this.filtered = this.goods.filter((good) => reg.test(good.title));
        this.render();
    }

    fetchGoods() {
        fetch(`${API_URL}catalogData.json`)
            .then((response) => {
                return response.json();
            })
            .then((request) => {
                this.goods = request.map(good => ({title: good.product_name, price: good.price, id: good.id_product, quantity: 1}));
                this.filtered = this.goods;
                this.render()
                console.log(this.goods)
            })
            .catch(() => {
                console.log('ERROR')
            })
    };

    _onClick(e) {
        const id = e.target.getAttribute('data-id');
        console.log(id)
        if (id) {
            fetch(`${API_URL}addToBasket.json`)
                .then(() => {
                    console.log(id, this.goods)
                    this._cart.add(this.goods.find((good) => good.id == id))
                })
        }
    }

    render() {
        let listHtml = '';
        this.filtered.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price, good.quantity, good.id);
            listHtml += goodItem.render();
        });
        this._element.innerHTML = listHtml;
    };
}

//=======================CART

class CartItem {
    constructor(title, price, quantity, id) {
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.id = id;
    }
    render() {
        return `<div data-id="${this.id}" class="cart-item"><h4>${this.title}</h4><p>Цена: $${this.price}</p><p>Количество: ${this.quantity}</p></div>`;
    }
}

class CartList {
    constructor() {
        this.cartTotalPrice = 0;
        this.cartItemsAmount = 0;
        this.cartGoods = [];
        this._button = document.querySelector('.cart-button');
        this._cartEl = document.querySelector('.cart-main');
        this._button.addEventListener('click', this._onToggleCart.bind(this));
        this._cartEl.addEventListener('click', this._onClick.bind(this))
    }

    add(good) {
        this.cartGoods.push(good);
        this.render();
    }

    _onClick(e) {

        const id = e.target.getAttribute('data-id');
        fetch(`${API_URL}deleteFromBasket.json`)
            .then(() => {
                const index = this.cartGoods.findIndex((good) => good.id == id);
                this.cartGoods.splice(index, 1);
                this.render();
            })
        console.log(id)
    }

    _onToggleCart() {
        this._cartEl.classList.toggle('active');
        this._button.classList.toggle('cart-button_active')
    }

    FetchCart() {
        fetch(`${API_URL}getBasket.json`)
            .then((response) => {
                return response.json();
            })
            .then((request) => {
                this.cartGoods = request.contents.map(good => ({title: good.product_name, price: good.price, id: good.id_product, quantity: good.quantity}));
                this.cartTotalPrice = request.amount;
                this.cartItemsAmount = request.countGoods;
                this.render()
                this.totalPrice()
                this.totalAmountOfItems()
            })
            .catch(() => {
                console.log('ERROR')
            })
    }

    render () {
        let cartlist = '';
        this.cartGoods.forEach(good => {
            const goodItem = new CartItem(good.title, good.price, good.quantity, good.id);
            console.log(good.title)
            cartlist += goodItem.render();
        });
        document.querySelector('.cart-items').innerHTML = cartlist;
    }
    totalPrice() {
        document.getElementById('totalPrice').innerHTML = `${this.cartTotalPrice}$`;
    };
    totalAmountOfItems() {
        document.getElementById('totalAmount').innerHTML = `${this.cartItemsAmount}`;
    }


}
//=============================================
const cart = new CartList();
const list = new GoodsList(cart);
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', () => {
    list.filter(searchInput.value);
})

list.fetchGoods();
cart.FetchCart();
//===========================================FORM VALIDATION

const form  = document.getElementById('registration-form');
const name = document.getElementById('name');
const surname = document.getElementById('surname');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    checkInput();
});

function checkInput() {
    //Получаем значение инпутов и удаляем пробелы
    const nameValue = name.value.trim();
    const surnameValue = surname.value.trim();
    const phoneValue = phone.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (nameValue === '') {
        setErrorFor(name, 'Поле не может быть пустым!');
    } else if (!isName(nameValue)) {
        setErrorFor(name, 'Имя введено не корректно');
    } else {
        setSuccessFor(name);
    }

    if (surnameValue === '') {
        setErrorFor(surname, 'Поле не может быть пустым!');
    } else if (!isName(surnameValue)) {
        setErrorFor(surname, 'Фамилия введена не корректно');
    } else {
        setSuccessFor(surname);
    }

    if (phoneValue === ''){
        setErrorFor(phone, 'Поле не может быть пустым!');
    } else if (!isPhone(phoneValue)) {
        setErrorFor(phone, 'Телефон введен не корректно! Введите телефон в формате: +7(000)000-0000')
    } else {
        setSuccessFor(phone);
    }

    if (emailValue === ''){
        setErrorFor(email, 'Поле не может быть пустым!');
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Email введен не корректно!')
    } else {
        setSuccessFor(email);
        console.log(email, 'SUCCESS')
    }

    if (passwordValue === ''){
        setErrorFor(password, 'Поле не может быть пустым!');
    } else if (!isPassword(passwordValue)) {
        setErrorFor(password, 'Please use 8 or more characters, with at least 1 number and a mixture of uppercase and lowercase letters')
    } else {
        setSuccessFor(password);
        console.log(passwordValue, 'SUCCESS')
    }
}

function setErrorFor(input, message) {
    input.classList.add('input-error');
    input.nextElementSibling.innerText = message;
}

function setSuccessFor(input) {
    input.classList.remove('input-error')
    input.classList.add('input-success');
    input.nextElementSibling.innerText = '';
}
function isName(name){
    const regName = /^[A-Za-zА-Яа-я ]+$/;
    return regName.test(name);
}
function isPhone(phone){
    const regPhone = /^\+\d{1}\(\d{3}\)\d{3}-\d{4}$/;
    return regPhone.test(phone);
}
function isEmail(email){
    const regEmail = /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/;
    return regEmail.test(email);
}
function isPassword(password){
    const regPass = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,}/;
    return regPass.test(password);
}

