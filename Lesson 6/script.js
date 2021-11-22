const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

Vue.component ('good-item', {
    template: `<div class="goods-item" v-on:click="onAdd">
          <h3>{{ good.product_name }}</h3>
          <p>$ {{ good.price }}</p>
        </div>`,
    props: {
        good: Object
    },
    methods: {
        onAdd() {
            this.$emit('add', this.good)
        }
    }
})

Vue.component ('goods-list', {
    template: `<div class="goods-list">
        <good-item 
        v-for="good of list" 
        v-bind:key="good.id_product" 
        v-bind:good="good"
        v-on:add="onAdd">
        </good-item>
      </div>`,
    props: {
        list: Array
    },
    methods: {
        onAdd(good) {
            this.$emit('add', good)
        }
    }
})

Vue.component('cart-item', {
    template: `<div class="cart-item" v-on:click="onRemove">
    <h4>{{ good.product_name }}</h4>
    <p>Цена: $ {{ good.price }}</p>
    <p>Количество: {{ good.quantity }}</p>
  </div>`,
    props: {
        good: Object
    },
    methods: {
        onRemove() {
            this.$emit('remove', this.good);
        }
    }
})

Vue.component ('cart', {
    template: `<div class="cart-items">
          <cart-item v-for="good of cart" v-bind:key="good.id_product" v-bind:good="good" v-bind:data-id="good.id_product" v-on:remove="onRemove">
          </cart-item>
        </div>`,
    props: {
        cart: Array
    },
    methods: {
        onRemove(good) {
            this.$emit('remove', good)
        }
    }
})

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
            fetch(`${API_URL}catalogData.json`)
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
            fetch(`${API_URL}getBasket.json`)
                .then((request) => request.json())
                .then((data) => {
                    this.cart = data.contents;
                    this.amountOfItemsInCart = data.countGoods;
                    this.cartTotal = data.amount;
                })
        },
        addToCart(good){
            fetch(`${API_URL}addToBasket.json`)
                .then(() => {
                    console.log(good)
                    this.cart.push(good)
                })
        },
        removeFromCart(good){
            fetch(`${API_URL}deleteFromBasket.json`)
                .then(() => {
                    const index = this.cart.findIndex((el) => el == good);
                    console.log(index)
                    this.cart.splice(index, 1);
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
    }
})
