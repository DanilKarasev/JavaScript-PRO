class GoodsItem {
    constructor(img, title, price) {
        this.img = img;
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><img src="images/${this.img}.png" alt="${this.img}"><h3>${this.title}</h3><p>$${this.price}</p></div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }
    FetchGoods () {
        this.goods = [
            { img: 'item_1', title: 'Shirt', price: 150 },
            { img: 'item_2', title: 'Socks', price: 50 },
            { img: 'item_3', title: 'Jacket', price: 350 },
            { img: 'item_4', title: 'Shoes', price: 250 },
        ];
    };
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.img, good.title, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    };

    totalPrice() {
        let result = this.goods.map(item => item.price);
        let totalPrice = result.map(sum => this.i += sum, this.i = 0).reverse()[0];
        document.getElementById('grandTotal').innerHTML = `$${totalPrice}`;
    }
}

//=======================CART

class CartItem {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><h4>${this.title}</h4><p>$${this.price}</p></div>`;
    }
}

class CartList {
    constructor() {
        this.cartGoods = [];
    }

    FetchCart() {
        this.cartGoods = [
            { title: 'Shirt', price: 150 },
            { title: 'Socks', price: 50 },
            { title: 'Jacket', price: 350 },
            { title: 'Shoes', price: 250 },
        ];
    }

    render () {
        let cartlist = '';
        this.cartGoods.forEach(good => {
            const cartItem = new CartItem(good.title, good.price);
            cartlist += cartItem.render();
        });
        document.querySelector('.cart-main').innerHTML = cartlist;
    }

}
const cart = new CartList();
cart.FetchCart();
cart.render();
const list = new GoodsList();
list.FetchGoods();
list.render();
list.totalPrice();

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