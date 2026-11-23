
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 49.99,
        description: "Comfortable wireless headphones with clear sound and long battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 79.99,
        description: "A stylish smartwatch to help you track your daily activities.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 3,
        name: "Classic Backpack",
        price: 39.99,
        description: "A practical everyday backpack with a spacious design.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 59.99,
        description: "Lightweight shoes designed for everyday comfort and running.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 5,
        name: "Camera",
        price: 199.99,
        description: "Capture your favourite moments with this compact camera.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 24.99,
        description: "Modern sunglasses with a stylish everyday design.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    }
];

let cart = JSON.parse(localStorage.getItem("shopCart")) || [];
let selectedProduct = null;

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const message = document.getElementById("message");

// Display products
function displayProducts(list = products) {
    productGrid.innerHTML = "";

    if (list.length === 0) {
        productGrid.innerHTML = '<p class="empty">No products found.</p>';
        return;
    }

    list.forEach(product => {
        productGrid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="details-btn"
                            onclick="showDetails(${product.id})">
                            Details
                        </button>
                        <button class="btn"
                            onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Add product to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    message.textContent = `${product.name} added to your cart!`;
}

// Save cart
function saveCart() {
    localStorage.setItem("shopCart", JSON.stringify(cart));
    displayCart();
}

// Display cart
function displayCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty">Your shopping cart is empty.</p>';
    }

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>Product ID: ${item.id}</p>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <strong>${item.quantity}</strong>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = count;
}

// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    saveCart();
}

// Product details
function showDetails(id) {
    selectedProduct = products.find(product => product.id === id);

    document.getElementById("modalImage").src = selectedProduct.image;
    document.getElementById("modalName").textContent = selectedProduct.name;
    document.getElementById("modalDescription").textContent =
        selectedProduct.description;
    document.getElementById("modalPrice").textContent =
        `$${selectedProduct.price.toFixed(2)}`;

    document.getElementById("productModal").style.display = "flex";
}

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("productModal").style.display = "none";
});

document.getElementById("productModal").addEventListener("click", event => {
    if (event.target.id === "productModal") {
        event.currentTarget.style.display = "none";
    }
});

// Add product from details
document.getElementById("modalAddBtn").addEventListener("click", () => {
    if (selectedProduct) {
        addToCart(selectedProduct.id);
        document.getElementById("productModal").style.display = "none";
    }
});

// Place order
document.getElementById("placeOrderBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        message.textContent = "Your cart is empty. Add some products first.";
        return;
    }

    const orderNumber = "ORD-" + Date.now().toString().slice(-8);

    alert(`Order placed successfully!\nYour order number is ${orderNumber}`);

    cart = [];
    saveCart();
    message.textContent = `Thank you! Your order ${orderNumber} has been placed.`;
});

// Cancel order / clear cart
document.getElementById("cancelOrderBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        message.textContent = "Your cart is already empty.";
        return;
    }

    if (confirm("Are you sure you want to cancel your order?")) {
        cart = [];
        saveCart();
        message.textContent = "Your order has been cancelled.";
    }
});

// Search products
document.getElementById("searchInput").addEventListener("input", event => {
    const searchText = event.target.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
});

// Initial display
displayProducts();
displayCart();
