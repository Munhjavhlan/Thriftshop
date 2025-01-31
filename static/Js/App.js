import './cart-list.mjs';
class App extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
            <cart-list></cart-list>
        `;
    }
}

customElements.define('app-root', App);