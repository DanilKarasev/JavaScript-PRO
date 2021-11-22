const API_URL = 'http://127.0.0.1:3000/';

Vue.component ('good-item', {
    template: `<div class="goods-item" @click="onClick">
          <h3>{{ title }}</h3>
          <p>$ {{ price }}</p>
        </div>`,
    props: {
        title: String,
        price: Number,
        id: Number
    },
    methods: {
        onClick() {
            fetch(API_URL+"addToCart", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({product_name: this.title, price: this.price, id_product: this.id})
            })
                .then(() => {
                    this.$root.loadCart();
                })
        }
    }
});

Vue.component ('goods-list', {
    template: `<div class="goods-list">
        <good-item 
        v-for="good of list" 
        v-bind:key="good.id_product"
        v-bind:id="good.id_product" 
        v-bind:title="good.product_name" 
        v-bind:price="good.price">
        </good-item>
      </div>`,
    props: {
        list: Array
    }
})

Vue.component('cart-item', {
    template: `<div class="cart-item" @click="onClick">
    <h4>{{ title }}</h4>
    <p>Цена: $ {{ price }}</p>
    <p>Количество: {{ quantity }}</p>
  </div>`,
    props: {
        title: String,
        price: Number,
        id: Number,
        quantity: Number
    },
    methods: {
        onClick() {
            fetch(API_URL+"removeFromCart", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({product_name: this.title, price: this.price, id_product: this.id, quantity: this.quantity})
            })
                .then(() => {
                    console.log(this.id_product)
                    this.$root.loadCart();
                })
        }
    }
});

Vue.component ('cart', {
    template: `<div class="cart-items">
          <cart-item v-for="good of cart" v-bind:key="good.id_product" v-bind:quantity="good.quantity" v-bind:title="good.product_name" v-bind:price="good.price" v-bind:id="good.id_product">
          </cart-item>
        </div>`,
    props: {
        cart: Array
    }
});

Vue.component ('search', {
    template: `<div class="search">
                <input type="text" v-model="searchString" class="search-input">
                <button class="search-button" type="button" v-on:click="onClick">Search</button> 
                </div>`,
    data() {
        return {
            searchString: ''
        }
    },
    methods: {
        onClick() {
            this.$emit('search', this.searchString)
        }
    }
})

Vue.component ('error', {
    template: `<div class="error">
          <p>Не удалось загрузить список товаров...</p>
        </div>`
})

new Vue({
    el: "#app",
    data: {
        isVisibleCart: false,
        goods: [],
        filteredGoods: [],
        cart: [],
        loadError: false,
        amountOfItemsInCart: 0,
        cartTotal: 0
    },
    methods: {
        onClickCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        loadGoods(){
            fetch(`${API_URL}catalogData`)
                .then((request) => request.json())
                .then((data) => {
                    this.goods = data;
                    this.filteredGoods = data;
                })
                .catch(() => {
                    this.loadError = true;
                })
        },
        loadCart(){
            fetch(`${API_URL}cart`)
                .then((request) => request.json())
                .then((data) => {
                    this.cart = data;
                    this.amountOfItemsInCart = data.length;
                    this.cartTotal = data.map(item => item.price).reduce((prev, curr) => prev + curr, 0);
                })
        },
        onSearch(searchString) {
            const reg = new RegExp(searchString, 'i');
            this.filteredGoods = this.goods.filter((good) => reg.test(good.product_name))
        }
    },
    mounted() {
        this.loadGoods();
        this.loadCart();
    },
})
