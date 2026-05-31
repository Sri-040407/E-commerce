const products = [
    {
        id: 1,
        name: "Luna Velvet Dress",
        price: 128,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=80",
        category: "Fashion",
    },
    {
        id: 2,
        name: "Silk Blossom Scarf",
        price: 42,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d6?auto=format&fit=crop&w=700&q=80",
        category: "Accessories",
    },
    {
        id: 3,
        name: "Radiant Glow Serum",
        price: 38,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=80",
        category: "Beauty Products",
    },
    {
        id: 4,
        name: "Wildflower Candle Set",
        price: 54,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=700&q=80",
        category: "Home Decor",
    },
    {
        id: 5,
        name: "Pearl Drop Earrings",
        price: 64,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
        category: "Accessories",
    },
    {
        id: 6,
        name: "Dreamy Satin Pillow",
        price: 34,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
        category: "Home Decor",
    },
    {
        id: 7,
        name: "Petal Matte Lipstick",
        price: 22,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
        category: "Beauty Products",
    },
    {
        id: 8,
        name: "Lacey Couture Blouse",
        price: 98,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
        category: "Fashion",
    },
];

const cart = new Map();
const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const drawerTotal = document.getElementById("drawerTotal");
const summaryItems = document.getElementById("summaryItems");
const summaryTotal = document.getElementById("summaryTotal");
const checkoutForm = document.getElementById("checkoutForm");
const orderSuccess = document.getElementById("orderSuccess");
const closeSuccess = document.getElementById("closeSuccess");

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

function renderProducts() {
    productsGrid.innerHTML = products
        .map(
            (product) => `
      <article class="product-card fade-in-up">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div>
          <h4>${product.name}</h4>
          <p class="price">${formatCurrency(product.price)}</p>
          <div class="rating">${renderRating(product.rating)} <span>${product.rating}</span></div>
        </div>
        <div class="card-actions">
          <button class="button secondary add-cart-btn" data-product-id="${product.id}">Add to Cart</button>
        </div>
      </article>
    `,
        )
        .join("");
}

function renderRating(rating) {
    const fullStars = Math.floor(rating);
    const stars = Array.from({ length: 5 }, (_, index) => (index < fullStars ? "★" : "☆")).join("");
    return `<span class="stars">${stars}</span>`;
}

function updateCartCount() {
    const totalItems = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCart() {
    cartItemsContainer.innerHTML = "";
    if (cart.size === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-note">Your cart is feeling light. Add something special.</p>`;
    } else {
        cart.forEach((item) => {
            const product = products.find((product) => product.id === item.id);
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="cart-item-details">
          <h5>${product.name}</h5>
          <div class="cart-actions">
            <div class="quantity-control">
              <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
            <button class="button secondary" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    updateDrawerTotal();
    renderOrderSummary();
}

function updateDrawerTotal() {
    const total = [...cart.values()].reduce((sum, item) => {
        const product = products.find((product) => product.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);
    drawerTotal.textContent = formatCurrency(total);
}

function renderOrderSummary() {
    summaryItems.innerHTML = "";
    if (cart.size === 0) {
        summaryItems.innerHTML = `<p class="empty-note">Add items to see the order summary.</p>`;
        summaryTotal.textContent = "$0.00";
        return;
    }
    cart.forEach((item) => {
        const product = products.find((product) => product.id === item.id);
        const summaryItem = document.createElement("div");
        summaryItem.className = "summary-item";
        summaryItem.innerHTML = `
      <span>${item.quantity} × ${product.name}</span>
      <strong>${formatCurrency(product.price * item.quantity)}</strong>
    `;
        summaryItems.appendChild(summaryItem);
    });
    const total = [...cart.values()].reduce((sum, item) => {
        const product = products.find((product) => product.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);
    summaryTotal.textContent = formatCurrency(total);
}

function addToCart(id) {
    const existingItem = cart.get(id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.set(id, { id, quantity: 1 });
    }
    updateCartCount();
    renderCart();
    openCart();
}

function changeQuantity(id, delta) {
    const item = cart.get(id);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    if (item.quantity === 0) {
        cart.delete(id);
    }
    updateCartCount();
    renderCart();
}

function removeFromCart(id) {
    cart.delete(id);
    updateCartCount();
    renderCart();
}

function openCart() {
    cartDrawer.classList.add("open");
}

function closeCartDrawer() {
    cartDrawer.classList.remove("open");
}

function attachProductListeners() {
    productsGrid.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-product-id]");
        if (!button) return;
        const id = Number(button.dataset.productId);
        addToCart(id);
    });
}

function attachCartListeners() {
    cartItemsContainer.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        const id = Number(button.dataset.id);
        const action = button.dataset.action;
        if (action === "remove") removeFromCart(id);
        if (action === "increase") changeQuantity(id, 1);
        if (action === "decrease") changeQuantity(id, -1);
    });

    cartButton.addEventListener("click", openCart);
    closeCart.addEventListener("click", closeCartDrawer);
    cartDrawer.addEventListener("click", (event) => {
        if (event.target === cartDrawer) closeCartDrawer();
    });
}

function handleCheckoutSubmit(event) {
    event.preventDefault();
    const total = [...cart.values()].reduce((sum, item) => {
        const product = products.find((product) => product.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    if (cart.size === 0) {
        alert("Add something to your cart before placing an order.");
        return;
    }

    orderSuccess.classList.remove("hidden");
    orderSuccess.classList.add("visible");
    cart.clear();
    updateCartCount();
    renderCart();
    checkoutForm.reset();
    summaryTotal.textContent = "$0.00";
}

function closeSuccessPopup() {
    orderSuccess.classList.add("hidden");
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 },
    );
    document.querySelectorAll(".fade-in-up").forEach((section) => observer.observe(section));
}

function init() {
    renderProducts();
    attachProductListeners();
    attachCartListeners();
    renderCart();
    setupScrollAnimations();
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
    closeSuccess.addEventListener("click", closeSuccessPopup);
    orderSuccess.addEventListener("click", (event) => {
        if (event.target === orderSuccess) closeSuccessPopup();
    });
}

init();
