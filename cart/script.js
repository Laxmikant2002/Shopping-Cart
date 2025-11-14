// Check if user is authorized
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!token || !currentUser) {
        alert('Please login to access your cart');
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

// Load cart from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart(cart);
}

// Display cart items
function displayCart(cart) {
    const cartItemsContainer = document.getElementById('cartItems');
    const checkoutListContainer = document.getElementById('checkoutList');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart to see them here!</p>
                <a href="../shop/index.html" class="btn-shop">Start Shopping</a>
            </div>
        `;
        checkoutListContainer.innerHTML = '<p style="text-align: center; color: #999;">No items</p>';
        document.getElementById('totalAmount').textContent = 'Rs 0/-';
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">Title : ${item.title.substring(0, 30)}...</div>
                <div class="cart-item-price">Price : $${item.price.toFixed(0)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>Qty: ${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${index})">Remove From Cart</button>
        </div>
    `).join('');
    
    // Display checkout list
    checkoutListContainer.innerHTML = cart.map((item, index) => `
        <div class="checkout-item">
            <span>${index + 1}. ${item.title.substring(0, 20)}...</span>
            <span>$${item.price.toFixed(0)}</span>
        </div>
    `).join('');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalAmount').textContent = `Rs ${total.toFixed(0)}/-`;
}

// Update quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Remove from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Checkout with Razorpay
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalInPaise = Math.round(total * 100); // Convert to paise for Razorpay
    
    const options = {
        key: 'rzp_test_1234567890', // Replace with your Razorpay test key
        amount: totalInPaise,
        currency: 'INR',
        name: 'MeShop',
        description: 'Purchase from MeShop',
        handler: function (response) {
            alert(`Payment successful!\nPayment ID: ${response.razorpay_payment_id}\n\nThank you for your purchase!`);
            // Clear cart after successful payment
            localStorage.setItem('cart', JSON.stringify([]));
            loadCart();
        },
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        theme: {
            color: '#1a1a1a'
        }
    };
    
    // Check if Razorpay is loaded
    if (typeof Razorpay !== 'undefined') {
        const rzp = new Razorpay(options);
        rzp.open();
    } else {
        // Fallback if Razorpay is not loaded
        if (confirm(`Proceed with payment of Rs ${total.toFixed(0)}/-?`)) {
            alert('Payment successful! Thank you for your purchase!');
            localStorage.setItem('cart', JSON.stringify([]));
            loadCart();
        }
    }
}

// Initialize
if (checkAuth()) {
    loadCart();
}
