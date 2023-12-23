<template>
  <v-sheet class="pa-2 my-2" :elevation="1">
    <div class="d-flex mb-2">
      <v-img
        :src="product.image"
        :alt="product.title"
        max-width="50"
        width="50"
        aspect-ratio="1"
      />
      <div class="flex-grow-1 ml-2">
        <h5>{{ shortTitle }}</h5>
        <p class="text-primary">{{ product.category }}</p>
      </div>
      <v-btn
        class="ml-2"
        icon="mdi-delete"
        variant="text"
        @click="deleteProduct"
      ></v-btn>
    </div>
    <div class="d-flex align-center">
      <div class="flex-grow-1">
        <v-btn
          size="small"
          icon="mdi-minus"
          variant="text"
          @click="changeQuantity(product.qty - 1)"
        ></v-btn>
        <span class="px-2">{{ product.qty }} </span>
        <v-btn
          size="small"
          icon="mdi-plus"
          variant="text"
          @click="changeQuantity(product.qty + 1)"
        ></v-btn>
      </div>
      <div>
        <p>
          ${{ product.price }} * {{ product.qty }} =
          <b>${{ totalPrice }}</b>
        </p>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["changeQuantity", "deleteProduct"]);

const changeQuantity = (value) => {
  emits("changeQuantity", props.product.id, value);
};

const deleteProduct = () => {
  emits("deleteProduct", props.product.id);
};

const shortTitle = computed(() =>
  props.product.title.length > 25
    ? `${props.product.title.slice(0, 25)}...`
    : props.product.title
);

const totalPrice = computed(() => {
  return (props.product.price * props.product.qty).toFixed(2);
});
</script>

<style lang="scss" scoped></style>
