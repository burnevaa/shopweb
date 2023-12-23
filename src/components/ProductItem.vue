<template>
  <v-card class="pa-2" width="100%">
    <router-link :to="`/products/${product.id}`">
      <v-img :src="product.image" :alt="product.title" height="200">
        <div class="d-flex flex-column">
          <v-btn
            flat
            class="mb-2"
            icon="mdi-heart"
            :color="isFavorite ? 'red' : 'grey'"
            @click.prevent.stop="toggleFavorite"
          >
          </v-btn>
          <v-btn
            flat
            icon="mdi-cart"
            :color="isCart ? 'orange' : 'grey'"
            @click.prevent.stop="toggleCart"
          >
          </v-btn>
        </div>
      </v-img>

      <div class="mt-2">
        <v-card-subtitle class="text-primary">{{
          product.category
        }}</v-card-subtitle>
        <v-card-title class="py-0">{{ product.title }}</v-card-title>
        <v-card-subtitle>${{ product.price }}</v-card-subtitle>
      </div>
    </router-link>
  </v-card>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isCart: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["toggleFavorite", "toggleCart"]);

const toggleFavorite = () => {
  emits("toggleFavorite", props.product.id);
};

const toggleCart = () => {
  emits("toggleCart", props.product.id);
};
</script>

<style lang="scss" scoped></style>
