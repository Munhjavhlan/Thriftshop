class CartTotal extends HTMLElement {
    constructor() {
        super();
        this.totalPrice = '0.00';
        this.uichilgeeniiFee = 1000;
    }

    static get observedAttributes() {
        return ['total-price'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'total-price') {
            this.totalPrice = newValue;
            this.loadCartData();
        }
    }

    connectedCallback() {
        this.loadCartData();
        window.addEventListener('cart-updated', (event) => this.updateTotalPrice(event.detail.totalPrice));
    }

    loadCartData() {
        const cart = this.getCartItems();
        const totalPrice = parseFloat(this.totalPrice);
        const hymdral = this.calculateDiscount(cart);
        const finalPrice = totalPrice - hymdral + this.uichilgeeniiFee;

        this.render(totalPrice.toFixed(2), hymdral.toFixed(2), this.uichilgeeniiFee.toFixed(2), finalPrice.toFixed(2));
    }

    getCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    calculateTotal(cart) {
        return parseFloat(cart.reduce((sum, item) => sum + parseFloat(item.price) * (item.quantity || 1), 0)).toFixed(2);
    }

    calculateDiscount() {
        return 100;
    }

    updateTotalPrice(totalPrice) {
        const parsedTotalPrice = parseFloat(totalPrice);
        const hymdral = this.calculateDiscount();
        const finalPrice = parsedTotalPrice - hymdral + this.uichilgeeniiFee;
        this.render(parsedTotalPrice.toFixed(2), hymdral, this.uichilgeeniiFee, finalPrice.toFixed(2));
    }

    render(totalPrice, hymdral, uichilgeeniiFee, finalPrice) {
        this.innerHTML = `
            <article class="order-summary">
                <article class="item">
                    <span>Захиалгын дүн</span>
                    <span>${totalPrice}₮</span>
                </article>
                <article class="item hymdral">
                    <span>Хөнгөлөлт</span>
                    <span>-${hymdral}₮</span>
                </article>
                <article class="item service-fee">
                    <span>Үйлчилгээний төлбөр</span>
                    <span>${uichilgeeniiFee}₮</span>
                </article>
                <article class="item total">
                    <span>Нийт</span>
                    <span>${finalPrice}₮</span>
                </article>
                <a href="login.html"><button class="continue-btn" aria-label="Read more">Үргэлжлүүлэх</button></a>
                <p class="note">
                    Захиалга хийсний дараа барааны үнэ өөрчлөгдсөн тохиолдолд 24 цагийн дотор тантай холбоо барьж мэдэгдэнэ.
                </p>
                <img class="sda" src="./../../images/Frame 768.png" alt="zurag">
            </article>
            <style>
                @media (max-width: 600px) {
                    .order-summary {
                        width: 100%;
                        padding: 10px;
                    }

                    .item {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .item span {
                        display: block;
                        margin-bottom: 5px;
                    }
                }

                @media (min-width: 601px) and (max-width: 1024px) {
                    .order-summary {
                        width: 100%;
                        padding: 15px;
                    }

                    .item {
                        flex-direction: row;
                        align-items: center;
                    }

                    .item span {
                        display: inline-block;
                        margin-right: 10px;
                    }
                }
            </style>
        `;
        if (this.getCartItems().length === 0) {
            this.setAttribute('empty', '');
        } else {
            this.removeAttribute('empty');
        }
    }
}

customElements.define('cart-total', CartTotal);
