// Product data with categories, detailed descriptions, and high-res Unsplash images
const products = [
    {
        id: 1,
        title: "Wireless Headphones",
        category: "Electronics",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=500&q=80",
        description: "Premium sound quality, noise-cancelling, and 20hr battery life. Perfect for music lovers and professionals who need clear calls."
    },
    {
        id: 2,
        title: "Classic Sneakers",
        category: "Fashion",
        price: 64.99,
        image: "https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=crop&w=500&q=80",
        description: "Timeless design, durable canvas, and all-day comfort. Ideal for casual outings or active lifestyles."
    },
    {
        id: 3,
        title: "Smart Watch",
        category: "Electronics",
        price: 109.99,
        image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=500&q=80",
        description: "Track your fitness, receive notifications, and monitor your health—all from your wrist."
    },
    {
        id: 4,
        title: "Modern Backpack",
        category: "Fashion",
        price: 38.99,
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80",
        description: "Spacious, water-resistant, and stylish. Carry your essentials in comfort and style."
    },
    {
        id: 5,
        title: "Coffee Maker",
        category: "Home",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
        description: "Brew delicious coffee in minutes. Features programmable settings and easy cleaning."
    },
    {
        id: 6,
        title: "Bluetooth Speaker",
        category: "Electronics",
        price: 42.99,
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=500&q=80",
        description: "Portable, waterproof, and powerful bass. Take your music anywhere!"
    },
    {
        id: 7,
        title: "Stylish Sunglasses",
        category: "Fashion",
        price: 27.50,
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=500&q=80",
        description: "UV400 protection and trendy design. Upgrade your look and protect your eyes."
    },
    {
        id: 8,
        title: "Minimalist Desk Lamp",
        category: "Home",
        price: 21.99,
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80",
        description: "LED lighting with touch controls. Perfect for reading or working late."
    }
];

// Keep track of navigation state
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId + '-section').classList.add('active');
    closeMobileNav();
    // Close overlays and modals when navigating
    closeModal();
    closeCart();
    window.scrollTo(0,0);
}
window.navigateTo = showSection;

// Navbar: Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
mobileMenuBtn.addEventListener('click', () => {
    mobileNavDrawer.classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
});
function closeMobileNav() {
    mobileNavDrawer.classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// Overlay click closes modals/carts/nav
document.getElementById('overlay').onclick = () => {
    closeModal();
    closeCart();
    closeMobileNav();
};

// Featured products: first 4
function renderFeatured() {
    const container = document.getElementById('featured-products');
    container.innerHTML = '';
    products.slice(0,4).forEach(product => {
        container.appendChild(createProductCard(product, true));
    });
}

// Shop products with filter/search
function renderShop() {
    const container = document.getElementById('shop-products');
    container.innerHTML = '';
    let filtered = products;
    const selectedCat = document.getElementById('category-filter').value;
    const search = document.getElementById('search-box').value.toLowerCase();

    if (selectedCat !== "All") {
        filtered = filtered.filter(p => p.category === selectedCat);
    }
    if (search) {
        filtered = filtered.filter(p => (
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        ));
    }
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;">No products found.</p>';
        return;
    }
    filtered.forEach(product => {
        container.appendChild(createProductCard(product, false));
    });
}

// Category filter population
function populateCategories() {
    const select = document.getElementById('category-filter');
    const cats = Array.from(new Set(products.map(p => p.category)));
    cats.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
}
populateCategories();

// Product card builder
function createProductCard(product, featured=false) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="product-category">${product.category}</div>
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        <button class="view-detail-btn" data-id="${product.id}">View Details</button>
    `;
    // Add event listeners for cart and details
    div.querySelector('.add-to-cart-btn').onclick = (e) => {
        e.stopPropagation();
        addToCart(product.id);
    };
    div.querySelector('.view-detail-btn').onclick = (e) => {
        e.stopPropagation();
        showProductModal(product.id);
    };
    return div;
}

// Modal for product details
function showProductModal(id) {
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    content.innerHTML = `
        <button class="close-modal-btn" onclick="closeModal()">&times;</button>
        <img src="${product.image}" alt="${product.title}">
        <div class="modal-product-title">${product.title}</div>
        <div class="modal-product-category">${product.category}</div>
        <div class="modal-product-desc">${product.description}</div>
        <div class="modal-product-price">$${product.price.toFixed(2)}</div>
        <button class="primary-btn" onclick="addToCart(${product.id}); closeModal();">Add to Cart</button>
    `;
    modal.classList.add('active');
    document.getElementById('overlay').classList.add('active');
}
window.closeModal = function() {
    document.getElementById('product-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Cart system
let cart = JSON.parse(localStorage.getItem('cart')) || [];
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(c => c.id === id);
    if (item) item.qty += 1;
    else cart.push({ ...product, qty: 1 });
    updateCartUI();
    saveCart();
}
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    saveCart();
}
function changeQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    updateCartUI();
    saveCart();
}
function updateCartUI() {
    // Cart sidebar list
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="" class="cart-item-img">
            <span style="flex:1; margin-left:0.3rem;">
                <b>${item.title}</b><br>
                <span style="font-size:0.93em; color:#666;">$${item.price.toFixed(2)}</span>
            </span>
            <span>
                <button onclick="changeQty(${item.id},-1)" style="background:#eee;border:none;border-radius:4px;padding:2px 7px;font-size:1rem;cursor:pointer;">-</button>
                <span style="margin:0 8px;">${item.qty}</span>
                <button onclick="changeQty(${item.id},1)" style="background:#eee;border:none;border-radius:4px;padding:2px 7px;font-size:1rem;cursor:pointer;">+</button>
            </span>
            <span style="margin-left:0.6rem; color:#cb1e1e;">
                <button onclick="removeFromCart(${item.id})" style="background:none;border:none;font-size:1.35rem;cursor:pointer;">&times;</button>
            </span>
        `;
        cartItems.appendChild(li);
    });
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    // Badges
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count-badge').textContent = totalItems;
    document.getElementById('cart-count-badge-mobile').textContent = totalItems;
}
updateCartUI();

// Cart sidebar open/close
window.toggleCart = function() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
    closeMobileNav();
};
function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

// Checkout btn
document.getElementById('checkout-btn').onclick = () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your order! (Checkout integration coming soon)');
    cart = [];
    updateCartUI();
    saveCart();
    closeCart();
};

// Filtering and search handlers
document.getElementById('category-filter').onchange = renderShop;
document.getElementById('search-box').oninput = function() {
    setTimeout(renderShop, 230); // debounce for basic UX
};

// Contact form handler
document.getElementById('contact-form').onsubmit = function(e) {
    e.preventDefault();
    const msg = document.getElementById('contact-message');
    msg.textContent = "Thank you for contacting us! We'll respond soon.";
    this.reset();
    setTimeout(() => msg.textContent = '', 3500);
};

// Navigation logic on load
renderFeatured();
renderShop();
showSection('home');

// SPA-Like navigation: prevent anchor reload
document.querySelectorAll('.navbar-links a, .footer-links a, .mobile-nav-drawer a').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
});

// Responsive: close cart when window resized to mobile
window.addEventListener('resize', () => {
    if (window.innerWidth < 650) closeCart();
});
