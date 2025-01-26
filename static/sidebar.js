export const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    console.log(overlay.classList);
};
