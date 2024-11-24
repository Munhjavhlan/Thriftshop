class CartList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `

            <div class="cart-container">
                <div class="cart-header">Таны сагс</div>
                
                <div class="cart-items" id="cart-items">
                    <!-- Cart items will be dynamically inserted here -->
                </div>

                <div class="cart-total">
                    <p>Нийт үнэ: <span id="total-price">0₮</span></p>
                </div>

                <button class="checkout-button">Төлбөр хийх</button>
                <div class="empty-cart-message" id="empty-cart-message" style="display: none;">Таны сагс хоосон байна.</div>
            </div>
        `;
    }

    connectedCallback() {
        this.loadCart();
        this.addEventListeners();
    }

    loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = this.shadowRoot.querySelector('#cart-items');
        const emptyCartMessage = this.shadowRoot.querySelector('#empty-cart-message');
        cartItemsContainer.innerHTML = '';

        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block'; // Хоосон сагс харуулах
        } else {
            emptyCartMessage.style.display = 'none'; 
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.name}">
                <div class="info">
                    <p>${item.name}</p>
                    <p>Үнэ: ${item.price}₮</p>
                </div>
                <button class="remove" data-id="${item.id}">&times;</button>
            `;

            cartItemsContainer.appendChild(cartItem);
            total += parseFloat(item.price);

            cartItem.querySelector('.remove').addEventListener('click', () => {
                this.removeItem(item.id);
            });
        });

        this.shadowRoot.querySelector('#total-price').textContent = `${total}₮`;
    }

    removeItem(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.loadCart();
    }


}

customElements.define('cart-list', CartList);
