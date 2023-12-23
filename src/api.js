class Storage {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`ls-${key.toLowerCase()}-changed`));
  }
  static get(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

export default class API {
  static API_URL = "https://fakestoreapi.com";

  static fetchProducts(params) {
    let url = `${this.API_URL}/products`;

    if (params) {
      const query = Object.entries(params).map((p) => p.join("="));
      url += `?${query.join("&")}`;
    }

    return fetch(url)
      .then((res) => res.json())
      .then((products) => ({
        products,
      }));
  }

  static fetchProduct(id) {
    return fetch(`${this.API_URL}/products/${id}`).then((res) => res.json());
  }

  static fetchCategories() {
    return fetch(`${this.API_URL}/products/categories`)
      .then((res) => res.json())
      .then((categories) => ({ categories }));
  }

  static toggleFavorite(id) {
    const products = Storage.get("favorite") || [];
    const index = products.indexOf(id);

    if (index === -1) {
      products.push(id);
    } else {
      products.splice(index, 1);
    }

    Storage.set("favorite", products);
  }

  static getFavoriteProducts() {
    return new Promise((resolve) => {
      const res = Storage.get("favorite") || [];
      resolve({ favoriteProducts: res });
    });
  }

  static getCartProducts() {
    return new Promise((resolve) => {
      const res = Storage.get("cart") || [];
      resolve({ cartProducts: res });
    });
  }

  static updateCartProducts(items) {
    Storage.set("cart", items);
  }
}
