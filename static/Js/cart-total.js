class CartTotal extends HTMLElement {
    constructor() {
        super();
        this.totalPrice = '0.00';
        this.attachShadow({ mode: 'open' });
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
        const totalPrice = this.totalPrice;
        const discount = this.calculateDiscount(cart);
        const uilchilgeeniiTulbur = 1000;
        const finalPrice = totalPrice - discount + uilchilgeeniiTulbur;

        this.render(totalPrice, discount, uilchilgeeniiTulbur, finalPrice);
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
        const hymdral = this.calculateDiscount();
        const uilchilgeeniiTulbur = 1000;
        const finalPrice = totalPrice - hymdral + uilchilgeeniiTulbur;
        this.render(totalPrice, hymdral, uilchilgeeniiTulbur, finalPrice);
    }

    render(totalPrice, discount, uilchilgeeniiTulbur, finalPrice) {
        const template = document.createElement('template');
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

      :host(:state(empty)) .order-summary {
          background-color: var(--light-bg);
          color: var(--color-gray);
      }

      :host(:state(non-empty)) .order-summary {
          background-color: var(--secondary-color);
          color: var(--font-color-light);
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
                    <span>${uilchilgeeniiTulbur}₮</span>
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
        `;
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        if (this.getCartItems().length === 0) {
            this.setAttribute('empty', '');
        } else {
            this.removeAttribute('empty');
        }
    }
}

customElements.define('cart-total', CartTotal);
