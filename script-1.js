let cart = JSON.parse(localStorage.getItem("skinCart")) || [];
let activeCoupon = localStorage.getItem("activeCoupon") || null;
let currentProduct = "";

const validCoupons = { "SAVE10": 0.10 };

document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();

    if (document.getElementById("cart-items")) {
        renderCartPage();

        const couponInput = document.getElementById('couponInput');
        if (couponInput) {
            couponInput.addEventListener('input', function() {
                if (this.value.trim() === "") {
                    activeCoupon = null;
                    localStorage.removeItem("activeCoupon");
                    document.getElementById('couponMessage').innerText = "";
                    saveData();
                }
            });
        }
    }

    updateAllReviewCounts();
});

function updateCartUI() {
    const cartCountElement = document.getElementById("cart-count");
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) cartCountElement.innerText = totalCount;
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveData();
    showToast(`${name} added to bag! ✅`);
}

function changeQuantity(name, action) {
    const item = cart.find(item => item.name === name);
    if (item) {
        if (action === 'plus') item.quantity += 1;
        else if (action === 'minus') {
            item.quantity -= 1;
            if (item.quantity <= 0) cart = cart.filter(i => i.name !== name);
        }
        saveData();
    }
}

function saveData() {
    localStorage.setItem("skinCart", JSON.stringify(cart));
    updateCartUI();
    if (document.getElementById("cart-items")) renderCartPage();
}

function renderCartPage() {
    const container = document.getElementById("cart-items");
    if (!container) return;
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<div style="padding:40px; text-align:center;">Your bag is empty!
        <a href="product-page.html" style="color: #4a6fa5; text-decoration: underline; font-weight: bold;"> Go back to Products </a></div>`;
        updateSummary(0);
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        container.innerHTML += `
            <div class="cart-item">
                <div class="item-info"><h4>${item.name}</h4><p>$${item.price.toFixed(2)}</p></div>
                <div class="qty-controls">
                    <button onclick="changeQuantity('${item.name}', 'minus')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 'plus')">+</button>
                </div>
            </div>`;
    });
    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const totalEl = document.getElementById("total-price");
    if (!totalEl) return;

    let shipping = (subtotal > 100 || subtotal === 0) ? 0 : 5;
    let discount = 0;

    if (activeCoupon && validCoupons[activeCoupon]) {
        discount = subtotal * validCoupons[activeCoupon];
        document.getElementById('discountRow').style.display = "block";
        document.getElementById('discountAmount').innerText = discount.toFixed(2);
    } else {
        document.getElementById('discountRow').style.display = "none";
    }

    document.getElementById("subtotal-price").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("shipping-price").innerText = `$${shipping.toFixed(2)}`;
    totalEl.innerText = (subtotal + shipping - discount).toFixed(2);
}

function applyCoupon() {
    const inputField = document.getElementById('couponInput');
    const message = document.getElementById('couponMessage');
    if (!inputField) return;

    const code = inputField.value.trim().toUpperCase();

    if (code === "") {
        activeCoupon = null;
        localStorage.removeItem("activeCoupon");
        message.innerText = "";
    } else if (validCoupons[code]) {
        activeCoupon = code;
        localStorage.setItem("activeCoupon", code);
        message.innerText = "Applied! ✅";
        message.style.color = "green";
    } else {
        activeCoupon = null;
        localStorage.removeItem("activeCoupon");
        message.innerText = "Invalid Code ❌";
        message.style.color = "red";
    }
    saveData();
}

function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    const currentOrder = [...cart];

    showQuickReviewModal(currentOrder);

    cart = [];
    localStorage.setItem("skinCart", JSON.stringify(cart));
    localStorage.removeItem("activeCoupon");
    updateCartUI();
    if (document.getElementById("cart-items")) renderCartPage();
}

function showQuickReviewModal(items) {
    const list = document.getElementById("purchasedItemsList");
    if (!list) return;
    list.innerHTML = items.map(item => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee; align-items:center;">
            <span>${item.name}</span>
            <button onclick="openReviewDirectly('${item.name}')" class="submit-btn" style="padding:5px 10px; font-size:12px; margin:0; width:auto;">Rate Now ⭐</button>
        </div>
    `).join('');
    document.getElementById("quickReviewModal").style.display = "block";
}

function openReviewDirectly(name) {
    currentProduct = name;
    document.getElementById('modalProductName').innerText = "Review: " + name;
    document.getElementById('reviewModal').style.display = "block";
    displayReviews();
}

function openReview(element) {
    const card = element.closest('.card');
    currentProduct = card.querySelector('h3').innerText.trim();
    document.getElementById('modalProductName').innerText = "Reviews for: " + currentProduct;

    document.querySelector('.rating-input').style.display = "block";
    document.getElementById('userComment').style.display = "block";
    document.querySelector('.submit-btn').style.display = "inline-block";

    document.getElementById('reviewModal').style.display = "block";
    displayReviews();
}

function submitReview() {
    const rating = document.getElementById('userRating').value;
    const comment = document.getElementById('userComment').value.trim();
    if (!comment) return alert("Please write a comment!");

    const reviews = JSON.parse(localStorage.getItem(currentProduct)) || [];
    reviews.push({ rating: Number(rating), comment, date: new Date().toLocaleDateString() });
    localStorage.setItem(currentProduct, JSON.stringify(reviews));

    document.getElementById('userComment').value = "";
    displayReviews();
    updateAllReviewCounts();
    alert("Review saved!");
}

function displayReviews() {
    const list = document.getElementById('reviewsList');
    const reviews = JSON.parse(localStorage.getItem(currentProduct)) || [];

    if (reviews.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#888;'>No reviews yet.</p>";
        return;
    }

    list.innerHTML = reviews.slice().reverse().map(r => `
        <div class="review-item" style="border-bottom:1px solid #eee; padding:10px; margin-bottom:5px;">
            <div style="color:#ffc107">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div>
            <p style="margin:5px 0; font-size:14px;">${r.comment}</p>
            <small style="color:#999;">${r.date}</small>
        </div>`).join('');
}

function updateAllReviewCounts() {
    document.querySelectorAll('.card').forEach(card => {
        const name = card.querySelector('h3').innerText.trim();
        const reviews = JSON.parse(localStorage.getItem(name)) || [];
        const span = card.querySelector('.review-count');
        if (span) span.innerText = `(${reviews.length})`;
    });
}

function closeReview() { document.getElementById('reviewModal').style.display = "none"; }
function closeQuickReview() { document.getElementById('quickReviewModal').style.display = "none"; }
function showToast(msg) {
    const toast = document.getElementById("toast-notification");
    if (toast) {
        toast.innerText = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
}
