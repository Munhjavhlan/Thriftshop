export function addToWishlist(item) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.some(product => product.id === item.id)) {
        wishlist.push(item);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Бүтээгдэхүүн хүсэлтийн жагсаалтад нэмэгдлээ!");
    } else {
        alert("Энэ бүтээгдэхүүн аль хэдийн хүсэлтийн жагсаалтад байна.");
    }
}
