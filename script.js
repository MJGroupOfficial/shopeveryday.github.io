
// Product data array with buy links
const products = [
  {
    id: 1,
    title: "APES Fusion Style Wireless Headphone",
    description: "APES Fusion Style Wireless Headphone, 40mm Dynamic Drivers, 50Hrs Playtime, Fast Charge (Black Grey)",
    image: "./public/images/electronics/product1.webp",
    originalPrice: `6,999`,
    currentPrice: `1,899`,
    discount: 73,
    category: "electronics",
    buyLink: "https://amzn.to/3ZgcHeH"
  },
  {
    id: 2,
    title: "Safari Pentagon Set of 3 (Cabin + Medium + Large) Trolley Bags",
    description: "Safari Pentagon Set of 3 (Cabin + Medium + Large) Trolley Bags Hard Case Polypropylene 4 Wheels 360 Degree Wheeling Luggage, Travel Bags, Suitcase for Travel, Trolley Bags for Travel, Dusk Green",
    image: "./public/images/home/product1.webp",
    originalPrice: `30,355`,
    currentPrice: `5,999`,
    discount: 80,
    category: "home",
    buyLink: "https://amzn.to/43siqAu"
  },
  {
    id: 3,
    title: "Matrix Watch For Man & Women",
    description: "Matrix Black, Blue, White Dial, Day & Date Functioning, Stainless Steel Strap Analog Watch for Men & Women",
    image: "./public/images/electronics/product2.webp",
    originalPrice: `2,499`,
    currentPrice: 298,
    discount: 88,
    category: "electronics",
    buyLink: "https://amzn.to/3HpRXuO"
  },
  {
    id: 4,
    title: "Meta Wall Clock",
    description: "THE DECOR COMPANY Metal Wall Clock - Floral Design with Silent Sweep Machine - Ideal Home Decor Items and Wall Decoration Items for Living Room/Bedroom/Dining Hall/Office/Cafes/Hotels",
    image: "./public/images/home/product3.webp",
    originalPrice: `1,999`,
    currentPrice: 699,
    discount: 65,
    category: "home",
    buyLink: "https://amzn.to/3HFDESQ"
  },
  {
    id: 5,
    title: "Waterproof LED Watch ",
    description: "Skmei Men's Digital Sports Watch 50m Waterproof LED Military Multifunction Smart Watch Stopwatch Countdown Auto Date Alarm",
    image: "./public/images/electronics/product3.webp",
    originalPrice: `6,999`,
    currentPrice: 699,
    discount: 90,
    category: "electronics",
    buyLink: "https://amzn.to/3HmPGAJ"
  },
  {
    id: 6,
    title: "Water Bottle With Your Name",
    description: "CORPORATE PORIUM Your Name Printed Curvy Stainless Steel Bottle | Capacity 1L Approx | Easy to Carry | Leakproof Bottle Personalized Gift Bottle | Laser Engraved Golden",
    image: "./public/images/home/product2.webp",
    originalPrice: 999,
    currentPrice: 339,
    discount: 66,
    category: "home",
    buyLink: "https://amzn.to/4kUhx9S"
  },
  {
    id: 7,
    title: "Frantic Cute Backpack",
    description: "Frantic Cute Backpack for Nursery Children Soft Velvet Cartoon Animal Plush Preschool Mini Travel Bags for ideal Baby Girl & Baby Boy & Toddlers (2-5 Years)",
    image: "./public/images/kids/product3.webp",
    originalPrice: 749,
    currentPrice: 289,
    discount: 62,
    category: "kids",
    buyLink: "https://amzn.to/45aPChk"
  },
  {
    id: 8,
    title: "Running Shoes",
    description: "BRUTON Combo of Men's Sports Running Shoes",
    image: "./public/images/fashion/product2.webp",
    originalPrice: `2,499`,
    currentPrice: 478,
    discount: 81,
    category: "fashion",
    buyLink: "https://amzn.to/4mOau3Y"
  },
  {
    id: 9,
    title: "Keekos Scooter for Kids with LED Light Up Wheels",
    description: "Keekos Scooter for Kids with LED Light Up Wheels, Adjustable Height Kick Scooters for Boys and Girls, Rear Fender Break|5lb Lightweight Folding Kids Scooter, 110lb Weight Capacity (Blue) (Red Black)",
    image: "./public/images/kids/product2.webp",
    originalPrice: `14,070`,
    currentPrice: `1,211`,
    discount: 91,
    category: "kids",
    buyLink: "https://amzn.to/43Ssf9V"
  },
  {
    id: 10,
    title: "BRUTON Sports Shoes",
    description: "BRUTON Men's Sport Running Shoes Casual Shoe Sneakers for Men's",
    image: "./public/images/fashion/product3.webp",
    originalPrice: `2,499`,
    currentPrice: 278,
    discount: 89,
    category: "fashion",
    buyLink: "https://amzn.to/3Hq787j"
  },
  {
    id: 11,
    title: "3 Cute Mini Bags",
    description: "floki Fashion Girls 3-PCS Fashion Cute Mini Leather Backpack sling & pouch set for Women",
    image: "./public/images/kids/product4.webp",
    originalPrice: `1,499`,
    currentPrice: 625,
    discount: 58,
    category: "kids",
    buyLink: "https://amzn.to/4dMeNsy"
  },
  {
    id: 12,
    title: "Mini Dress",
    description: "Aahwan Women's & Girls' Black Solid Ruched Detail A-line Mini Dress",
    image: "./public/images/fashion/product1.webp",
    originalPrice: `1,999`,
    currentPrice: 499,
    discount: 78,
    category: "fashion",
    buyLink: "https://amzn.to/43sRpwP"
  },
  {
    id: 13,
    title: "Lifelong Foldable Kids Kick Scooter",
    description: "Lifelong Foldable Kids Kick Scooter with LED Wheels & Adjustable Height - Capacity 50kg- for Baby 3+ Year Old boy & Girl - Skate Scooter, Blue",
    image: "./public/images/kids/product1.webp",
    originalPrice: `4,499`,
    currentPrice: `1,279`,
    discount: 72,
    category: "kids",
    buyLink: "https://amzn.to/459zCfq"
  },
  {
    id: 13,
    title: "Crosscut Furniture Wooden Floor Lamp",
    description: "Crosscut Furniture Wooden Floor Lamp with Shelf (Royal Blue). LED Bulb Included- Diwali Decoration Items",
    image: "./public/images/electronics/product4.webp",
    originalPrice: `8,990`,
    currentPrice: `2,599`,
    discount: 71,
    category: "home",
    buyLink: "https://amzn.to/3FJY1Od"
  }
];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  displayProducts(products);
  
  // Add search functionality
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
  });
});

