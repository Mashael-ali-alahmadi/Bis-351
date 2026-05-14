const header = `
<header>

    <div class="logo">
        <a href="home.html">GlowCare ✨</a>
    </div>

    <nav class="navbar">
        <a href="home.html">Home</a>
        <a href="product-page.html">Products</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="skin-Tips.html">Skin Tips</a>
        <a href="login.html">Login</a>
    </nav>

    <a href="shopping-cart.html" class="cart-icon">
        🛒 <span class="cart-count" id="cart-count">0</span>
    </a>

</header>
`;
const footer = `
<footer>
    <h3>Contact Us</h3>

    <div class="socials">
        <a href="#">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png">
        </a>

        <a href="#">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png">
        </a>

        <a href="#">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png">
        </a>

        <p>©️ 2026 GlowCare Skincare</p>
    </div>

    <div id="toast-notification" class="toast">
        Added to the cart successfully ✅
    </div>

</footer>
`;

document.getElementById("header").innerHTML = header;
document.getElementById("footer").innerHTML = footer;
const topBtn = document.getElementById("topBtn");

window.onscroll = function () {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};

topBtn.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};