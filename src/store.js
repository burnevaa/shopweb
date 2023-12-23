import { defineStore } from "pinia";
export const useStore = defineStore("store", {
  state: () => {
    return {
      cart: [],
      products: [],
      favoriteProducts: [],
      categories: [],
      cartProducts: {},
    };
  },
  actions: {
    setProducts(products) {
      this.products = [...products];
    },
    setCategories(categories) {
      this.categories = [...categories];
    },
    setFavoriteProducts(products) {
      this.favoriteProducts = [...products];
    },
    setCartProducts(cart) {
      this.cartProducts = { ...cart };
    },
  },
});
