<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          single-line
          v-model="searchQuery"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
          label="Category"
          :items="categories"
          variant="underlined"
          v-model="selectedCategory"
          hide-details
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          label="Sort"
          :items="sortFields"
          item-title="title"
          item-value="value"
          variant="underlined"
          v-model="selectedSort"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="3" class="pa-0 pa-md-2">
        <v-checkbox
          label="Favorite Only"
          color="red"
          v-model="favoriteOnly"
          hide-details
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="product in pageProducts"
        :key="product.id"
        class="d-flex child-flex"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <ProductItem
          :is-favorite="favoriteProducts.includes(product.id)"
          :is-cart="!!cartProducts[product.id]"
          :product="product"
          @toggleFavorite="handleToggleFavorite"
          @toggleCart="handleToggleCart"
        />
      </v-col>
    </v-row>
    <p v-if="!pageProducts.length">No Products found</p>
    <v-pagination
      v-show="pageProducts.length"
      v-model="page"
      :length="totalPages"
    ></v-pagination>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import debounce from "lodash/debounce";
import API from "@/api";

import ProductItem from "@/components/ProductItem.vue";
import { useStore } from "../store";
import { storeToRefs } from "pinia";

const store = useStore();

const { products, categories, favoriteProducts, cartProducts } =
  storeToRefs(store);

const filteredProducts = ref([]);
const productsBySearch = ref([]);
const sortFields = ref([
  {
    title: "None",
    value: "default",
  },
  {
    title: "Name(asc)",
    value: "name-asc",
  },
  {
    title: "Name(desc)",
    value: "name-desc",
  },
  {
    title: "Price(asc)",
    value: "price-asc",
  },
  {
    title: "Price(desc)",
    value: "price-desc",
  },
]);

const searchQuery = ref("");
const selectedCategory = ref("any");
const selectedSort = ref("default");
const favoriteOnly = ref(false);

const page = ref(1);
const perPage = ref(12);

const handleToggleFavorite = (productId) => {
  API.toggleFavorite(productId);
};

const handleToggleCart = (productId) => {
  const newCart = { ...cartProducts.value };
  if (!newCart[productId]) {
    newCart[productId] = 1;
  } else {
    delete newCart[productId];
  }
  API.updateCartProducts(newCart);
};

const pageProducts = computed(() => {
  return productsBySearch.value.slice(
    (page.value - 1) * perPage.value,
    page.value * perPage.value
  );
});

const totalPages = computed(() => {
  return Math.ceil(productsBySearch.value.length / perPage.value);
});

watchEffect(() => {
  filteredProducts.value = products.value
    .filter((product) => {
      if (
        selectedCategory.value !== "any" &&
        product.category !== selectedCategory.value
      ) {
        return false;
      }

      if (favoriteOnly.value && !favoriteProducts.value.includes(product.id))
        return false;

      return true;
    })
    .sort((a, b) => {
      switch (selectedSort.value) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });
});

watch(
  [searchQuery, filteredProducts],
  debounce(() => {
    page.value = 1;

    if (!searchQuery.value) {
      productsBySearch.value = filteredProducts.value;
    }

    productsBySearch.value = filteredProducts.value.filter((product) => {
      if (
        searchQuery.value &&
        product.title.toLowerCase().indexOf(searchQuery.value.toLowerCase()) ===
          -1
      )
        return false;
      return true;
    });
  }, 300),
  {
    immediate: true,
  }
);

watch(page, () => {
  window.scrollTo(0, 0);
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
