class CartTotal extends HTMLElement {
    constructor() {
        super();
        this.totalPrice = '0.00'; // Initial total price
    }

    connectedCallback() {
        this.loadCartData(); // Load cart data when component is connected
    }

    loadCartData() {
        const cart = this.getCartItems(); // Get cart data
        const totalPrice = this.calculateTotal(cart);
        const discount = this.calculateDiscount(cart); // Example discount calculation
        const serviceFee = 5000; // Example service fee
        const finalPrice = totalPrice - discount + serviceFee; // Final price after discount and service fee
        
        this.render(totalPrice, discount, serviceFee, finalPrice); // Render the prices
    }

    getCartItems() {
        return JSON.parse(localStorage.getItem('cart')) || []; // LocalStorage-аас сагсны өгөгдлийг дуудаж авна
    }

    calculateTotal(cart) {
        // Calculate total price by summing up all item prices
        return cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
    }

    calculateDiscount(cart) {
        // Example discount calculation (e.g., 13000₮)
        return 5; // Replace this with your own discount logic
    }

    render(totalPrice, discount, serviceFee, finalPrice) {
        this.innerHTML = `
            <article class="order-summary">
                <article class="item">
                    <span>Захиалгын дүн</span>
                    <span>${totalPrice}₮</span>
                </article>
                <article class="item discount">
                    <span>Хөнгөлөлт</span>
                    <span>-${discount}₮</span>
                </article>
                <article class="item service-fee">
                    <span>Үйлчилгээний төлбөр</span>
                    <span>${serviceFee}₮</span>
                </article>
                <article class="item total">
                    <span>Нийт</span>
                    <span>${finalPrice}₮</span>
                </article>
                <button class="continue-btn">Үргэлжлүүлэх</button>
                <p class="note">
                    Захиалга хийсний дараа барааны үнэ өөрчлөгдсөн тохиолдолд 24 цагийн дотор тантай холбоо барьж мэдэгдэнэ.
                </p>
            </article>
        `;
    }
}

customElements.define('cart-total', CartTotal);
