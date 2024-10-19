    const scrollLeftButton = document.querySelector('.scroll-left');
    const scrollRightButton = document.querySelector('.scroll-right');
    const productContainer = document.querySelector('.product-container');

    scrollLeftButton.addEventListener('click', () => {
        productContainer.scrollBy({
            left: -200, // Scroll to the left by 200px
            behavior: 'smooth'
        });
    });

    scrollRightButton.addEventListener('click', () => {
        productContainer.scrollBy({
            left: 200, // Scroll to the right by 200px
            behavior: 'smooth'
        });
    });



const toggleButton = document.getElementById('toggleButton');
const body = document.body;

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode'); // Toggle dark mode class
});
