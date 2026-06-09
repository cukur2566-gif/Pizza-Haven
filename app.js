// ===== MENU DATA WITH CORRECTED IMAGE PATHS =====
const menuData = [
    { 
        id: 1, 
        name: "Margherita Bliss", 
        category: "classic", 
        price: 12.99, 
        img: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop", 
        desc: "San Marzano tomatoes, fresh mozzarella, fragrant basil, extra virgin olive oil",
        rating: 4.8,
        popular: true,
        bestseller: false
    },
    { 
        id: 2, 
        name: "Pepperoni Classic", 
        category: "classic", 
        price: 14.99, 
        img: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop", 
        desc: "Loaded with spicy pepperoni, premium mozzarella, and Italian herbs",
        rating: 4.9,
        popular: false,
        bestseller: true
    },
    { 
        id: 3, 
        name: "Veggie Supreme", 
        category: "veggie", 
        price: 13.49, 
        img: "images/veggie.jpg",
        desc: "Bell peppers, mushrooms, olives, red onions, sweet corn",
        rating: 4.7,
        popular: true,
        bestseller: false
    },
    { 
        id: 4, 
        name: "Garden Fresh", 
        category: "veggie", 
        price: 12.49, 
        img: "images/garden.jpg",
        desc: "Zucchini, cherry tomatoes, spinach, feta cheese, pesto drizzle",
        rating: 4.6,
        popular: false,
        bestseller: false
    },
    { 
        id: 5, 
        name: "Buffalo Chicken", 
        category: "chicken", 
        price: 16.99, 
        img: "images/buffalo.jpg",
        desc: "Grilled chicken, buffalo sauce, ranch drizzle, celery bits",
        rating: 4.9,
        popular: true,
        bestseller: true
    },
    { 
        id: 6, 
        name: "Chicken Pesto", 
        category: "chicken", 
        price: 15.99, 
        img: "images/pesto.jpg",
        desc: "Pesto base, grilled chicken, cherry tomatoes, arugula, parmesan",
        rating: 4.8,
        popular: false,
        bestseller: false
    },
    { 
        id: 7, 
        name: "Diavola Special", 
        category: "special", 
        price: 18.49, 
        img: "https://images.pexels.com/photos/1596887/pexels-photo-1596887.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop", 
        desc: "Spicy salami, fresh chili, parmesan, basil, chili oil",
        rating: 4.9,
        popular: true,
        bestseller: false
    },
    { 
        id: 8, 
        name: "Truffle Mushroom", 
        category: "special", 
        price: 19.99, 
        img: "images/truffle.jpg",
        desc: "Truffle oil, wild mushrooms, rosemary, garlic, fontina cheese",
        rating: 5.0,
        popular: false,
        bestseller: true
    },
    { 
        id: 9, 
        name: "BBQ Chicken", 
        category: "chicken", 
        price: 17.49, 
        img: "images/bbq.jpg",
        desc: "Smoky BBQ sauce, grilled chicken, red onions, cilantro",
        rating: 4.7,
        popular: true,
        bestseller: false
    },
    { 
        id: 10, 
        name: "Four Cheese", 
        category: "classic", 
        price: 15.49, 
        img: "images/fourcheese.jpg",
        desc: "Mozzarella, parmesan, gorgonzola, ricotta, honey drizzle",
        rating: 4.8,
        popular: false,
        bestseller: false
    },
    { 
        id: 11, 
        name: "Meat Lovers", 
        category: "classic", 
        price: 18.99, 
        img: "images/meat.jpg",
        desc: "Pepperoni, sausage, bacon, ham, beef, extra cheese",
        rating: 4.9,
        popular: true,
        bestseller: true
    },
    { 
        id: 12, 
        name: "Hawaiian", 
        category: "special", 
        price: 15.99, 
        img: "https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop", 
        desc: "Ham, pineapple, mozzarella, cherry tomatoes",
        rating: 4.5,
        popular: false,
        bestseller: false
    }
];

