document.addEventListener("DOMContentLoaded", () => {
    // Form elements
    const form = document.querySelector("form");
    const saveButton = document.querySelector(".search-button");
    const emailCheckbox = document.querySelector(".switch input[type='checkbox']");
    const phoneCheckbox = document.querySelector(".switch input[type='checkbox']");
    const socialLinks = document.querySelectorAll("a");

    // Save button handler
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        const lastname = document.getElementById("lastname").value.trim();
        const firstname = document.getElementById("firstname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!lastname || !firstname || !email || !phone) {
            alert("Бүх талбарыг бөглөнө үү.");
            return;
        }

    });

    // Email subscription toggle
    emailCheckbox.addEventListener("change", () => {
        if (emailCheckbox.checked) {
        } else {
        }
    });

    // Phone verification toggle
    phoneCheckbox.addEventListener("change", () => {
        if (phoneCheckbox.checked) {
        } else {
        }
    });

    // Form elements and navigation buttons
    const navButtons = document.querySelectorAll(".nav-section button");
    const orderMessage = document.querySelector("section:last-of-type p");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove 'active' class from all buttons
            navButtons.forEach(btn => btn.classList.remove("active"));

            // Add 'active' class to the clicked button
            button.classList.add("active");

            // Update the order message based on the button clicked
            orderMessage.textContent = button.textContent.includes("Баталгаажсан") 
                ? "Баталгаажсан захиалга харагдахгүй байна." 
                : "Хүлээгдэж буй захиалга харагдахгүй байна.";
        });
    });
});
