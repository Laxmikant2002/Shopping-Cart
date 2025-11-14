let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSort = 'default';

// Check if user is authorized
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!token || !currentUser) {
        alert('Please login to access the shop');
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        allProducts = await response.json();
        filteredProducts = allProducts;
        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products by category
function displayProducts() {
    const mensProducts = filteredProducts.filter(p => p.category === "men's clothing");
    const womensProducts = filteredProducts.filter(p => p.category === "women's clothing");
    const jeweleryProducts = filteredProducts.filter(p => p.category === "jewelery");
    const electronicsProducts = filteredProducts.filter(p => p.category === "electronics");

    renderProductGrid('mensProducts', mensProducts);
    renderProductGrid('womensProducts', womensProducts);
    renderProductGrid('jeweleryProducts', jeweleryProducts);
    renderProductGrid('electronicsProducts', electronicsProducts);
}

// Render product grid
function renderProductGrid(containerId, products) {
    const container = document.getElementById(containerId);
    
    if (products.length === 0) {
        container.innerHTML = '<p style="padding: 2rem;">No products found</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="item">
            <img src="${product.image}" alt="${product.title}" />
            <div class="info">
                <div class="row">
                    <div class="price">$${product.price.toFixed(0)}</div>
                    <div class="sized">S,M,L${product.category === "women's clothing" ? ',XL' : ''}</div>
                </div>
                <div class="colors">
                    Colors:
                    <div class="row">
                        <div class="circle" style="background-color: #000"></div>
                        <div class="circle" style="background-color: #4938af"></div>
                        <div class="circle" style="background-color: #203d3e"></div>
                    </div>
                </div>
                <div class="row">Rating: ${'⭐'.repeat(Math.round(product.rating.rate))}</div>
            </div>
            <button class="addBtn" onclick="addToCart(${product.id})">Add To Cart</button>
        </div>
    `).join('');
}

// Category filters
document.querySelectorAll('.filter').forEach(filter => {
    filter.addEventListener('click', function() {
        document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        
        currentCategory = this.dataset.category;
        
        if (currentCategory === 'all') {
            filteredProducts = allProducts;
        } else {
            filteredProducts = allProducts.filter(p => p.category === currentCategory);
        }
        
        displayProducts();
    });
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (currentCategory === 'all') {
        filteredProducts = allProducts.filter(p => 
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredProducts = allProducts.filter(p => 
            p.category === currentCategory &&
            (p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm))
        );
    }
    
    displayProducts();
});

// Sort functionality
document.getElementById('sortSelect').addEventListener('change', function(e) {
    currentSort = e.target.value;
    sortProducts();
    displayProducts();
});

function sortProducts() {
    switch(currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-za':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
        default:
            // Keep original order from API
            break;
    }
}

// Apply filters
document.querySelector('.apply-filter-btn').addEventListener('click', function() {
    applyFilters();
});

function applyFilters() {
    let filtered = currentCategory === 'all' ? [...allProducts] : allProducts.filter(p => p.category === currentCategory);
    
    // Price filter
    const priceFilters = Array.from(document.querySelectorAll('input[name="prange"]:checked')).map(cb => cb.value);
    if (priceFilters.length > 0) {
        filtered = filtered.filter(product => {
            return priceFilters.some(range => {
                if (range === '0-25') return product.price >= 0 && product.price <= 25;
                if (range === '25-50') return product.price > 25 && product.price <= 50;
                if (range === '50-100') return product.price > 50 && product.price <= 100;
                if (range === '100+') return product.price > 100;
                return false;
            });
        });
    }
    
    // Rating filter
    const minRating = document.getElementById('rating').value;
    if (minRating > 0) {
        filtered = filtered.filter(product => product.rating.rate >= minRating);
    }
    
    filteredProducts = filtered;
    sortProducts();
    displayProducts();
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}

// Initialize
if (checkAuth()) {
    fetchProducts();
}