// ===== APP STATE =====
let cart = [];
let currentView = 'menu';

// ===== HELPER FUNCTIONS =====
function showToast(message, isError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#e63946' : '#2b9348';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function saveCart() {
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
    updateCartBadges();
}

function loadCart() {
    const saved = localStorage.getItem('pizzaCart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch(e) { cart = []; }
    }
    updateCartBadges();
}

function updateCartBadges() {
    const total = cart.reduce((sum, i) => sum + i.quantity, 0);
    const desktopBadge = document.getElementById('cartBadge');
    const mobileBadge = document.getElementById('mobileCartBadge');
    if (desktopBadge) desktopBadge.textContent = total;
    if (mobileBadge) mobileBadge.textContent = total;
}

// ===== SPA ROUTING =====
function showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.classList.add('active');
        currentView = viewName;
    }
    
    document.querySelectorAll('.nav-btn, .bottom-nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });
    
    if (viewName === 'cart') renderCart();
    if (viewName === 'admin') renderAdmin();
    
    window.location.hash = viewName;
}

// ===== RENDER MENU =====
function renderMenu(category = 'all') {
    const container = document.getElementById('menuGrid');
    if (!container) return;
    
    const filtered = category === 'all' ? menuData : menuData.filter(item => item.category === category);
    
    container.innerHTML = filtered.map(item => `
        <div class="pizza-card" data-id="${item.id}">
            <div class="card-image">
                <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'">
                <div class="steam-effect"></div>
                ${item.popular ? '<span class="popular-badge">🔥 Popular</span>' : ''}
                ${item.bestseller ? '<span class="bestseller-badge">⭐ Best Seller</span>' : ''}
                <div class="favorite-icon" data-id="${item.id}">
                    <i class="far fa-heart"></i>
                </div>
            </div>
            <div class="card-info">
                <div class="card-header">
                    <h3 class="card-title">${item.name}</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${item.rating}</span>
                    </div>
                </div>
                <p class="card-desc">${item.desc}</p>
                <div class="card-footer">
                    <div class="price">
                        <span class="price-amount">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart-btn" data-id="${item.id}">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
    
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            icon.classList.toggle('active');
            const iconElem = icon.querySelector('i');
            if (icon.classList.contains('active')) {
                iconElem.classList.remove('far');
                iconElem.classList.add('fas');
                showToast('Added to favorites! ❤️');
            } else {
                iconElem.classList.remove('fas');
                iconElem.classList.add('far');
                showToast('Removed from favorites');
            }
        });
    });
    
    document.querySelectorAll('.pizza-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart-btn') && !e.target.closest('.favorite-icon')) {
                const id = parseInt(card.dataset.id);
                openModal(id);
            }
        });
    });
}

// ===== MODAL =====
function openModal(id) {
    const item = menuData.find(i => i.id === id);
    if (!item) return;
    
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img id="modalImage" src="" alt="">
                <div class="modal-details">
                    <h3 id="modalTitle"></h3>
                    <p id="modalDesc"></p>
                    <div class="modal-price" id="modalPrice"></div>
                    <button class="btn btn-primary" id="modalAddToCart">Add to Cart</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modalImage').src = item.img;
    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalDesc').textContent = item.desc;
    document.getElementById('modalPrice').textContent = `$${item.price.toFixed(2)}`;
    
    const addBtn = document.getElementById('modalAddToCart');
    addBtn.onclick = () => {
        addToCart(id);
        modal.classList.remove('active');
    };
    
    modal.classList.add('active');
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => modal.classList.remove('active');
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
    };
}

// ===== CART FUNCTIONS =====
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    if (!item) return;
    
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ 
            id: item.id, 
            name: item.name, 
            price: item.price, 
            quantity: 1,
            img: item.img
        });
    }
    
    saveCart();
    showToast(`✓ ${item.name} added to cart!`);
    if (currentView === 'cart') renderCart();
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            cart = cart.filter(i => i.id !== id);
        } else {
            item.quantity = newQty;
        }
        saveCart();
        renderCart();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
    showToast('Item removed');
}

function renderCart() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-basket" style="font-size: 3rem; color: var(--gray);"></i><p style="margin-top: 1rem;">Your cart is empty</p></div>';
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (totalEl) totalEl.textContent = '$2.99';
        return;
    }
    
    let subtotal = 0;
    let html = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <small>$${item.price.toFixed(2)} each</small>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                    <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                    <button class="cart-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
                <div style="font-weight: 600;">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    const total = subtotal + 2.99;
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), parseInt(btn.dataset.delta)));
    });
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.id)));
    });
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Clear all items from cart?')) {
        cart = [];
        saveCart();
        renderCart();
        showToast('Cart cleared');
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', true);
        return;
    }
    
    const orderId = 'ORD-' + Math.floor(Math.random() * 10000);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const order = {
        id: Date.now(),
        orderNumber: orderId,
        customer: { name: 'Guest' },
        items: [...cart],
        subtotal: subtotal,
        total: subtotal + 2.99,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    const savedOrders = localStorage.getItem('pizzaOrders');
    let ordersList = savedOrders ? JSON.parse(savedOrders) : [];
    ordersList.unshift(order);
    localStorage.setItem('pizzaOrders', JSON.stringify(ordersList));
    
    cart = [];
    saveCart();
    showToast(`✅ Order placed! ID: ${orderId}`);
    showView('home');
}

function renderAdmin() {
    const savedOrders = localStorage.getItem('pizzaOrders');
    let ordersList = savedOrders ? JSON.parse(savedOrders) : [];
    
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalRevenueEl = document.getElementById('totalRevenue');
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (totalRevenueEl) totalRevenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
    
    const container = document.getElementById('adminOrdersList');
    if (!container) return;
    
    if (ordersList.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">No orders yet</div>';
        return;
    }
    
    container.innerHTML = ordersList.map(order => `
        <div class="order-card">
            <div class="order-header">
                <strong>${order.orderNumber}</strong>
                <span>${new Date(order.createdAt).toLocaleString()}</span>
                <select class="status-select" data-id="${order.id}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                </select>
                <button class="delete-order" data-id="${order.id}"><i class="fas fa-trash"></i></button>
            </div>
            <div><strong>Items:</strong> ${order.items.length} pizzas</div>
            <div><strong>Total:</strong> $${order.total.toFixed(2)}</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const ordersListData = JSON.parse(localStorage.getItem('pizzaOrders') || '[]');
            const order = ordersListData.find(o => o.id === parseInt(select.dataset.id));
            if (order) {
                order.status = select.value;
                localStorage.setItem('pizzaOrders', JSON.stringify(ordersListData));
                showToast('Status updated');
                renderAdmin();
            }
        });
    });
    
    document.querySelectorAll('.delete-order').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this order?')) {
                let ordersListData = JSON.parse(localStorage.getItem('pizzaOrders') || '[]');
                ordersListData = ordersListData.filter(o => o.id !== parseInt(btn.dataset.id));
                localStorage.setItem('pizzaOrders', JSON.stringify(ordersListData));
                showToast('Order deleted');
                renderAdmin();
            }
        });
    });
}

// ===== THEME SYSTEM =====
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', () => showView(btn.dataset.view));
    });
    
    const heroOrderBtn = document.getElementById('heroOrderBtn');
    if (heroOrderBtn) heroOrderBtn.addEventListener('click', () => showView('menu'));
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.addEventListener('click', () => showView('admin'));
    
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => showView('home'));
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.addEventListener('click', () => showToast('Demo mode - Login feature coming soon'));
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu(btn.dataset.category);
        });
    });
}

// ===== INITIALIZE =====
function init() {
    loadCart();
    initTheme();
    renderMenu();
    initEventListeners();
    
    const hash = window.location.hash.slice(1);
    if (hash && ['home', 'menu', 'cart', 'account', 'admin'].includes(hash)) {
        showView(hash);
    } else {
        showView('menu');
    }
}

// Start the app
init();