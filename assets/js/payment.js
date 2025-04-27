// Import necessary functions
import { getCurrentUsername, getCartItems, saveCartItems } from "./home.js";

// Function to open payment overlay
export function openPaymentOverlay() {
  // Create and display the payment overlay
  createPaymentOverlay();
  document.getElementById("paymentOverlay").style.display = "block";
  document.body.style.overflow = "hidden";
  loadCartSummary();
}

// Function to create payment overlay
function createPaymentOverlay() {
  // Create payment overlay
  const paymentOverlay = document.createElement("div");
  paymentOverlay.id = "paymentOverlay";
  paymentOverlay.className = "overlay";
  paymentOverlay.innerHTML = `
    <div class="overlay-content">
      <div class="overlay-header">
        <h2 class="ms-4">Checkout</h2>
        <button class="close-btn fs-1" id="closePaymentBtn">×</button>
      </div>
      
      <div class="row">
        <!-- (Order Summary) -->
        <div class="col-md-4">
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-primary text-white py-3">
              <h5 class="mb-0">Order Summary</h5>
            </div>
            <div class="card-body">
              <div id="orderSummaryItems">
                <!-- Order items will be listed here -->
              </div>
              <hr>
              <div class="d-flex justify-content-between align-items-center">
                <h5>Total:</h5>
                <h5 id="orderTotal">$0.00</h5>
              </div>
            </div>
          </div>
        </div>
        
        <!-- (Payment Form) -->
        <div class="col-md-8">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-primary text-white py-3">
              <h5 class="mb-0">Payment Information</h5>
            </div>
            <div class="card-body">
              <form id="paymentForm" class="form needs-validation" novalidate>
                <!-- Customer Information -->
                <h6 class="mb-3 fw-bold">Customer Information</h6>
                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="fullName" class="form-label">Full Name</label>
										<div class="input-group">
											<span class="input-group-text"
												><i class="bi bi-person"></i
											></span>
											<input type="text" class="form-control" id="fullName" pattern="[A-Za-z\\s]{3,}" placeholder="Your Name" required>
											<div class="invalid-feedback">Name must be at least 3 characters (letters only).</div>
										</div>
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
										<div class="input-group">
											<span class="input-group-text"
												><i class="bi bi-envelope"></i
											></span>
											<input type="email" class="form-control" id="email" placeholder="example@email.com" required>
											<div class="invalid-feedback">Please provide a valid email address.</div>
										</div>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <div class="input-group">
											<span class="input-group-text"
												><i class="bi bi-geo-alt-fill"></i
											></span>
											<input type="text" class="form-control" id="address" pattern="^[A-Za-z0-9][A-Za-z0-9\\s,.'\\-]{2,}$" placeholder="Your Address" required>
											<div class="invalid-feedback">Address must be at least 3 characters.</div>
										</div>
                </div>
                
                <!-- Payment Method -->
                <h6 class="mb-3 fw-bold">Payment Method</h6>
                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="cardNumber" class="form-label">Card Number</label>
										<div class="input-group">
											<span class="input-group-text"
												><i class="bi bi-credit-card-2-front-fill"></i
											></span>
                    	<input type="text" class="form-control" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" pattern="[0-9]{4}( ?[0-9]{4}){3}" required>
                    	<div class="invalid-feedback">Please provide a valid card number</div>
										</div>
                  </div>
                  <div class="col-md-6">
                    <label for="cardName" class="form-label">Name on Card</label>
										<div class="input-group">
											<span class="input-group-text"
												><i class="bi bi-credit-card-2-front-fill"></i
											></span>
											<input type="text" class="form-control" id="cardName" placeholder="e.g. JOHN SMITH" pattern="[A-Za-z\\s]{3,}" required>
											<div class="invalid-feedback">Please provide the name on card</div>
										</div>
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="expiryDate" class="form-label">Expiry Date</label>
                    <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" pattern="^\\d{2}/\\d{2}$" required>
                    <div class="invalid-feedback">Please provide a valid expiry date</div>
                  </div>
                  <div class="col-md-6">
                    <label for="cvv" class="form-label">CVV</label>
                    <input type="text" class="form-control" id="cvv" placeholder="..." pattern="^\\d{3,4}$" required>
                    <div class="invalid-feedback">Please provide a valid CVV</div>
                  </div>
                </div>
                
                <!-- Submit Button -->
                <button type="submit" class="btn btn-primary w-100" id="placeOrderBtn">Place Order</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(paymentOverlay);

  // Event listener to close button
  document
    .getElementById("closePaymentBtn")
    .addEventListener("click", function () {
      closePaymentOverlay();
    });

  // Event listener to form submission
  document
    .getElementById("paymentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      // Validate form inputs
      if (this.checkValidity()) {
        this.classList.remove("was-validated");
        processPayment();
      } else {
        this.classList.add("was-validated");
      }
    });

  paymentInfoValidation();
}

// Function to close payment overlay
function closePaymentOverlay() {
  document.getElementById("paymentOverlay").style.display = "none";
  document.body.style.overflow = "auto";
  document.body.removeChild(document.getElementById("paymentOverlay"));
}

let totalPrice = 0;
// Function to load cart summary in the payment overlay
async function loadCartSummary() {
  const currentUsername = getCurrentUsername();
  const cartItems = getCartItems(currentUsername);
  const orderSummaryContainer = document.getElementById("orderSummaryItems");
  orderSummaryContainer.innerHTML = "";

  // If cart is empty
  if (Object.keys(cartItems).length === 0) {
    orderSummaryContainer.innerHTML =
      '<p class="text-center">Your cart is empty</p>';
    document.getElementById("orderTotal").textContent = "$0.00";
    return;
  }

  // If cart is not empty
  try {
    const response = await fetch("./assets/json/products.json");
    const products = await response.json();

    let itemsHtml = "";
    Object.keys(cartItems).forEach((productId) => {
      const product = products.find((p) => p.id == productId);
      if (product) {
        const quantity = cartItems[productId];
        const itemTotal = product.price * quantity;
        totalPrice += itemTotal;

        // Create summary item
        itemsHtml += `
          <div class="d-flex justify-content-between mb-2">
            <div>
              <span class="fw-bold">${
                product.name.length > 20
                  ? product.name.substring(0, 20) + "..."
                  : product.name
              }</span>
              <div class="text-muted small">Qty: ${quantity}</div>
            </div>
            <span>$${itemTotal.toFixed(2)}</span>
          </div>
        `;
      }
    });

    orderSummaryContainer.innerHTML = itemsHtml;
    document.getElementById("orderTotal").textContent = `$${totalPrice.toFixed(
      2
    )}`;
  } catch (error) {
    console.error("Error loading products:", error);
    orderSummaryContainer.innerHTML =
      '<p class="text-center">Error loading order summary</p>';
  }
}

// Payment Information Validation
function paymentInfoValidation() {
  // Card Number Validation
  const cardNumberInput = document.getElementById("cardNumber");
  cardNumberInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = value.match(new RegExp(".{1,4}", "g")).join(" ");
    }
    if (value.length > 19) {
      value = value.substring(0, 19);
    }

    this.value = value;
  });

  // Expiry Date Validation
  const expiryDateInput = document.getElementById("expiryDate");
  expiryDateInput.addEventListener("input", function (e) {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 0) {
      if (value.length > 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
    }
    if (value.length > 5) {
      value = value.substring(0, 5);
    }

    this.value = value;
  });

  // CVV Validation
  const cvvInput = document.getElementById("cvv");
  cvvInput.addEventListener("input", function (e) {
    this.value = this.value.replace(/\D/g, "").substring(0, 4);
  });
}

// Process Payment
function processPayment() {
  const currentUsername = getCurrentUsername();
  const cartItems = getCartItems(currentUsername);

  // If cart is empty
  if (Object.keys(cartItems).length === 0) {
    alert("Your cart is empty");
    closePaymentOverlay();
    return;
  }

  // Place the order
  const orderBtn = document.getElementById("placeOrderBtn");
  orderBtn.disabled = true;
  orderBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

  setTimeout(() => {
    const order = {
      orderId:
        "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      customerName: currentUsername,
      orderDate: new Date().getDate(),
      items: cartItems,
      totalPrice,
      shippingInfo: {
        name: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
      },
      paymentMethod: {
        cardNumber: `**** **** **** ${document
          .getElementById("cardNumber")
          .value.slice(-4)}`,
        cardName: document.getElementById("cardName").value,
        expiryDate: document.getElementById("expiryDate").value,
      },
    };

    saveOrder(order);
    saveCartItems({}, currentUsername);
    showOrderConfirmation(order);

    orderBtn.disabled = false;
    orderBtn.textContent = "Place Order";
  }, 1000);
}

// Save order to local storage
function saveOrder(order) {
  const username = getCurrentUsername();
  let orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
  orders.push(order);
  localStorage.setItem(`orders_${username}`, JSON.stringify(orders));
}

// Show order confirmation
function showOrderConfirmation(order) {
  closePaymentOverlay();

  // Create order confirmation overlay
  const confirmationOverlay = document.createElement("div");
  confirmationOverlay.id = "confirmationOverlay";
  confirmationOverlay.className = "overlay";
  confirmationOverlay.innerHTML = `
    <div class="overlay-content" style="max-width: 600px;">
      <div class="overlay-header">
        <h2 class="ms-4">Order Confirmed</h2>
        <button class="close-btn fs-1" id="closeConfirmationBtn">×</button>
      </div>
      <div class="text-center mb-4">
        <div class="mb-3">
          <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
        </div>
        <h4>Thank you for your order!</h4>
        <p>Your order has been placed successfully.</p>
        <div class="alert alert-light border mt-3">
          <strong>Order Number:</strong> ${order.orderId}
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary px-4" id="continueShoppingBtn">Continue Shopping</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmationOverlay);
  document.getElementById("confirmationOverlay").style.display = "block";
  document.body.style.overflow = "hidden";

  // Event listeners
  document
    .getElementById("closeConfirmationBtn")
    .addEventListener("click", function () {
      closeConfirmationOverlay();
      window.location.reload();
    });

  document
    .getElementById("continueShoppingBtn")
    .addEventListener("click", function () {
      closeConfirmationOverlay();
      window.location.reload();
    });
}

// Close confirmation overlay
function closeConfirmationOverlay() {
  document.getElementById("confirmationOverlay").style.display = "none";
  document.body.style.overflow = "auto";
  document.body.removeChild(document.getElementById("confirmationOverlay"));
}
