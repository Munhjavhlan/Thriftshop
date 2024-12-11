class ProductGrid extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Initialize the component
        this.render();
    }

    render() {
        // Populate the product grid
        this.innerHTML = `
            <div id="product-grid" class="product-grid">
                <!-- Products will be dynamically inserted here -->
            </div>
        `;
    }
}

// Define the custom element
customElements.define('product-grid', ProductGrid);