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
    document.getElementById("navToggle").addEventListener("click", function() {
        document.getElementById("navMenu").classList.toggle("show");
    });
    


    const toggleButton = document.getElementById("toggleButton");

    toggleButton.addEventListener("click", () => {
        if (document.body.classList.contains("light-mode")) {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
        }
    });
    