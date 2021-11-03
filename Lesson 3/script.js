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
        this._cart = cart;
        this._element = document.querySelector('.goods-list');
        this._element.addEventListener('click', this._onClick.bind(this))
    }

    fetchGoods() {
        fetch(`${API_URL}catalogData.json`)
            .then((response) => {
                return response.json();
            })
            .then((request) => {
                this.goods = request.map(good => ({title: good.product_name, price: good.price, id: good.id_product, quantity: 1}))
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
        this.goods.forEach(good => {
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

list.fetchGoods();
cart.FetchCart();