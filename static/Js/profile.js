document.addEventListener("DOMContentLoaded", async () => {
 
    const form = document.querySelector("form");
    const saveButton = document.querySelector(".search-button");
    const emailCheckbox = document.querySelector(".switch input[type='checkbox']");
    const phoneCheckbox = document.querySelector(".switch input[type='checkbox']");
    const socialLinks = document.querySelectorAll("a");

    const userId = 1; 
    try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        document.getElementById("lastname").value = userData.lastname;
        document.getElementById("firstname").value = userData.firstname;
        document.getElementById("email").value = userData.email;
        document.getElementById("phone").value = userData.phone;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault(); 

        const lastname = document.getElementById("lastname").value.trim();
        const firstname = document.getElementById("firstname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!lastname || !firstname || !email || !phone) {
            alert("Бүх талбарыг бөглөнө үү.");
            return;
        }

    });

    emailCheckbox.addEventListener("change", () => {
        if (emailCheckbox.checked) {
        } else {
        }
    });

    phoneCheckbox.addEventListener("change", () => {
        if (phoneCheckbox.checked) {
        } else {
        }
    });

    const navButtons = document.querySelectorAll(".nav-section button");
    const orderMessage = document.querySelector("section:last-of-type p");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            navButtons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");
            orderMessage.textContent = button.textContent.includes("Баталгаажсан") 
                ? "Баталгаажсан захиалга харагдахгүй байна." 
                : "Хүлээгдэж буй захиалга харагдахгүй байна.";
        });
    });
});
