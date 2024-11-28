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
              // Сүүлд хэрэглэсэн шүүлтүүрийг сэргээх
              const savedMinPrice = localStorage.getItem('minPrice');
              const savedMaxPrice = localStorage.getItem('maxPrice');
              const savedKeywords = JSON.parse(localStorage.getItem('keywords')) || [];
              const savedSearchTerm = localStorage.getItem('searchTerm') || '';
              const savedSortOrder = localStorage.getItem('sortOrder') || '';
  
              if (savedMinPrice) rangeMin.value = savedMinPrice;
              if (savedMaxPrice) rangeMax.value = savedMaxPrice;
              if (savedKeywords.length > 0) {
                savedKeywords.forEach(keyword => {
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
                });
            }
              if (savedSearchTerm) searchInput.value = savedSearchTerm;
              if (savedSortOrder) {
                  sortButtons.forEach(button => {
                      if (button.getAttribute('data-sort') === savedSortOrder) {
                          button.classList.add('active');
                      }
                  });
              }
            

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
                const existingKeywords = Array.from(keywordDisplay.querySelectorAll('.keyword-tag'))
                    .map(tag => tag.textContent.trim().replace('×', '').trim());
                return existingKeywords.includes(newKeyword);
            }

           

            function renderProducts(filteredProducts) {
                currentProducts = filteredProducts;
                const startIndex = (currentPage - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
            
                productGrid.innerHTML = '';
                paginatedProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    
                    // Add product image and heart button
                    productCard.innerHTML = `
                        <div class="product-image-container">
                            <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
                            <button class="heart-button" data-id="${product.id}"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"
                    fill="353943">
                    <path
                        d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917Z"
                        fill="#1C274C" />
                </svg></button>
                        </div>
                        <a href="productInfo.html?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}&thumbnail=${encodeURIComponent(product.thumbnail)}" class="product-link">
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
                const searchTerm = searchInput.value.trim().toLowerCase();

                minLabel.textContent = `$${minPrice}`;
                maxLabel.textContent = `$${maxPrice}`;

                const filterKeywords = Array.from(keywordDisplay.querySelectorAll('.keyword-tag'))
                    .map(tag => tag.textContent.trim().replace('×', '').trim());

                const filteredProducts = products.filter(product => {
                    const priceInRange = product.price >= minPrice && product.price <= maxPrice;
                    const matchesKeywords = filterKeywords.length === 0 || filterKeywords.some(keyword =>
                        product.tag.some(prodKeyword => prodKeyword.toLowerCase().includes(keyword.toLowerCase()))
                    );
                    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm);

                    return priceInRange && matchesKeywords && matchesSearchTerm;
                });

                renderProducts(filteredProducts);
                saveFilterState(minPrice, maxPrice, filterKeywords, searchTerm);
            }
            function saveFilterState(minPrice, maxPrice, keywords, searchTerm) {
                localStorage.setItem('minPrice', minPrice);
                localStorage.setItem('maxPrice', maxPrice);
                localStorage.setItem('keywords', JSON.stringify(keywords));
                localStorage.setItem('searchTerm', searchTerm);
            }
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim();
                localStorage.setItem('searchTerm', searchTerm);
                filterProducts();
            });
            searchInput.addEventListener('input', () => {
                localStorage.setItem('searchTerm', searchInput.value.trim());
            });

            rangeMin.addEventListener('input', filterProducts);
            rangeMax.addEventListener('input', filterProducts);
            addKeywordButton.addEventListener('click', filterProducts);
            keywordInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    filterProducts();
                }
            });
            addKeywordButton.addEventListener('click', () => {
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
document.addEventListener('DOMContentLoaded', () => {
    function showCartNotification(item) {
        const notification = document.getElementById('cart-notification');
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${item.thumbnail}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 4px;">
                <div>
                    <p style="margin: 0; font-size: 14px; font-weight: bold;">${item.name}</p>
                    <p style="margin: 0; font-size: 12px; color: #888;">Сагсанд нэмэгдлээ!</p>
                </div>
            </div>
        `;
    
        // Мэдэгдлийг харуулах
        notification.classList.add('show');
    
        // 2 секундийн дараа автоматаар алга болгох
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

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

            // Мэдэгдэл харуулах
            showCartNotification({ id, name, price, thumbnail });
        }
    });
});


// Cart.html-д сагсыг харуулах
if (window.location.pathname.endsWith('Cart.html')) {
    const cartList = document.querySelector('cart-list');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.forEach(item => cartList.addItem(item));
}
