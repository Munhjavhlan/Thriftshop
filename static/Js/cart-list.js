class CartList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.turul = '';
    }

    connectedCallback() {
        this.loadCart();
    }

    loadCart() {
        const cart = this.getCartItems();
        const isEmpty = cart.length === 0;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  color: #333;
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
  background-color: #353943;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.continue-btn:hover {
  background-color: #555;
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

        if (isEmpty) {
            slot.innerHTML = '<p>Сагс хоосон байна.</p>';
            this.setAttribute('empty', '');
        } else {
            slot.innerHTML = this.renderProducts(cart);
            this.removeAttribute('empty');
        }

        this.shadowRoot.appendChild(template);
        this.addRemoveListeners();
        this.dispatchCartUpdateEvent(cart); 
    }

    getCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    renderProducts(cart) {
        return cart.map((item, index) => `
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
        const removeButtons = this.shadowRoot.querySelectorAll('.remove-button');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                this.removeItem(index);
            });
        });

        const quantityInputs = this.shadowRoot.querySelectorAll('.quantity input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const index = event.target.getAttribute('data-index');
                const quantity = parseInt(event.target.value);
                this.updateQuantity(index, quantity);
            });
        });
    }

    removeItem(index) {
        let cart = this.getCartItems();
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart(); 
        this.dispatchCartUpdateEvent(cart); 
    }

    updateQuantity(index, quantity) {
        let cart = this.getCartItems();
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart(); 
        this.dispatchCartUpdateEvent(cart); 
    }

    dispatchCartUpdateEvent(cart) {
        const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0).toFixed(2);
        const event = new CustomEvent('cart-updated', {
            detail: { totalPrice },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
    static get observedAttributes() {
        return ['empty'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'empty') {
            this.loadCart();
        }
    }
}

customElements.define('cart-list', CartList);
