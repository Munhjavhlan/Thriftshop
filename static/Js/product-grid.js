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
                
            </div>
        `;
    }
}


customElements.define('product-grid', ProductGrid);