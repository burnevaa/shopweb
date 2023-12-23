<!-- src/components/ProductPage.vue -->
<template>
  <v-row
    class="d-flex align-center justify-center"
    style="height: 100%"
    v-if="product"
  >
    <v-col>
      <v-img :src="product.image" alt="Product Image" height="400" />
    </v-col>
    <v-col cols="12" md="8">
      <v-card height="100%">
        <h5 class="text-h5 pa-4 pb-0">{{ product.title }}</h5>
        <v-card-text>
          <p class="text-primary mb-2">{{ product.category }}</p>
          <p class="mb-2">
            Rating: <span :class="ratingClass">{{ product.rating.rate }}</span
            >({{ product.rating.count }} rev.)
          </p>
          <p>{{ product.description }}</p>
          <br />
          <p>
            Price: <b>${{ product.price.toFixed(2) }}</b>
          </p>
        </v-card-text>
        <v-card-actions>
          <router-link to="/" class="mr-2">
            <v-btn variant="elevated">Back</v-btn>
          </router-link>
          <v-btn
            v-if="!cartProducts[product.id]"
            class="px-3"
            color="orange"
            prepend-icon="mdi-cart"
            variant="elevated"
            @click="addToCart"
            >Add to Cart</v-btn
          >
          <v-btn v-else color="red" @click="deleteProduct" variant="elevated"
            >Remove</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import API from "@/api";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const store = useStore();

const { cartProducts } = storeToRefs(store);

const product = ref(null);

const ratingClass = computed(() => {
  if (product.value.rating.rate >= 4) {
    return "text-green";
  } else if (product.value.rating.rate >= 3) {
    return "text-orange";
  } else {
    return "text-red";
  }
});

onMounted(() => {
  API.fetchProduct(route.params.id)
    .then((data) => {
      product.value = data;
    })
    .catch((error) => {
      router.push("/");
    });
});

const deleteProduct = () => {
  let newCart = { ...cartProducts.value };
  delete newCart[route.params.id];
  API.updateCartProducts(newCart);
};

const addToCart = () => {
  let newCart = { ...cartProducts.value };
  newCart[route.params.id] = 1;
  API.updateCartProducts(newCart);
};
</script>

<style scoped>
/* Add your styling here if needed */
</style>
