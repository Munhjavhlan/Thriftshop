// dark, light mode нь цаг дагаж өөрчлөгдөх
document.addEventListener("DOMContentLoaded", () => {
  function setTheme() {
    const currentHour = new Date().getHours();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (prefersDark || currentHour >= 18 || currentHour < 6) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else { 
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }
  setTheme();
});




document.getElementById('addProductForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  try {
    const response = await fetch('http://localhost:3000/admin/add-product', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert('Бүтээгдэхүүн амжилттай нэмэгдлээ');
      window.location.reload();
    } else {
      alert(result.message || 'Бүтээгдэхүүн нэмэхэд алдаа гарлаа');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Сервертэй холбогдоход алдаа гарлаа.');
  }
});