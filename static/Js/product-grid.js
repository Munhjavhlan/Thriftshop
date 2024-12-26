class ProductGrid extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
      
        this.render();
    }

    render() {
        this.innerHTML = `
            <div id="product-grid" class="product-grid">
                <!-- Products will be dynamically inserted here -->
            </div>
        `;
    }
}


customElements.define('product-grid', ProductGrid);