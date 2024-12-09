class CartList extends HTMLElement {
    constructor() {
        super();
        // Attach shadow DOM
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.loadCart();
    }

    loadCart() {
        const cart = this.getCartItems();
        const isEmpty = cart.length === 0;

        // Update the content in shadow DOM
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
        </style>
            <article class="sags">
                <h2>Таны сагс</h2>
                <section>
                    ${isEmpty ? '<p>Сагс хоосон байна.</p>' : this.renderProducts(cart)}
                </section>
            </article>
           
        `;

        // Update attribute based on cart state
        if (isEmpty) {
            this.setAttribute('empty', '');
        } else {
            this.removeAttribute('empty');
        }

        this.addRemoveListeners();
        this.dispatchCartUpdateEvent(cart); // Dispatch event to update total price
    }

    getCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    renderProducts(cart) {
        return cart.map((item, index) => `
        <style>
        .baraa {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

.remove-button {
    background-color: #d32f2f;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.remove-button:hover {
    background-color: #b71c1c;
}

        </style>
            <article class="baraa">
                <img src="${item.thumbnail}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Үнэ: ${item.price}₮</p>
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
    }

    removeItem(index) {
        let cart = this.getCartItems();
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart(); // Reload the cart after removing an item
    }

    dispatchCartUpdateEvent(cart) {
        const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
        const event = new CustomEvent('cart-updated', {
            detail: { totalPrice },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    // Add state management for dynamic styles
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
