(async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id')); 

    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        
        const product = products.find(p => p.id === productId);

        if (!product) {
            alert('Product not found');
            return;
        }

        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = `Бүтээгдэхүүний нэр: ${product.description}`;
        document.getElementById('product-price').textContent = `Үнэ: ₮${product.price}`;
        document.getElementById('product-category').textContent = `Төрөл: ${product.category}`;
        document.getElementById('product-brand').textContent = `Брэнд: ${product.brand}`;
        document.getElementById('product-weight').textContent = `Жин: ${product.weight}kg`;

        const rating = product.rating;
        const fullStars = Math.floor(rating); 
        const halfStar = (rating % 1) >= 0.5 ? 1 : 0; 
        const emptyStars = 5 - fullStars - halfStar; 

        const ratingStars = '<i class="fas fa-star"></i>'.repeat(fullStars) +
            (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
            '<i class="far fa-star"></i>'.repeat(emptyStars);

        document.getElementById('product-rating').innerHTML = `Rating: ${ratingStars} (${rating})`;

        const mainImage = document.getElementById('main-image');
        mainImage.src = product.images[0];

        const startIndex = 0; 
        const endIndex = 7;  
        const thumbnailContainer = document.getElementById('thumbnail-container');
        if (thumbnailContainer) {
            product.subimages.slice(startIndex, endIndex).forEach((image, index) => {
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

        const colorOptionsContainer = document.querySelector('.color-options');
        
        if (colorOptionsContainer && thumbnailContainer) {
            product.baraaniiungu.forEach((image, colorIndex) => {
                const colorBox = document.createElement('div');
                colorBox.classList.add('color-box');
                colorBox.style.backgroundImage = `url(${image})`;
                colorBox.style.backgroundSize = 'cover';
                colorBox.style.backgroundPosition = 'center';
        
                colorBox.addEventListener('click', () => {
                    document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
                    colorBox.classList.add('active');
                    mainImage.src = image;
                    thumbnailContainer.innerHTML = '';
                    const startIndex = colorIndex * 7; 
                    const endIndex = startIndex + 7;  
        
                    product.subimages.slice(startIndex, endIndex).forEach((subImage, index) => {
                        const img = document.createElement('img');
                        img.src = subImage;
                        img.alt = `${product.name} thumbnail ${startIndex + index + 1}`;
                        img.classList.add('thumbnail');
        
                        img.addEventListener('click', () => {
                            mainImage.src = subImage;
                        });
        
                        thumbnailContainer.appendChild(img);
                    });
                });
        
                colorOptionsContainer.appendChild(colorBox);
            });
        }

        // Хамааралтай бараа
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
                        <p>₮${relatedProduct.price}</p>
                        <button onclick="location.href='productInfo.html?id=${relatedProduct.id}'">Харах</button>
                    `;
                    relatedProductsContainer.appendChild(relatedCard);
                });
        }

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
        
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }
    
        document.querySelector('.add-to-cart-button').addEventListener('click', () => {
            const id = product.id;
            const name = product.name;
            const price = product.price;
            const thumbnail = product.thumbnail;
    
            // LocalStorage-д өгөгдөл нэмэх
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === id);
    
            if (existingItem) {
                alert('Энэ бараа таны сагсанд аль хэдийн нэмэгдсэн байна!');
                return;
            }
    
            cart.push({ id, name, price, thumbnail });
            localStorage.setItem('cart', JSON.stringify(cart));

            showCartNotification({ id, name, price, thumbnail });
        });

  
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
        const sizeButtons = document.querySelectorAll('.size-btn');
        if (sizeButtons) {
            sizeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    sizeButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
    }
    catch (error) {
        console.error('Алдаа:', error);
    }
})();