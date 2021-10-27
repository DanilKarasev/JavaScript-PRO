const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

class GoodsItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><h3>${this.title}</h3><p>$${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    fetchGoods() {
        fetch(`${API_URL}catalogData.json`)
            .then((response) => {
                return response.json();
            })
            .then((request) => {
                this.goods = request.map(good => ({title: good.product_name, price: good.price}))
                this.render()
            })
            .catch(() => {
                console.log('ERROR')
            })
    };

    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    };
}

//=======================CART

class CartItem {
    constructor(title, price, quantity) {
        this.product_name = title;
        this.price = price;
        this.quantity = quantity;
    }
    render() {
        return `<div class="cart-item"><h4>${this.product_name}</h4><p>Цена: $${this.price}</p><p>Количество: ${this.quantity}</p></div>`;
    }
}

class CartList {
    constructor() {
        this.cartTotalPrice = 0;
        this.cartItemsAmount = 0;
        this.cartGoods = [];
    }

    FetchCart() {
        fetch(`${API_URL}getBasket.json`)
            .then((response) => {
                return response.json();
            })
            .then((request) => {
                this.cartGoods = request.contents;
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
            const cartItem = new CartItem(good.product_name, good.price, good.quantity);
            cartlist += cartItem.render();
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

const list = new GoodsList();
list.fetchGoods();

const cart = new CartList();
cart.FetchCart();
//====================================

const $cartButton = document.querySelector('.cart-button');
const $cartMain = document.querySelector('.cart-main');

$cartButton.addEventListener('click', () => {
    if ($cartMain.style.display === 'flex'){
        $cartMain.style.display = 'none';
        $cartButton.classList.remove('cart-button_active');
    } else {
        $cartMain.style.display = 'flex';
        $cartButton.classList.add('cart-button_active');
    }
});