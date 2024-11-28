document.addEventListener('DOMContentLoaded', () => {
    // URL параметрийг авах
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q'); // q параметрийг авна

    // JSON файлыг серверээс татаж авах
    fetch('static/products.json')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Өгөгдөл татахад алдаа гарлаа');
            }
        })
        .then(data => {
            const products = data.products; // JSON дахь бүтээгдэхүүнүүд

            // Хайлтын утга байгаа эсэхийг шалгах
            if (searchQuery) {
                displayProducts(products, searchQuery);
            } else {
                displayProducts(products); // Хайлтын утга байхгүй бол бүх бүтээгдэхүүнүүдийг харуулах
            }
        })
        .catch(error => {
            console.error('Алдаа:', error);
        });

    // Бүтээгдэхүүнүүдийг дэлгэцэнд харуулах функц
    function displayProducts(products, query = '') {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = ''; // Өмнөх бүтээгдэхүүнүүдийг цэвэрлэх

        // Хайлтын утгатай тохирсон бүтээгдэхүүнүүдийг шүүж гаргах
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) // Хайлтын үгтэй тохирох бүтээгдэхүүнийг шүүж гаргах
        );

        // Хайлтад тохирсон бүтээгдэхүүнүүдийг дэлгэцэнд харуулах
        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
                    <button class="heart-button" data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="353943">
                            <path d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917Z" fill="#1C274C" />
                        </svg>
                    </button>
                </div>
                <a href="productInfo.html?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${product.price}&thumbnail=${encodeURIComponent(product.thumbnail)}" class="product-link">
                    <h3>${product.name}</h3>
                    <p>Үнэ: ${product.price}₮</p>
                </a>
                <button class="add-to-cart-button" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-thumbnail="${product.thumbnail}">Сагслах</button>
            `;
            productGrid.appendChild(productElement);
        });

        // Хэрэв тохирох бүтээгдэхүүн олдсонгүй бол, харуулах
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p>Тохирох бүтээгдэхүүн олдсонгүй.</p>';
        }
    }

    // Хайлтын товчийг дарахад хайлт хийх
    document.getElementById('search-button').addEventListener('click', function() {
        const query = document.getElementById('search-input').value;
        // Хайлтын утгыг URL-ээр дамжуулах
        if (query) {
            window.history.pushState(null, '', `?q=${query}`);
            displayProducts(products, query);
        }
    });
});