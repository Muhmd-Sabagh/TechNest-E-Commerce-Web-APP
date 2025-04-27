document.addEventListener("DOMContentLoaded", function () {
  // Registration form elements
  const regForm = document.getElementById("registrationForm");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  // Login form elements
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const loginBtn = document.getElementById("login-btn");
  const emailError = document.getElementById("email-error");

  // Check if email exists in localStorage when leaving email input
  loginEmail.addEventListener("blur", function () {
    const email = this.value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (email && !userExists) {
      emailError.style.display = "block";
      loginPassword.disabled = true;
      loginBtn.disabled = true;
    } else {
      emailError.style.display = "none";
      loginPassword.disabled = false;
      loginBtn.disabled = false;
    }
  });

  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      const icon = this.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
      }
    });
  });

  // Confirm password validation
  confirmPassword.addEventListener("input", function () {
    if (confirmPassword.value !== password.value) {
      confirmPassword.setCustomValidity("Passwords must match");
      confirmPassword.classList.add("is-invalid");
    } else {
      confirmPassword.setCustomValidity("");
      confirmPassword.classList.remove("is-invalid");
    }
  });

  // Encryption and Decryption functions for password
  function simpleEncrypt(text, shift = 5) {
    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        return String.fromCharCode(code + shift);
      })
      .join("");
  }

  function simpleDecrypt(encryptedText, shift = 5) {
    return encryptedText
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        return String.fromCharCode(code - shift);
      })
      .join("");
  }

  // Registration form submission
  regForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const name = document.getElementById("name").value;
    const rawPassword = password.value;
    const encryptedPassword = simpleEncrypt(rawPassword);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("Email already exists. Please try to sign in.");
    } else if (this.checkValidity()) {
      const user = {
        email,
        name,
        password: encryptedPassword,
      };

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful! You can now sign in.");
      this.reset();
      this.classList.remove("was-validated");
    } else {
      this.classList.add("was-validated");
    }
  });

  // Login form submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const enteredPassword = loginPassword.value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (user && simpleDecrypt(user.password) === enteredPassword) {
      redirectToHome(email, user.name);
    } else {
      alert("Invalid password");
    }
  });

  // Function to redirect to home page
  function redirectToHome(email, name) {
    window.location.href = "./index.html";

    const userData = {
      email: email,
      name: name,
    };
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const expires = "expires=" + expirationDate;
    document.cookie = `${"userSession"}=${JSON.stringify(userData)};${expires}`;
  }
});
