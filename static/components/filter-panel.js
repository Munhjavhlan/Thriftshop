class FilterPanel extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.#render();
    }

    #render() { 
        this.innerHTML = `
         <div class="filter-panel"  id="sidebar">
            <!-- Keywords Section -->
            <div class="filter-group">
                <h4>Барааны төрөл</h4>
                <div class="keyword-input">
                    <input type="text" id="keyword" placeholder="Барааны төрөл нэмэх...">
                    <button id="add-keyword" aria-label="нэмэх">Нэмэх</button>
                </div>
                <div class="keyword-display" id="keyword-display">
                </div>
            </div>

            <div class="filter-section">
                <label>Ангилал:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" id="label-1" checked > Эрэгтэй</label>
                    <label><input type="checkbox" id="label-2" > Эмэгтэй</label>
                    <label><input type="checkbox" id="label-3" > Хүүхдийн</label>
                </div>
            </div>

            <!-- Price Range Slider -->
            <div class="filter-section">
                <label>Price Range:</label>
                <div class="slider-container">
                    <div class="slider-track"></div>
                    <input type="range" id="min-price" min="0" step="1" value="0" aria-label="Minimum price">
                    <input type="range" id="max-price" min="0" step="1" value="100" aria-label="Maximum price">
                    
                </div>
                <div class="price-display">
                    <span id="min-price-display">0₮</span> - <span id="max-price-display">100₮</span>
                </div>
            </div>

            <!-- Color Section -->
            <div class="filter-section">
                <label>Color:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked> Red</label>
                    <label><input type="checkbox" checked> Blue</label>
                    <label><input type="checkbox" checked> Green</label>
                </div>
            </div>

            <!-- Size Section -->
            <div class="filter-section">
                <label>Size:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked> Жижиг</label>
                    <label><input type="checkbox" checked> Энгийн</label>
                    <label><input type="checkbox" checked> Том</label>
                </div>
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

window.customElements.define('filter-panel', FilterPanel);