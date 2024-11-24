const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// Fetch product data from products.json
fetch('./static/products.json')
    .then(response => response.json())
    .then(data => {
        const products = data.products;

        // Find the product by ID
        const product = products.find(p => p.id === parseInt(productId));

        if (product) {
            // Populate product details
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-description').textContent = "Description: " + product.description;
            document.getElementById('product-price').textContent = `Price: $${product.price}`;
            document.getElementById('product-category').textContent = "Category: " + product.category;
            document.getElementById('product-brand').textContent = "Brand: " + product.brand;
            document.getElementById('product-weight').textContent = `Weight: ${product.weight}kg`;

            // Rating: Display dynamic stars
            const rating = product.rating;
            const fullStars = Math.floor(rating); // Бүхэл однууд
            const halfStar = (rating % 1) >= 0.5 ? 1 : 0; // Хагас од
            const emptyStars = 5 - fullStars - halfStar; // Хоосон однууд

            // ★ - Бүхэл од, ☆ - Хоосон од, 🌓 - Хагас од
            const ratingStars = '★'.repeat(fullStars) + '🌓'.repeat(halfStar) + '☆'.repeat(emptyStars);

            document.getElementById('product-rating').textContent = `Rating: ${ratingStars} (${rating})`;

            // Display images and thumbnails
            document.getElementById('main-image').src = product.images[0]; // Display main image
            const thumbnailContainer = document.getElementById('thumbnail-container');
            product.subImages.forEach((image, index) => { // subImages массивыг ашиглана
                const img = document.createElement('img');
                img.src = image;
                img.alt = `${product.name} thumbnail ${index + 1}`;
                img.classList.add('thumbnail');

                // Зургийг дарахад гол зургаар солих функц
                img.addEventListener('click', () => {
                    document.getElementById('main-image').src = image;
                });

                thumbnailContainer.appendChild(img); // Зургийг container-д нэмэх
            });

            const colorOptionsContainer = document.querySelector('.color-options'); // Өнгөний сонголтын контейнер

            product.subImages.forEach((image, index) => { // subImages массивыг ашиглана
                const colorBox = document.createElement('div'); // Өнгөний хайрцаг үүсгэх
                colorBox.classList.add('color-box');

                // Зургийг background-д харуулах
                colorBox.style.backgroundImage = `url(${image})`;
                colorBox.style.backgroundSize = 'cover';
                colorBox.style.backgroundPosition = 'center';

                // Зураг сонгоход үндсэн зургийг өөрчлөх
                colorBox.addEventListener('click', () => {
                    document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
                    colorBox.classList.add('active');
                    mainImage.src = image; // Үндсэн зургийг солих
                });

                // Өнгөний контейнерт нэмэх
                colorOptionsContainer.appendChild(colorBox);
            });


            // Related Products Section: Show other products
            const relatedProductsContainer = document.getElementById('related-products');
            products.filter(p => p.id !== product.id).slice(0, 4).forEach(relatedProduct => {
                const relatedCard = document.createElement('div');
                relatedCard.classList.add('product-card');
                relatedCard.innerHTML = `
                    <img src="${relatedProduct.thumbnail}" alt="${relatedProduct.name}">
                    <p>${relatedProduct.name}</p>
                    <p>$${relatedProduct.price}</p>
                    <button onclick="location.href='productInfo.html?id=${relatedProduct.id}'">View</button>
                `;
                relatedProductsContainer.appendChild(relatedCard);
            });

            // Add to cart functionality
            document.getElementById('add-to-cart').addEventListener('click', () => {
                alert(`${product.name} has been added to your cart.`);
            });
        } else {
            alert('Product not found');
        }
    });
// Тоо ширхэг солих
document.querySelectorAll('.quantity-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const input = document.querySelector('.quantity-input'); // Тоо ширхэгийн input талбар
        let currentValue = parseInt(input.value) || 1; // Одоогийн утгыг авна (утга байхгүй бол 1)

        // Товчлуурын үйлдлийг шалгах
        if (btn.getAttribute('data-action') === 'decrement' && currentValue > 1) {
            input.value = currentValue - 1; // 1-ээр хасах
        } else if (btn.getAttribute('data-action') === 'increment') {
            input.value = currentValue + 1; // 1-ээр нэмэх
        }
    });
});

// Хэмжээ солих
document.querySelectorAll('.size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// өнгө солих
document.querySelectorAll('.color-box').forEach((box) => {
    box.addEventListener('click', () => {
        document.querySelectorAll('.color-box').forEach(b => b.classList.remove('active'));
        box.classList.add('active');
    });
});
