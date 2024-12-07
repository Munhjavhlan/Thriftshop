const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id')); // Ensure the ID is a number

if (!productId) {
    alert('Invalid or missing product ID');
} else {
    fetch('./static/products.json')
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            const product = products.find(p => p.id === productId);

            if (!product) {
                alert('Product not found');
                return;
            }

            // Populate product details
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-description').textContent = `Description: ${product.description}`;
            document.getElementById('product-price').textContent = `Price: $${product.price}`;
            document.getElementById('product-category').textContent = `Category: ${product.category}`;
            document.getElementById('product-brand').textContent = `Brand: ${product.brand}`;
            document.getElementById('product-weight').textContent = `Weight: ${product.weight}kg`;

                // Rating: Display dynamic stars
                const rating = product.rating;
                const fullStars = Math.floor(rating); // Бүхэл однууд
                const halfStar = (rating % 1) >= 0.5 ? 1 : 0; // Хагас од
                const emptyStars = 5 - fullStars - halfStar; // Хоосон однууд

                                            // ★ - Бүхэл од, ☆ - Хоосон од, 🌓 - Хагас од
                                        const ratingStars = '<i class="fas fa-star"></i>'.repeat(fullStars) +
                    (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
                    '<i class="far fa-star"></i>'.repeat(emptyStars);

                    document.getElementById('product-rating').innerHTML = `Rating: ${ratingStars} (${rating})`;

            // Main image and thumbnails
            const mainImage = document.getElementById('main-image');
            mainImage.src = product.images[0];

            const thumbnailContainer = document.getElementById('thumbnail-container');
            if (thumbnailContainer) {
                product.subImages.forEach((image, index) => {
                    const img = document.createElement('img');
                    img.src = image;
                    img.alt = `${product.name} thumbnail ${index + 1}`;
                    img.classList.add('thumbnail');

                    img.addEventListener('click', () => {
                        mainImage.src = image;
                    });

                    thumbnailContainer.appendChild(img);
                });
            }

            // Color options
            const colorOptionsContainer = document.querySelector('.color-options');
            if (colorOptionsContainer) {
                product.subImages.forEach(image => {
                    const colorBox = document.createElement('div');
                    colorBox.classList.add('color-box');
                    colorBox.style.backgroundImage = `url(${image})`;
                    colorBox.style.backgroundSize = 'cover';
                    colorBox.style.backgroundPosition = 'center';

                    colorBox.addEventListener('click', () => {
                        document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
                        colorBox.classList.add('active');
                        mainImage.src = image;
                    });

                    colorOptionsContainer.appendChild(colorBox);
                });
            }

            // Related products
            const relatedProductsContainer = document.getElementById('related-products');
            if (relatedProductsContainer) {
                products
                    .filter(p => p.id !== product.id)
                    .slice(0, 4)
                    .forEach(relatedProduct => {
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
            }

            // Add to cart
            const addToCartButton = document.getElementById('add-to-cart');
            if (addToCartButton) {
                addToCartButton.addEventListener('click', () => {
                    alert(`${product.name} has been added to your cart.`);
                });
            }

            // Quantity buttons
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const input = document.querySelector('.quantity-input');
                    let currentValue = parseInt(input.value) || 1;

                    if (btn.dataset.action === 'decrement' && currentValue > 1) {
                        input.value = currentValue - 1;
                    } else if (btn.dataset.action === 'increment') {
                        input.value = currentValue + 1;
                    }
                });
            });

            // Size selection
            const sizeButtons = document.querySelectorAll('.size-btn');
            if (sizeButtons) {
                sizeButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        sizeButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    });
                });
            }
        })
        .catch(err => {
            console.error('Error fetching product data:', err);
            alert('Failed to load product data.');
        });
}