// Display products function
function displayProducts(productsToShow) {
  productsGrid.innerHTML = '';
  
  productsToShow.forEach((product, index) => {
    const productCard = createProductCard(product, index);
    productsGrid.appendChild(productCard);
  });
}

// Create product card element
function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="product-image">
    <div class="product-info">
      <h3 class="product-title">${product.title}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-price">
        <span class="current-price"><span>&#x20B9</span>${product.currentPrice}</span>
        <span class="original-price"><span>&#x20B9</span>${product.originalPrice}</span>
        <span class="discount-badge">${product.discount}% OFF</span>
      </div>
      <button class="buy-now-btn" onclick="buyNow('${product.buyLink}')">
        <i class="fas fa-shopping-bag"></i> Buy Now
      </button>
    </div>
  `;
  
  return card;
}

// Filter products by category
function filterProducts(category) {
  // Update filter button styles
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filter and display products
  if (category === 'all') {
    displayProducts(products);
  } else {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
  }
}

// Buy now function
function buyNow(buyLink) {
  window.open(buyLink, '_blank');
}

// Scroll to products section
function scrollToProducts() {
  document.getElementById('products').scrollIntoView({
    behavior: 'smooth'
  });
}

// Scroll to deals section
function scrollToDeals() {
  document.getElementById('deals').scrollIntoView({
    behavior: 'smooth'
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
  });
});
