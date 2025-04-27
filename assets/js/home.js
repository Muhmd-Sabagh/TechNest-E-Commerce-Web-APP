// Importing needed functions
import { openProductDetailOverlay } from "./product.js";

document.addEventListener("DOMContentLoaded", function () {
  // Display username in the navbar
  const displayUsernameElement = document.getElementById("displayUsername");
  let currentUsername = getCurrentUsername();
  displayUsernameElement.textContent = `${currentUsername}!`;

  // Hero Slider
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".slider-indicators button");
  let currentSlide = 0;
  let slideInterval;

  function showSlide(slideIndex) {
    slides[currentSlide].classList.remove("active");
    slides.forEach((slide) => {
      slide.classList.remove("inactive");
    });
    slides[currentSlide].classList.add("inactive");
    indicators[currentSlide].classList.remove("active");
    currentSlide = slideIndex;
    indicators[currentSlide].classList.add("active");
    slides[currentSlide].classList.add("active");
  }
  function nextSlide() {
    let nextSlide = (currentSlide + 1) % slides.length;
    showSlide(nextSlide);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 3000);
  }
  function stopSlideShow() {
    clearInterval(slideInterval);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      if (!indicator.classList.contains("active")) {
        stopSlideShow();
        showSlide(index);
        startSlideShow();
      }
    });
  });

  startSlideShow();

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", function () {
    document.cookie = "userSession=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.href = "./registration.html";
  });

  // Shop Now
  const products = document.querySelector("#shop-now .row");
  const featured = document.querySelector("#featured .row");
  const categorySelect = document.getElementById("categories");
  const sortSelect = document.getElementById("sort");
  const priceFilterSelect = document.getElementById("filter-by-price");

  let allProducts = [];
  let filteredProducts = [];
  let featuredProducts = [];

  // Load products from JSON file
  async function loadProducts() {
    try {
      const response = await fetch("./assets/json/products.json");
      const data = await response.json();
      allProducts = data;
      filteredProducts = [...allProducts];
      displayProducts(filteredProducts, products);

      // Add event listeners for selections
      categorySelect.addEventListener("change", filterProducts);
      sortSelect.addEventListener("change", filterProducts);
      priceFilterSelect.addEventListener("change", filterProducts);

      // Get Featured Products
      featuredProducts = allProducts.filter(
        (product) => product.isFeatured === true
      );
      displayProducts(featuredProducts, featured);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }
  loadProducts();

  // Function to display products
  function displayProducts(products, productsContainer) {
    productsContainer.innerHTML = "";

    if (products.length === 0) {
      productsContainer.innerHTML =
        '<div class="col-12 text-center"><p>No products found matching your criteria.</p></div>';
      return;
    }

    products.forEach((product) => {
      const cartItems = getCartItems(currentUsername);
      const cartQuantity = cartItems[product.id] || 0;

      const productCard = document.createElement("div");
      productCard.className = "col-lg-3 col-md-4 col-6";
      productCard.innerHTML = `
							<div class="card product-card h-100 border-0 shadow-sm">
									<a href="home.html?product_id=${product.id}">
											<img src="${product.image}" class="card-img-top" alt="${product.name}">
											<div class="card-body">
													<h5 class="card-title">${
                            product.name.length > 20
                              ? product.name.substring(0, 20) + "..."
                              : product.name
                          }</h5>
													<p class="text-muted">${
                            product.description.length > 40
                              ? product.description.substring(0, 40) + "..."
                              : product.description
                          }</p>
													<div class="d-flex justify-content-between align-items-center">
															<span class="fw-bold text-primary">$${product.price.toFixed(2)}</span>
															<div class="d-flex align-items-center">
																	${
                                    cartQuantity > 0
                                      ? `<span class="me-2 badge bg-primary rounded-pill">${cartQuantity}</span>`
                                      : ""
                                  }
																	<button class="btn btn-sm btn-outline-primary add-to-cart" data-id="${
                                    product.id
                                  }">
																			<i class="bi bi-cart-plus"></i>
																	</button>
															</div>
													</div>
											</div>
									</a>
							</div>
					`;

      productsContainer.appendChild(productCard);

      // Add event listener to the product card
      productCard.addEventListener("click", function (e) {
        e.preventDefault();
        openProductDetailOverlay(product.id);
      });

      // Add event listener to the "Add to Cart" button
      const addToCartBtn = productCard.querySelector(".add-to-cart");
      addToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id);
      });
    });
  }

  // Function to filter products based on selected filters
  function filterProducts() {
    const selectedCategory = categorySelect.value;
    const selectedSort = sortSelect.value;
    const selectedPriceFilter = priceFilterSelect.value;

    // Filter by category
    let filtered = allProducts;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by price
    switch (selectedPriceFilter) {
      case "under-100":
        filtered = filtered.filter((product) => product.price < 100);
        break;
      case "under-300":
        filtered = filtered.filter((product) => product.price < 300);
        break;
      case "over-500":
        filtered = filtered.filter((product) => product.price >= 500);
        break;
    }

    // Sort products
    switch (selectedSort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    filteredProducts = filtered;
    displayProducts(filteredProducts, products);
  }

  // Function to add product to cart
  function addToCart(productId) {
    let cartItems = getCartItems(currentUsername);

    if (cartItems[productId]) {
      cartItems[productId]++;
    } else {
      cartItems[productId] = 1;
    }

    saveCartItems(cartItems, currentUsername);
    displayProducts(filteredProducts, products);
  }

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopBtn.style.animation = "fadeUp 0.3s ease-in-out forwards";
    } else {
      backToTopBtn.style.animation = "fadeDown 0.3s ease-in-out forwards";
    }
  });

  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// Function to set Cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const expires = "; expires=" + expirationDate;
  }
  document.cookie = name + "=" + value + expires;
}

// Function to get a specific cookie by name
function getCookie(name) {
  const nameEQ = name + "=";
  const userCookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(nameEQ));
  return userCookie ? userCookie.substring(nameEQ.length) : null;
}

// Get current username from session cookie
function getCurrentUsername() {
  const userSessionCookie = getCookie("userSession");

  if (userSessionCookie) {
    try {
      const userData = JSON.parse(userSessionCookie);
      return userData.name;
    } catch (error) {
      console.error("Error parsing userSession cookie:", error);
    }
  } else {
    window.location.href = "./registration.html";
  }
}

// Function to get cart items from cookies
function getCartItems(userName) {
  const cartCookie = getCookie(`cart_${userName}`);
  return cartCookie ? JSON.parse(cartCookie) : {};
}

// Function to save cart items to cookies
function saveCartItems(cartItems, userName) {
  setCookie(`cart_${userName}`, JSON.stringify(cartItems), 7);
}

// Export Functions
export { getCurrentUsername, getCartItems, saveCartItems };
