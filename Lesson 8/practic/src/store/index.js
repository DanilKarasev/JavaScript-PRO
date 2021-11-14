import Vue from 'vue';
import Vuex from 'vuex';

const API_URL = 'http://localhost:8080/'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    goods: [],
    filteredGoods: [],
    cart: [],
  },
  getters: {
    goods: (state) => state.filteredGoods,
    cart: (state) => state.cart
  },
  mutations: {
    loadGoods: (state, payload) => {
      state.goods = payload
      state.filteredGoods = payload
    },
    loadCart: (state, payload) => {
      state.cart = payload
    },
    filter: (state, payload) => {
      state.filteredGoods = payload
    }
  },
  actions: {
    loadGoods({ commit }){
      fetch(`${API_URL}catalogData`)
        .then((request) => request.json())
        .then((data) => {
          commit('loadGoods', data)
        })
    },
    loadCart({ commit }){
      fetch(`${API_URL}cart`)
        .then((request) => request.json())
        .then((data) => {
          commit('loadCart', data)
        })
    },
    addToCart({ commit }, good){
      fetch(`${API_URL}addToCart`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/JSON'
        },
        body: JSON.stringify(good)
      })
    },
    removeFromCart({ commit }, good){
      fetch(`${API_URL}removeFromCart`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/JSON'
        },
        body: JSON.stringify(good)
      })
    },
    search({ commit, state}, searchString){
      const regex = new RegExp(searchString, 'i');
      commit('filter', state.goods.filter((good) => regex.test(good.product_name)))
    },
  }
});
