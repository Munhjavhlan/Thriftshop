document.addEventListener('DOMContentLoaded', () => {
    fetch('static/products.json')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Өгөгдөл татахад алдаа гарлаа');
            }
        })
        .then(data => {
            const products = data.products;

            // Find the maximum price dynamically
            const maxPrice = Math.max(...products.map(product => product.price));

            const rangeMin = document.getElementById('min-price');
            const rangeMax = document.getElementById('max-price');
            const minLabel = document.getElementById('min-price-display');
            const maxLabel = document.getElementById('max-price-display');
            const rangeFill = document.querySelector('.slider-track');

            // Хайлтын хэсэг
            const searchInput = document.getElementById('search-input');
            const searchButton = document.getElementById('search-button');

            // Хайлтын функц
            function searchProducts() {
                const searchTerm = searchInput.value.trim().toLowerCase();

                // Хоосон байвал бүх бараа харагдана
                if (searchTerm === '') {
                    renderProducts(products);
                    return;
                }

                // Хайлтын шүүлт
                const searchResults = products.filter(product => 
                    // Бараа нэрээр хайх
                    product.name.toLowerCase().includes(searchTerm) ||
                    
                    // Түлхүүр үгээр хайх
                    product.tag.some(keyword => 
                        keyword.toLowerCase().includes(searchTerm)
                    ) ||
                    
                    // Үнээр хайх
                    product.price.toString().includes(searchTerm) ||
                    
                    // Үнэлгээгээр хайх
                    product.rating.toString().includes(searchTerm)
                );

                // Хайлтын үр дүнг рендер хийх
                renderProducts(searchResults);
            }

            // Хайлтын товч дээр эвент листенер
            searchButton.addEventListener('click', searchProducts);

            // Enter дарахад хайх
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    searchProducts();
                }
            });

            // Хоосон болгоход бүх бараа харагдана
            searchInput.addEventListener('input', () => {
                if (searchInput.value.trim() === '') {
                    renderProducts(products);
                }
            });

            // Set the max attribute of max price slider dynamically
            rangeMax.setAttribute('max', maxPrice);
            // Set initial max value to maxPrice
            rangeMax.value = maxPrice;
            // Update max label to show maxPrice
            maxLabel.textContent = `$${maxPrice}`;

            function controlFromInput(fromSlider, fromInput, toSlider, toInput) {
                const [from, to] = getParsedValues(fromSlider, toSlider);
                fillSlider(fromSlider, toSlider, toInput);
                
                if (from > to) {
                    fromSlider.value = to;
                    fromInput.textContent = `$${to}`;
                } else {
                    fromInput.textContent = `$${from}`;
                }
            }

            function controlToInput(fromSlider, fromInput, toSlider, toInput) {
                const [from, to] = getParsedValues(fromSlider, toSlider);
                fillSlider(fromSlider, toSlider, toInput);
                
                if (from <= to) {
                    toSlider.value = to;
                    toInput.textContent = `$${to}`;
                }
            }

            function getParsedValues(currentFrom, currentTo) {
                const from = parseInt(currentFrom.value);
                const to = parseInt(currentTo.value);
                return [from, to];
            }

            function fillSlider(fromSlider, toSlider, toInput) {
                const fromValue = parseInt(fromSlider.value);
                const toValue = parseInt(toSlider.value);
                const percentage = ((toValue - fromSlider.min) / (toSlider.max - fromSlider.min)) * 100;
                const fromPercentage = ((fromValue - fromSlider.min) / (fromSlider.max - fromSlider.min)) * 100;
                
                rangeFill.style.left = `${fromPercentage}%`;
                rangeFill.style.width = `${percentage - fromPercentage}%`;
                
                toInput.textContent = `$${toValue}`;
            }

            // Initial fill
            fillSlider(rangeMin, rangeMax, maxLabel);

            // Event Listeners for Price Range
            rangeMin.addEventListener('input', () => {
                controlFromInput(rangeMin, minLabel, rangeMax, maxLabel);
            });

            rangeMax.addEventListener('input', () => {
                controlToInput(rangeMin, minLabel, rangeMax, maxLabel);
            });

            // Keyword Input Logic
            const keywordInput = document.getElementById('keyword');
            const addKeywordButton = document.getElementById('add-keyword');
            const keywordDisplay = document.getElementById('keyword-display');

            // Function to add a new keyword
            function addKeyword() {
                const keyword = keywordInput.value.trim();
                
                // Check if keyword is not empty and not already exists
                if (keyword && !isKeywordExists(keyword)) {
                    // Create keyword tag element
                    const keywordTag = document.createElement('div');
                    keywordTag.classList.add('keyword-tag');
                    keywordTag.innerHTML = `
                        ${keyword} <button class="remove-keyword">&times;</button>
                    `;

                    // Add remove functionality to the tag
                    const removeButton = keywordTag.querySelector('.remove-keyword');
                    removeButton.addEventListener('click', () => {
                        keywordDisplay.removeChild(keywordTag);
                    });

                    // Append to keyword display
                    keywordDisplay.appendChild(keywordTag);

                    // Clear input
                    keywordInput.value = '';
                }
            }

            function isKeywordExists(newKeyword) {
                const existingKeywords = Array.from(
                    keywordDisplay.querySelectorAll('.keyword-tag')
                ).map(tag => tag.textContent.trim().replace('×', '').trim());
                
                return existingKeywords.includes(newKeyword);
            }

            addKeywordButton.addEventListener('click', addKeyword);


            keywordInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    addKeyword();
                }
            });

            // Product Grid and Sorting Logic
            const productGrid = document.getElementById('product-grid');
            const sortButtons = document.querySelectorAll('.sort-button');

            function renderProducts(filteredProducts) {
                productGrid.innerHTML = ''; // Grid-г хоослох
                filteredProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
                        <h3>${product.name}</h3>
                        <p>Үнэ: ${product.price}₮</p>
                    `;
                    productGrid.appendChild(productCard);
                });
            }
            
            

            function filterProducts() {
                const minPrice = parseInt(rangeMin.value);
                const maxPrice = parseInt(rangeMax.value);
                
                // Update price range display
                minLabel.textContent = `$${minPrice}`;
                maxLabel.textContent = `$${maxPrice}`;

                // Filter tag from added tags
                const filterKeywords = Array.from(
                    keywordDisplay.querySelectorAll('.keyword-tag')
                ).map(tag => tag.textContent.trim().replace('×', '').trim());

                let filteredProducts = products.filter(product => {
                    const priceInRange = product.price >= minPrice && product.price <= maxPrice;
                    const matchesKeywords = filterKeywords.length === 0 || 
                        filterKeywords.some(keyword => 
                            product.tag.some(prodKeyword => 
                                prodKeyword.toLowerCase().includes(keyword.toLowerCase())
                            )
                        );
                    
                    return priceInRange && matchesKeywords;
                });

                renderProducts(filteredProducts);
            }

            // Sort event listeners
            sortButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    sortButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    let sortedProducts = [...products];
                    const sortType = button.getAttribute('data-sort');

                    switch(sortType) {
                        case 'price-asc':
                            sortedProducts.sort((a, b) => a.price - b.price);
                            break;
                        case 'price-desc':
                            sortedProducts.sort((a, b) => b.price - a.price);
                            break;
                        case 'rating':
                            sortedProducts.sort((a, b) => b.rating - a.rating);
                            break;
                    }

                    renderProducts(sortedProducts);
                });
            });

            // Price range and keyword event listeners
            rangeMin.addEventListener('input', filterProducts);
            rangeMax.addEventListener('input', filterProducts);
            addKeywordButton.addEventListener('click', filterProducts);
            keywordInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    filterProducts();
                }
            });

            // Dynamically update keyword removal to trigger filtering
            keywordDisplay.addEventListener('click', (event) => {
                if (event.target.classList.contains('remove-keyword')) {
                    filterProducts();
                }
            });

            // Initial render
            renderProducts(products);
        })
        
});