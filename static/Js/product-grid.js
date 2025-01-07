class ProductGrid extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        await this.fetchProducts();
        this.render();
    }

    async fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/products');
            this.products = await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    render() {
        if (!this.products) {
            this.innerHTML = '<p>Loading...</p>';
            return;
        }

        this.innerHTML = `
            <div id="product-grid" class="product-grid">
                ${this.products.map(product => `
                    <div class="product-item">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: ${product.price}₮</p>
                        <p>Category: ${product.category}</p>
                        <p>Rating: ${product.rating}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('product-grid', ProductGrid);