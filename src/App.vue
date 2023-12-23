<template>
  <v-app>
    <CartDrawer
      v-model="drawer"
      :drawer="drawer"
      @close-drawer="drawer = false"
    />
    <v-app-bar>
      <v-container class="d-flex justify-space-between">
        <router-link to="/" class="d-flex align-center logo-link">
          <v-icon icon="mdi-store" size="32"></v-icon>
          <v-app-bar-title>Online Store</v-app-bar-title>
        </router-link>

        <v-btn icon @click.stop="drawer = true">
          <v-badge :content="cartLength" color="orange">
            <v-icon icon="mdi-cart" size="x-large"></v-icon>
          </v-badge>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container style="height: 100%">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "./store";
import API from "./api";
import CartDrawer from "./components/CartDrawer.vue";
import { storeToRefs } from "pinia";

const store = useStore();
const { setFavoriteProducts, setCartProducts, setProducts, setCategories } =
  store;

const { cartProducts } = storeToRefs(store);
const drawer = ref(false);

const getFavoriteProducts = () => {
  API.getFavoriteProducts().then(({ favoriteProducts }) => {
    setFavoriteProducts(favoriteProducts);
  });
};

const getCartProducts = () => {
  API.getCartProducts().then(({ cartProducts }) => {
    setCartProducts(cartProducts);
  });
};

const cartLength = computed(() => {
  return Object.entries(cartProducts.value).reduce(
    (acc, [id, qty]) => acc + qty,
    0
  );
});

onMounted(() => {
  getFavoriteProducts();
  window.addEventListener("ls-favorite-changed", getFavoriteProducts);

  getCartProducts();
  window.addEventListener("ls-cart-changed", getCartProducts);

  API.fetchProducts().then((res) => {
    setProducts(res.products);
  });

  API.fetchCategories().then((res) => {
    setCategories(["any", ...res.categories]);
  });
});
</script>

<style lang="scss">
.logo-link {
  gap: 10px;
}
</style>
