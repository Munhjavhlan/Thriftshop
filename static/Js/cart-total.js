class CartTotal extends HTMLElement {
    constructor() {
        super();
        this.totalPrice = '0.00'; // Initial total price
        this.attachShadow({ mode: 'open' });
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
        return parseFloat(cart.reduce((sum, item) => sum + parseFloat(item.price), 0)).toFixed(2);
    }

    calculateDiscount(cart) {
        // Example discount calculation (e.g., 13000₮)
        return 4; // Replace this with your own discount logic
    }

    render(totalPrice, discount, serviceFee, finalPrice) {
        const template = document.createElement('template');
        
        // Template for rendering cart total information
        template.innerHTML = `
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
  .sda{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px
  }
            </style>
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
                <img class="sda" src="./../../images/Frame 768.png" alt="zurag">
            </article>
        `;

        // Attach the template content to the shadow DOM
        this.shadowRoot.innerHTML = ''; // Clear previous content
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Add a conditionally applied attribute for cart state (e.g., empty cart state)
        if (this.getCartItems().length === 0) {
            this.setAttribute('empty', '');
        } else {
            this.removeAttribute('empty');
        }
    }
}

customElements.define('cart-total', CartTotal);
