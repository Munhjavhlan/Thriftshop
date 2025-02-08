class FilterBar extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.#render();
    }

    #render() { 
        this.innerHTML = `
               
        <div class="filter-bar">
            <div class="search-container">
                <label for="search-input-2" class="sr-only"></label>
                <input id="search-input-2" class="search-input" type="text" placeholder="  бүтээгдэхүүн хайх..." aria-label="Search products" />
                <button id="search-button" class="search-button" aria-label="Submit search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                </button>
                <button id="toggle-sidebar" aria-label="Фильтрүүдийг харуулах/нуух"  align-items: center;>☰</button>
            </div>
           
            <div class="sort-buttons">
                <p id="erembleh">Эрэмбэлэх:</p>
                <button class="sort-button" data-sort="price-asc" aria-label="үнэӨсөх">
                    <i>▲</i> <span>Үнэ өсөх</span>
                </button>
                <button class="sort-button" data-sort="price-desc" aria-label="үнэБуурах">
                    <i>▼</i> <span>Үнэ буурах</span>
                </button>
                <button class="sort-button" data-sort="rating" aria-label="үнэлгээ">
                    <i>★</i> <span>Үнэлгээ</span>
                </button>
            </div>
        </div>`;
    }
    
    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

}

window.customElements.define('filter-bar', FilterBar);