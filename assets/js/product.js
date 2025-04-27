// Importing needed functions
import { getCurrentUsername, getCartItems, saveCartItems } from "./home.js";

document.addEventListener("DOMContentLoaded", function () {
  // Get current username from session cookie
  currentUsername = getCurrentUsername();
});

let currentUsername;
// Function to create product detail overlay
function createProductDetailOverlay(product) {
  // Create product detail overlay
  const productOverlay = document.createElement("div");
  productOverlay.id = "productDetailOverlay";
  productOverlay.className = "overlay";
  productOverlay.innerHTML = `
        <div class="overlay-content product-detail p-5">
          <div class="overlay-header">
            <h2>${product.name}</h2>
            <button class="close-btn fs-1 mb-4" id="closeProductDetailBtn">×</button>
          </div>
          <div class="row">
            <div class="col-md-6">
              <img src="${product.image}" class="img-fluid rounded" alt="${
    product.name
  }">
            </div>
            <div class="col-md-6">
              <div class="product-info p-3">
                <h3 class="text-primary">$${product.price.toFixed(2)}</h3>
                <p class="text-muted">${product.description}</p>
                <div class="product-specs mt-4">
                  ${product.about || "No detailed information available."}
                </div>
                <div class="mt-4">
                  <p><strong>Category:</strong> ${product.category}</p>
                </div>
                <div class="d-flex align-items-center mt-4">
                  <div class="quantity-control me-3">
                    <button class="btn btn-outline-secondary decrease-detail-qty" id="decreaseDetailQty">-</button>
                    <span class="mx-2 quantity" id="detailQuantity">1</span>
                    <button class="btn btn-outline-primary increase-detail-qty" id="increaseDetailQty">+</button>
                  </div>
                  <button class="btn btn-primary add-to-cart-detail" id="addToCartDetail" data-id="${
                    product.id
                  }">
                    <i class="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  document.body.appendChild(productOverlay);

  // Add event listener to close button
  document
    .getElementById("closeProductDetailBtn")
    .addEventListener("click", function () {
      closeProductDetailOverlay();
      window.location.reload();
    });

  // Add event listeners to quantity buttons
  let quantity = 1;
  document
    .getElementById("increaseDetailQty")
    .addEventListener("click", function () {
      quantity++;
      document.getElementById("detailQuantity").textContent = quantity;
    });

  document
    .getElementById("decreaseDetailQty")
    .addEventListener("click", function () {
      if (quantity > 1) {
        quantity--;
        document.getElementById("detailQuantity").textContent = quantity;
      }
    });

  // Add event listener to add to cart button
  document
    .getElementById("addToCartDetail")
    .addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      addToCartFromDetail(productId, quantity);
    });
}

// Function to add to cart from product detail
function addToCartFromDetail(productId, quantity) {
  const cartItems = getCartItems(currentUsername);

  if (cartItems[productId]) {
    cartItems[productId] += quantity;
  } else {
    cartItems[productId] = quantity;
  }

  saveCartItems(cartItems, currentUsername);

  // Show confirmation
  const confirmationMsg = document.createElement("div");
  confirmationMsg.className =
    "alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3";
  confirmationMsg.style.zIndex = "2000";
  confirmationMsg.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-check-circle me-2"></i>
        <span>Added to cart successfully!</span>
      </div>
    `;
  document.body.appendChild(confirmationMsg);

  // Remove confirmation after 3 seconds
  setTimeout(() => {
    confirmationMsg.remove();
  }, 3000);
}

// Function to close product detail overlay
function closeProductDetailOverlay() {
  document.getElementById("productDetailOverlay").style.display = "none";
  document.body.style.overflow = "auto";
  document.body.removeChild(document.getElementById("productDetailOverlay"));
}

// Function to open product detail overlay
export async function openProductDetailOverlay(productId) {
  try {
    const response = await fetch("./assets/json/products.json");
    const products = await response.json();

    const product = products.find((p) => p.id == productId);
    if (product) {
      createProductDetailOverlay(product);
      document.getElementById("productDetailOverlay").style.display = "block";
      document.body.style.overflow = "hidden";
    }
  } catch (error) {
    console.error("Error loading product details:", error);
  }
}
