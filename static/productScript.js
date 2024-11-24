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
            let currentPage = 1;
            const productsPerPage = 9;
            let currentProducts = [...products];
            const maxPrice = Math.max(...products.map(product => product.price));

            const rangeMin = document.getElementById('min-price');
            const rangeMax = document.getElementById('max-price');
            const minLabel = document.getElementById('min-price-display');
            const maxLabel = document.getElementById('max-price-display');
            const rangeFill = document.querySelector('.slider-track');
            const searchInput = document.getElementById('search-input');
            const searchButton = document.getElementById('search-button');
            const keywordInput = document.getElementById('keyword');
            const addKeywordButton = document.getElementById('add-keyword');
            const keywordDisplay = document.getElementById('keyword-display');
            const productGrid = document.getElementById('product-grid');
            const sortButtons = document.querySelectorAll('.sort-button');

            rangeMax.setAttribute('max', maxPrice);
            rangeMax.value = maxPrice;
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

            fillSlider(rangeMin, rangeMax, maxLabel);

            rangeMin.addEventListener('input', () => {
                controlFromInput(rangeMin, minLabel, rangeMax, maxLabel);
            });

            rangeMax.addEventListener('input', () => {
                controlToInput(rangeMin, minLabel, rangeMax, maxLabel);
            });

            function addKeyword() {
                const keyword = keywordInput.value.trim();

                if (keyword && !isKeywordExists(keyword)) {
                    const keywordTag = document.createElement('div');
                    keywordTag.classList.add('keyword-tag');
                    keywordTag.innerHTML = `${keyword} <button class="remove-keyword">&times;</button>`;
                    const removeButton = keywordTag.querySelector('.remove-keyword');
                    removeButton.addEventListener('click', () => {
                        keywordDisplay.removeChild(keywordTag);
                        filterProducts();
                    });
                    keywordDisplay.appendChild(keywordTag);
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

            function renderProducts(filteredProducts) {
                currentProducts = filteredProducts;
                const startIndex = (currentPage - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

                productGrid.innerHTML = '';
                paginatedProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <a href="productInfo.html?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}&thumbnail=${encodeURIComponent(product.thumbnail)}" class="product-link">
                            <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
                            <h3>${product.name}</h3>
                            <p>Үнэ: ${product.price}₮</p>
                        </a>
                        <button class="add-to-cart-button" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-thumbnail="${product.thumbnail}">Сагслах</button>
                    `;
                    productGrid.appendChild(productCard);
                });
                updatePagination(filteredProducts.length);
            }

            function updatePagination(totalProducts) {
                const totalPages = Math.ceil(totalProducts / productsPerPage);
                const paginationButtons = document.getElementById('pagination-buttons');
                const prevButton = document.getElementById('prev-button');
                const nextButton = document.getElementById('next-button');

                paginationButtons.innerHTML = '';
                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.classList.add('pagination-number');
                    if (i === currentPage) {
                        pageButton.classList.add('active');
                    }
                    pageButton.textContent = i;
                    pageButton.addEventListener('click', () => {
                        currentPage = i;
                        renderProducts(currentProducts);
                    });
                    paginationButtons.appendChild(pageButton);
                }

                prevButton.disabled = currentPage === 1;
                nextButton.disabled = currentPage === totalPages;
                prevButton.onclick = () => {
                    if (currentPage > 1) {
                        currentPage--;
                        renderProducts(currentProducts);
                    }
                };
                nextButton.onclick = () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderProducts(currentProducts);
                    }
                };
            }

            function filterProducts() {
                const minPrice = parseInt(rangeMin.value);
                const maxPrice = parseInt(rangeMax.value);

                minLabel.textContent = `$${minPrice}`;
                maxLabel.textContent = `$${maxPrice}`;

                const filterKeywords = Array.from(
                    keywordDisplay.querySelectorAll('.keyword-tag')
                ).map(tag => tag.textContent.trim().replace('×', '').trim());

                const filteredProducts = products.filter(product => {
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

            rangeMin.addEventListener('input', filterProducts);
            rangeMax.addEventListener('input', filterProducts);
            addKeywordButton.addEventListener('click', filterProducts);
            keywordInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    filterProducts();
                }
            });

            keywordDisplay.addEventListener('click', (event) => {
                if (event.target.classList.contains('remove-keyword')) {
                    filterProducts();
                }
            });

            sortButtons.forEach(button => {
                button.addEventListener('click', () => {
                    sortButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    let sortedProducts = [...products];
                    const sortType = button.getAttribute('data-sort');

                    switch (sortType) {
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

            renderProducts(products);
        });
});
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-button')) {
        const id = event.target.getAttribute('data-id');
        const name = event.target.getAttribute('data-name');
        const price = event.target.getAttribute('data-price');
        const thumbnail = event.target.getAttribute('data-thumbnail');

        // LocalStorage-д хадгалах
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ id, name, price, thumbnail });
        localStorage.setItem('cart', JSON.stringify(cart));

        alert('Бараа амжилттай сагслагдлаа!');
    }
});

// Cart.html-д сагсыг харуулах
if (window.location.pathname.endsWith('Cart.html')) {
    const cartList = document.querySelector('cart-list');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.forEach(item => cartList.addItem(item));
}
