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
    x;
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

const list = new GoodsList();
list.FetchGoods();
list.render();
list.totalPrice();

