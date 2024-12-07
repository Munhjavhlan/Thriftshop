document.addEventListener('DOMContentLoaded', () => {

    fetch('./static/products.json')
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            const product = products.find(p => p.id === productId);

            if (!product) {
                alert('Product not found');
                return;
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

        

        })
        .catch(err => {
            console.error('Error fetching product data:', err);
            alert('Failed to load product data.');
        });
});
