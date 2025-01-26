import { fetchData, renderProducts, filterProducts, updateUrl } from "./productUtils.js";
import { addToCart, renderCart } from "./cart.js";
import { addToWishlist } from "./wishlist.js";
import { toggleSidebar } from "./sidebar.js";

document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchData();
    const products = data.products;
    let currentPage = 1;
    const productsPerPage = 9;
    let currentProducts = [...products];
    const maxPrice = Math.max(...products.map((product) => product.price));

    const rangeMin = document.getElementById("min-price");
    const rangeMax = document.getElementById("max-price");
    const minLabel = document.getElementById("min-price-display");
    const maxLabel = document.getElementById("max-price-display");
    const rangeFill = document.querySelector(".slider-track");
    const searchInput = document.querySelector(".search-input");
    const searchButton = document.querySelector(".search-button");
    const keywordInput = document.getElementById("keyword");
    const addKeywordButton = document.getElementById("add-keyword");
    const keywordDisplay = document.getElementById("keyword-display");
    const productGrid = document.getElementById("product-grid");
    const sortButtons = document.querySelectorAll(".sort-button");

    // ...existing code...

    renderProducts(products, currentPage, productsPerPage, productGrid, currentProducts);
});

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart-button")) {
            const id = event.target.getAttribute("data-id");
            const name = event.target.getAttribute("data-name");
            const price = event.target.getAttribute("data-price");
            const thumbnail = event.target.getAttribute("data-thumbnail");

            const item = { id, name, price, thumbnail };

            addToCart(item);
        }
    });

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("heart-button")) {
            const id = event.target.getAttribute("data-id");
            const name = event.target.getAttribute("data-name");
            const price = event.target.getAttribute("data-price");
            const thumbnail = event.target.getAttribute("data-thumbnail");

            const item = { id, name, price, thumbnail };

            addToWishlist(item);
        }
    });

    if (window.location.pathname.endsWith("Cart.html")) {
        renderCart();
    }
});

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggleButton1 = document.getElementById("toggle-sidebar");

toggleButton1.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);
