class CartList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.loadCart();
    }

    loadCart() {
        const cart = this.getCartItems();
        const isEmpty = cart.length === 0;

        this.innerHTML = `
            <article class="sags">
                <h2>Таны сагс</h2>
                <section>
                    ${isEmpty ? '<p>Сагс хоосон байна.</p>' : this.renderProducts(cart)}
                </section>
            </article>
        `;

        this.addRemoveListeners();
        this.dispatchCartUpdateEvent(cart); // Dispatch event to update total price
    }

    getCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    renderProducts(cart) {
        return cart.map((item, index) => `
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
        const removeButtons = this.querySelectorAll('.remove-button');
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
}

customElements.define('cart-list', CartList);
