document.addEventListener("DOMContentLoaded", async () => {
    const fetchData = async () => {
        const response = await fetch("static/products.json");
        if (!response.ok) {
            throw new Error("Өгөгдөл татахад алдаа гарлаа");
        }
        return response.json();
    };
    fetchData().then((data) => {
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

        function updateUrl() {
            const params = new URLSearchParams(window.location.search);
            const searchTerm = params.get("searchTerm");
            const minPrice = rangeMin.value;
            const maxPrice = rangeMax.value;
            const keywords = Array.from(
                keywordDisplay.querySelectorAll(".keyword-tag")
            ).map((tag) => tag.textContent.trim().replace("×", "").trim());

            const urlParams = new URLSearchParams();
            if (searchTerm) urlParams.set("q", searchTerm);
            if (minPrice) urlParams.set("minPrice", minPrice);
            if (maxPrice) urlParams.set("maxPrice", maxPrice);
            keywords.forEach((keyword, index) => {
                urlParams.append("keywords[]", keyword);
            });

            const newUrl = `${window.location.origin}${window.location.pathname
                }?${urlParams.toString()}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
        }

        document
            .getElementById("search-button")
            .addEventListener("click", function () {
                const searchInput = document.getElementById("search-input-2");

                if (searchInput) {
                    const searchValue = searchInput.value.trim();

                    if (searchValue) {
                      
                        const currentUrl = window.location.href.split("?")[0]; 
                        const newUrl = `${currentUrl}?searchTerm=${encodeURIComponent(
                            searchValue
                        )}`;
                        window.history.pushState({}, "", newUrl); 

                        console.log("Search term added to URL:", newUrl);
                    } else {
                        console.log("Input is empty. Nothing to save.");
                    }
                } else {
                    console.error("Input element not found.");
                }
                filterProducts(); 
            });

        rangeMax.setAttribute("max", maxPrice);
        rangeMin.setAttribute("max", maxPrice);
        rangeMax.value = maxPrice;
        maxLabel.textContent = `$${maxPrice}`;

        function updateMinSliderMax() {
            rangeMin.setAttribute("max", rangeMax.value); 
        }

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
            const from = Number(currentFrom.value);
            const to = Number(currentTo.value);
            return [from, to];
        }

        function fillSlider(fromSlider, toSlider, toInput) {
            const fromValue = Number(fromSlider.value);
            const toValue = Number(toSlider.value);
            const percentage =
                ((toValue - fromSlider.min) / (toSlider.max - fromSlider.min)) * 100;
            const fromPercentage =
                ((fromValue - fromSlider.min) / (fromSlider.max - fromSlider.min)) *
                100;

            rangeFill.style.left = `${fromPercentage}%`;
            rangeFill.style.width = `${percentage - fromPercentage}%`;

            toInput.textContent = `$${toValue}`;
        }

        fillSlider(rangeMin, rangeMax, maxLabel);

        rangeMin.addEventListener("input", () => {
            controlFromInput(rangeMin, minLabel, rangeMax, maxLabel);
        });

        rangeMax.addEventListener("input", () => {
            updateMinSliderMax();
            controlToInput(rangeMin, minLabel, rangeMax, maxLabel);
        });

        function isKeywordExists(newKeyword) {
            const existingKeywords = Array.from(
                keywordDisplay.querySelectorAll(".keyword-tag")
            ).map((tag) => tag.textContent.trim().replace("×", "").trim());
            return existingKeywords.includes(newKeyword);
        }

        function renderProducts(filteredProducts) {
            currentProducts = filteredProducts;
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

            productGrid.innerHTML = "";
            paginatedProducts.forEach((product) => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `
                        
                         <a href="productInfo.html?id=${product.id}" class="product-link">
                        <div class="product-image-container">
                            <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
                            
                        </div>

                            <h3>${product.name}</h3>
                            <p>Үнэ: ${product.price}₮</p>
                        </a>
                        <button aria-label="зүрх" class="heart-button" data-id="${product.id}"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"
                    fill="353943">
                    <path
                        d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917Z"
                        fill="#1C274C" />
                        </svg></button>
                        <button aria-label="Сагслах" class="add-to-cart-button" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-thumbnail="${product.thumbnail}">Сагслах</button>
                    `;

                productGrid.appendChild(productCard);
            });
            updatePagination(filteredProducts.length);
        }

        function updatePagination(totalProducts) {
            const totalPages = Math.ceil(totalProducts / productsPerPage);
            const paginationButtons = document.getElementById("pagination-buttons");
            const prevButton = document.getElementById("prev-button");
            const nextButton = document.getElementById("next-button");

            paginationButtons.innerHTML = "";
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement("button");
                pageButton.classList.add("pagination-number");
                if (i === currentPage) {
                    pageButton.classList.add("active");
                }
                pageButton.textContent = i;
                pageButton.addEventListener("click", () => {
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
            const minPrice = Number(rangeMin.value);
            const maxPrice = Number(rangeMax.value);
            const params = new URLSearchParams(window.location.search);
            const searchTerm = params.get("searchTerm");

            minLabel.textContent = `$${minPrice}`;
            maxLabel.textContent = `$${maxPrice}`;

            const filterKeywords =keywordDisplay.querySelectorAll(".keyword-tag")
            .map((tag) => tag.textContent.trim().replace("×", "").trim());

            const filteredProducts = products.filter((product) => {
                const priceInRange =
                    product.price >= minPrice && product.price <= maxPrice;
                const matchesKeywords =
                    filterKeywords.length === 0 ||
                    filterKeywords.some((keyword) =>
                        product.tag.some((prodKeyword) =>
                            prodKeyword.toLowerCase().includes(keyword.toLowerCase())
                        )
                    );
                const matchesSearchTerm =
                    !searchTerm ||
                    product.name.toLowerCase().includes(searchTerm.toLowerCase());

                return priceInRange && matchesKeywords && matchesSearchTerm;
            });

            renderProducts(filteredProducts);

            updateUrl();
        }
        searchInput.addEventListener("input", () => {
            const currentUrl = window.location.href.split("?")[0];
            const searchValue = searchInput.value.trim(); // Input талбараас одоогийн утгыг авна

            if (searchValue) {
                const newUrl = `${currentUrl}?searchTerm=${encodeURIComponent(
                    searchValue
                )}`;
                window.history.pushState({}, "", newUrl); // URL-ийг шинэчилнэ (Refresh хийхгүй)
                filterProducts();
            } else {
                // Хоосон үед query параметрийг устгана
                window.history.pushState({}, "", currentUrl);
                filterProducts();
            }
        });

 
        searchButton.addEventListener("click", (event) => {
            event.preventDefault(); // Default үйлдлийг болиулна (жишээ нь form submit хийхээс сэргийлэх)
            const currentUrl = window.location.href.split("?")[0];
            const searchValue = searchInput.value.trim(); // Input талбараас утгыг авна

            if (searchValue) {
                const newUrl = `${currentUrl}?searchTerm=${encodeURIComponent(
                    searchValue
                )}`;
                window.history.pushState({}, "", newUrl); // URL-ийг шинэчилнэ
                filterProducts();
            } else {
                // Хоосон үед query параметрийг устгана
                window.history.pushState({}, "", currentUrl);
                filterProducts();
            }
        });

        rangeMin.addEventListener("input", filterProducts);
        rangeMax.addEventListener("input", filterProducts);
        addKeywordButton.addEventListener("click", filterProducts);
        keywordInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                filterProducts();
            }
        });
        addKeywordButton.addEventListener("click", () => {
            const keyword = keywordInput.value.trim();
            if (keyword && !isKeywordExists(keyword)) {
                const keywordTag = document.createElement("div");
                keywordTag.classList.add("keyword-tag");
                keywordTag.innerHTML = `${keyword} <button class="remove-keyword">&times;</button>`;
                const removeButton = keywordTag.querySelector(".remove-keyword");
                removeButton.addEventListener("click", () => {
                    keywordDisplay.removeChild(keywordTag);
                    filterProducts();
                });
                keywordDisplay.appendChild(keywordTag);
                filterProducts();
            }
        });
        keywordDisplay.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-keyword")) {
                filterProducts();
            }
        });

        sortButtons.forEach((button) => {
            button.addEventListener("click", () => {
                sortButtons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");

                let sortedProducts = [...products];
                const sortType = button.getAttribute("data-sort");

                switch (sortType) {
                    case "price-asc":
                        sortedProducts.sort((a, b) => a.price - b.price);
                        break;
                    case "price-desc":
                        sortedProducts.sort((a, b) => b.price - a.price);
                        break;
                    case "rating":
                        sortedProducts.sort((a, b) => b.rating - a.rating);
                        break;
                }

                renderProducts(sortedProducts);
            });
        });

        renderProducts(products);
    });
});

import { addToCart, renderCart } from "./cart.js";

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

function addToWishlist(item) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.some(product => product.id === item.id)) {
        wishlist.push(item);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Бүтээгдэхүүн хүсэлтийн жагсаалтад нэмэгдлээ!");
    } else {
        alert("Энэ бүтээгдэхүүн аль хэдийн хүсэлтийн жагсаалтад байна.");
    }
}

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggleButton1 = document.getElementById("toggle-sidebar");

// Sidebar болон overlay-г харуулах/нуух функц
const toggleSidebar = () => {
    sidebar.classList.toggle("active"); // Sidebar-г идэвхжүүлэх/унтраах
    overlay.classList.toggle("active"); // Overlay-г идэвхжүүлэх/унтраах
    console.log(overlay.classList); // Debugging: Check overlay class
};

// Товчлуур дээр дарсан үед sidebar болон overlay-г харуулах/нуух
toggleButton1.addEventListener("click", toggleSidebar);

// Overlay дээр дарсан үед sidebar болон overlay-г нуух
overlay.addEventListener("click", toggleSidebar);
