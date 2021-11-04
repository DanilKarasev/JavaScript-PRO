const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

new Vue({
    el: "#app",
    data: {
        isVisibleCart: false,
        goods: [],
        searchLine: '',
        cart: [],
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
                })

        },
        loadCart() {
            fetch(`${API_URL}getBasket.json`)
                .then((request) => request.json())
                .then((data) => {
                    this.cart = data.contents;
                    this.amountOfItemsInCart = data.countGoods;
                    this.cartTotal = data.amount;
                })
        }
    },
    computed: {
        filterGoods() {
            let filteredGoods = this.goods;
            const search = this.searchLine.trim();
            if (search) {
                const reg = new RegExp(search, 'i');
                filteredGoods = filteredGoods.filter(good => reg.test(good.product_name))
            }
            return filteredGoods;
        }
    },
    mounted() {
        this.loadGoods();
        this.loadCart();
    }
})
