class CartList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.zahialga = new Map();
    }

    connectedCallback() {
        this.loadCart();
        window.addEventListener('add-to-cart', (event) => this.addItem(event.detail.item));
    }

    loadCart() {
        const cart = this.getCartItems();
        const isEmpty = cart.size === 0;
        this.shadowRoot.innerHTML = `
        <style>
        main {
    display: grid;
    grid-template-areas:
    "topbar topbar topbar"
    "baraa content sambar"
    "footer footer footer";
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 50px auto 70px; 
    justify-items: center;
    
  }
  cart-list{
    grid-area: baraa;
  }
  cart-total{
    grid-area: sambar;
  }

  .order-summary {
    width: 350px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px var(--main-bg-color-dark);
  }

  .item {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }

  .discount {
    color: red;
  }

  .service-fee {
    color: var(--color-neutral-grey-6);
  }

  .total {
    font-weight: bold;
    font-size: 18px;
  }

  hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 10px 0;
  }

  .continue-btn {
    width: 100%;
    padding: 10px 0;
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }

  .continue-btn:hover {
    background-color: var(--color-neutral-grey-5);
  }

  .note {
    margin-top: 20px;
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  .baraa {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .baraa:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .baraa img {
    width: 170px;
    height: 170px;
    border-radius: 10%;
    object-fit: cover;
    margin-right: 15px;
  }

  .details {
    flex: 1;
  }

  .details h4 {
    font-size: 16px;
    margin: 0 0 5px;
  }

  .details .price {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
  }

  .details .price span {
    font-weight: bold;
    color: #d32f2f;
  }

  .quantity {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .quantity input {
    width: 50px;
    text-align: center;
    margin-right: 10px;
  }

  .remove-button {
    background-color: #d32f2f;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
  }

  .remove-button:hover {
    background-color: #b71c1c;
  }

  :host(:state(empty)) .sags {
    background-color:var(--secondary-color);
    color: #999;
  }

  :host(:state(non-empty)) .sags {
    background-color: #fff;
    color: #000;
  }
        </style>
        <template id="cart-template">
            <article class="sags">
                <h2>Таны сагс</h2>
                <section>
                    <slot name="cart-content"></slot>
                </section>
            </article>
        </template>
        `;

        const template = this.shadowRoot.getElementById('cart-template').content.cloneNode(true);
        const slot = template.querySelector('slot[name="cart-content"]');

        slot.innerHTML = isEmpty ? '<p>Сагс хоосон байна.</p>' : this.renderProducts(cart);
        this.shadowRoot.appendChild(template);
        this.addRemoveListeners();
        this.dispatchCartUpdateEvent(cart);
    }

    getCartItems() {
        const cartArray = JSON.parse(localStorage.getItem('cart')) || [];
        return this.zahialga = new Map(cartArray.map(item => [item.id, item]));
    }

    renderProducts(cart) {
        return Array.from(cart.values()).map((item, index) => `
        <article class="baraa">
            <img src="${item.thumbnail}" alt="${item.name}">
            <div class="details">
                <h4>${item.name}</h4>
                <p class="price">Үнэ: <span>${(item.price * (item.quantity || 1)).toFixed(2)}₮</span></p>
                <div class="quantity">
                    <input type="number" min="1" value="${item.quantity || 1}" data-index="${index}">
                    <span>ширхэг</span>
                </div>
                <button class="remove-button" data-index="${index}">Хасах</button>
            </div>
        </article>
        `).join('');
    }

    addRemoveListeners() {
        this.shadowRoot.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', (event) => {
                this.removeItem(event.target.getAttribute('data-index'));
            });
        });

        this.shadowRoot.querySelectorAll('.quantity input').forEach(input => {
            input.addEventListener('change', (event) => {
                this.updateQuantity(event.target.getAttribute('data-index'), parseInt(event.target.value));
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
        localStorage.setItem('cart', JSON.stringify(Array.from(cart.values())));
        this.loadCart();
        this.dispatchCartUpdateEvent(cart);
    }

    dispatchCartUpdateEvent(cart) {
        const totalPrice = Array.from(cart.values()).reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0).toFixed(2);
        this.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { totalPrice },   
        }));
    }

}

customElements.define('cart-list', CartList);
