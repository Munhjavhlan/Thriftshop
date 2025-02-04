import "./cart-total.mjs";
class CartList extends HTMLElement {
  constructor() {
    super();
    this.zahialga = new Map();
  }

  connectedCallback() {
    this.loadCart();
    this.querySelector(".clear-cart-button").addEventListener("click", () =>
      this.clearCart()
    );
  }

  loadCart() {
    const cart = this.getCartItems();
    const isEmpty = cart.size === 0;
    this.innerHTML = `
      <article class="sags">
        <h2>Таны сагсанд</h2>
        <section class="cart-content">
          ${isEmpty ? "<p>Сагс хоосон байна.</p>" : this.renderProducts(cart)}
        </section>
        <button class="clear-cart-button">Сагсыг хоослох</button>
      </article>
      <cart-total></cart-total>
      <style>
        @media (max-width: 600px) {
          .sags {
            width: 100%;
          }
        }
      </style>
    `;
    this.addRemoveListeners();
    this.dispatchCartUpdateEvent(cart);
  }

  getCartItems() {
    const cartArray = JSON.parse(localStorage.getItem("cart")) || [];
    return (this.zahialga = new Map(cartArray.map((item) => [item.id, item])));
  }

  renderProducts(cart) {
    return Array.from(cart.values())
      .map(
        (item, index) => `
          <article class="baraa">
            <img src="${item.thumbnail}" alt="${item.name}">
            <div class="details">
              <h4>${item.name}</h4>
              <p class="price">Үнэ: <span>${(
                item.price * (item.quantity || 1)
              ).toFixed(2)}₮</span></p>
              <div class="quantity">
                <input type="number" min="1" value="${
                  item.quantity || 1
                }" data-index="${index}">
                <span>ширхэг</span>
              </div>
              <button class="remove-button" data-index="${index}">Хасах</button>
            </div>
          </article>
        `
      )
      .join("");
  }

  addRemoveListeners() {
    this.querySelectorAll(".remove-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        this.removeItem(event.target.getAttribute("data-index"));
      });
    });

    this.querySelectorAll(".quantity input").forEach((input) => {
      input.addEventListener("change", (event) => {
        this.updateQuantity(
          event.target.getAttribute("data-index"),
          parseInt(event.target.value)
        );
      });
    });
  }

  removeItem(index) {
    let cart = this.getCartItems();
    cart.delete(Array.from(cart.keys())[index]);
    this.updateCart(cart);
  }

  updateQuantity(index, quantity) {
    let cart = this.getCartItems();
    cart.get(Array.from(cart.keys())[index]).quantity = quantity;
    this.updateCart(cart);
  }

  addItem(item) {
    let cart = this.getCartItems();
    cart.set(item.id, item);
    this.updateCart(cart);
  }

  updateCart(cart) {
    localStorage.setItem("cart", JSON.stringify(Array.from(cart.values())));
    this.loadCart();
    this.dispatchCartUpdateEvent(cart);
  }

  clearCart() {
    this.zahialga.clear();
    localStorage.removeItem("cart");
    this.loadCart();
  }

  dispatchCartUpdateEvent(cart) {
    const totalPrice = Array.from(cart.values())
      .reduce(
        (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
        0
      )
      .toFixed(2);
    const cartTotalElement = this.querySelector("cart-total");
    if (cartTotalElement) {
      cartTotalElement.setAttribute("total-price", totalPrice);
    }
    this.dispatchEvent(
      new CustomEvent("cart-updated", {
        detail: { totalPrice },
      })
    );
  }
}

customElements.define("cart-list", CartList);
