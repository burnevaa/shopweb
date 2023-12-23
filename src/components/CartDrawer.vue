<template>
  <v-navigation-drawer location="right" temporary class="pa-4" width="325">
    <div class="d-flex flex-column" style="height: 100%">
      <div class="d-flex justify-space-between align-center">
        <h2 class="text-h5">Cart</h2>
        <v-btn icon="mdi-close" variant="plain" @click.stop="close"> </v-btn>
      </div>
      <div class="overflow-auto flex-grow-1">
        <p v-if="!cart.length">No items is cart</p>
        <CartItem
          v-for="product in cart"
          :key="product.id"
          :product="product"
          @changeQuantity="changeQuantity"
          @deleteProduct="deleteProduct"
        />
      </div>
      <div>
        <p class="d-flex justify-space-between mb-2">
          <span>Total: </span>
          <b>${{ total }}</b>
        </p>
        <v-btn color="primary" block>Checkout</v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import CartItem from "@/components/CartItem.vue";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import API from "@/api";

const store = useStore();
const { cartProducts, products } = storeToRefs(store);

defineProps({
  drawer: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["close-drawer"]);

const cart = computed(() =>
  products.value
    .map((product) => ({
      ...product,
      qty: cartProducts.value[product.id] || 0,
    }))
    .filter((product) => product.qty > 0)
);

const total = computed(() => {
  return cart.value
    .reduce((total, product) => {
      return total + product.price * product.qty;
    }, 0)
    .toFixed(2);
});

const changeQuantity = (productId, value) => {
  let newCart = { ...cartProducts.value };
  if (value <= 0) {
    delete newCart[productId];
  } else {
    newCart[productId] = value;
  }
  API.updateCartProducts(newCart);
};

const deleteProduct = (productId) => {
  let newCart = { ...cartProducts.value };
  delete newCart[productId];
  API.updateCartProducts(newCart);
};

const close = () => {
  emits("close-drawer");
};
</script>

<style lang="scss" scoped></style>
