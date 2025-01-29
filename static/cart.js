export function showCartNotification(item) {
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

    // 4 секундийн дараа автоматаар алга болгох
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

export function addToCart(item) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.push(item);
    localStorage.setItem('cart', JSON.stringify(cartItems));

    showCartNotification(item);
}

export function renderCart() {
    const cartList = document.querySelector('cart-list');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.forEach(item => cartList.addItem(item));
}
