class ProductGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <template id="product-grid-template">
                <style>
                    .product-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 16px;
                    }
                    :host(:hover) .product-grid {
                        background-color: var(--secondary-color);
                    }
                    :host([hidden]) .product-grid {
                        display: none;
                    }
                </style>
                <div id="product-grid" class="product-grid">
                    <slot name="product"></slot>
                    <slot name="product-details"></slot>
                </div>
            </template>
        `;
        const template = this.shadowRoot.getElementById('product-grid-template');
        const clone = document.importNode(template.content, true);
        this.shadowRoot.appendChild(clone);
    }
}

customElements.define('product-grid', ProductGrid);