// Importing needed functions
import { getCurrentUsername, getCartItems, saveCartItems } from "./home.js";
import { openPaymentOverlay } from "./payment.js";

document.addEventListener("DOMContentLoaded", function () {
  // Get current username from session cookie
  let currentUsername = getCurrentUsername();

  // Function to create cart overlay
  function createCartOverlay() {
    // Create cart overlay
    const cartOverlay = document.createElement("div");
    cartOverlay.id = "cartOverlay";
    cartOverlay.className = "overlay";
    cartOverlay.innerHTML = `
			<div class="overlay-content">
          <div class="overlay-header">
            <h2 class="ms-4">Your Cart</h2>
            <button class="close-btn fs-1" id="closeCartBtn">×</button>
          </div>
          <div id="cartItems" class="row g-4">
            <!-- Cart items will be displayed here -->
          </div>
          <div class="cart-summary mt-4">
					<div class="d-flex justify-content-between align-items-center">
					<h4>Total:</h4>
					<h4 id="cartTotal">$0.00</h4>
					</div>
					<button id="checkoutBtn" class="btn btn-primary w-100 mt-3">Proceed to Checkout</button>
          </div>
					</div>
					`;
    document.body.appendChild(cartOverlay);

    // Add event listener to close button
    document
      .getElementById("closeCartBtn")
      .addEventListener("click", function () {
        closeCartOverlay();
        window.location.reload();
      });

    // Add event listener to checkout button
    document
      .getElementById("checkoutBtn")
      .addEventListener("click", function () {
        closeCartOverlay();
        openPaymentOverlay();
      });
  }

  let isCartOpen = false;
  // Function to open cart overlay
  function openCartOverlay() {
    createCartOverlay();
    document.getElementById("cartOverlay").style.display = "block";
    document.body.style.overflow = "hidden";
    isCartOpen = true;
    loadCartItems();
  }

  // Function to close cart overlay
  function closeCartOverlay() {
    document.getElementById("cartOverlay").style.display = "none";
    document.body.style.overflow = "auto";
    isCartOpen = false;
    document.body.removeChild(document.getElementById("cartOverlay"));
  }

  // Function to load cart items
  async function loadCartItems() {
    const cartItems = getCartItems(currentUsername);
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = "";

    // If cart is empty
    if (Object.keys(cartItems).length === 0) {
      cartItemsContainer.innerHTML =
        '<div class="col-12 text-center"><p>Your cart is empty</p></div>';
      document.getElementById("cartTotal").textContent = "$0.00";
      return;
    }

    // Load products data
    try {
      const response = await fetch("./assets/json/products.json");
      const products = await response.json();

      let totalPrice = 0;

      // Loop through cart items
      Object.keys(cartItems).forEach((productId) => {
        const product = products.find((p) => p.id == productId);
        if (product) {
          const quantity = cartItems[productId];
          const itemTotal = product.price * quantity;
          totalPrice += itemTotal;

          // Create cart item card
          const cartItem = document.createElement("div");
          cartItem.className = "col-md-6 col-lg-4";
          cartItem.innerHTML = `
            <div class="card product-card h-100 border-0 shadow-sm">
              <img src="${product.image}" class="card-img-top" alt="${
            product.name
          }">
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
                  <span class="fw-bold text-primary">$${product.price.toFixed(
                    2
                  )}</span>
                  <div class="quantity-control">
                    <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${
                      product.id
                    }">-</button>
                    <span class="mx-2 quantity">${quantity}</span>
                    <button class="btn btn-sm btn-outline-primary increase-qty" data-id="${
                      product.id
                    }">+</button>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span>Total: $${itemTotal.toFixed(2)}</span>
                  <button class="btn btn-sm btn-outline-danger remove-item" data-id="${
                    product.id
                  }">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          `;

          cartItemsContainer.appendChild(cartItem);
        }
      });

      // Update total price
      document.getElementById("cartTotal").textContent = `$${totalPrice.toFixed(
        2
      )}`;

      // Add event listeners to quantity buttons and remove buttons
      document.querySelectorAll(".increase-qty").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          updateCartQuantity(productId, 1);
        });
      });

      document.querySelectorAll(".decrease-qty").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          updateCartQuantity(productId, -1);
        });
      });

      document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          removeFromCart(productId);
        });
      });
    } catch (error) {
      console.error("Error loading products:", error);
      cartItemsContainer.innerHTML =
        '<div class="col-12 text-center"><p>Error loading cart items</p></div>';
    }
  }

  // Function to update cart quantity
  function updateCartQuantity(productId, change) {
    const cartItems = getCartItems(currentUsername);

    if (cartItems[productId]) {
      cartItems[productId] += change;

      // Remove item if quantity is 0 or less
      if (cartItems[productId] <= 0) {
        delete cartItems[productId];
      }
    }

    saveCartItems(cartItems, currentUsername);
    loadCartItems();
  }

  // Function to remove item from cart
  function removeFromCart(productId) {
    const cartItems = getCartItems(currentUsername);

    if (cartItems[productId]) {
      delete cartItems[productId];
    }

    saveCartItems(cartItems, currentUsername);
    loadCartItems();
  }

  // Add event listener to cart link in navbar
  const cartLink = document.querySelector('.nav-link[href="#cart"]');
  if (cartLink) {
    cartLink.addEventListener("click", function (e) {
      e.preventDefault();
      openCartOverlay();
    });
  }
});
