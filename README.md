TechNest E-Commerce Web App
"Where Tech Lives"
A modern, responsive front-end e-commerce web application built with HTML, CSS, and JavaScript, leveraging Bootstrap for a clean and efficient design. TechNest provides a seamless user experience for Browse tech products, managing a cart, and handling user authentication (registration and login).

Table of Contents
Features
Technologies Used
Getting Started
Prerequisites
Installation
Usage
Project Structure
Screenshots
Contributing
License
Contact
Features
User Authentication:
Registration: Secure user registration with client-side password encryption (simple Caesar cipher for demonstration purposes).
Login: User login with validation against stored credentials.
Session Management: User session persistence using browser cookies.
Logout: Clear session and redirect to login.
Responsive Navbar: Modern, collapsible navigation bar with dynamic user greeting upon login.
Dynamic Hero Slider: Engaging image slider in the hero section with automatic transitions and manual navigation indicators.
Product Catalog:
Browse products by categories (Laptops, Desktops, Accessories).
Featured products section with mock data.
Shopping Cart (Placeholder): Dedicated cart page ready for future implementation of adding/removing items.
Newsletter Subscription (Placeholder): Form for email subscription.
Clean & Modern UI: Built with Bootstrap 5 for a consistent and appealing user interface.
Custom Animations: Subtle CSS animations for enhanced user experience (e.g., logo bounce, card hover effects).
Client-Side Validation: Form validation for improved user input quality.
Technologies Used
HTML5: Structure and content of the web pages.
CSS3: Styling and visual presentation.
JavaScript (ES6+): Dynamic behavior, DOM manipulation, form validation, slider functionality, and client-side data handling.
Bootstrap 5: Front-end framework for responsive design and UI components.
Bootstrap Icons: For scalable vector icons.
Google Fonts (Poppins): Custom typography for a modern look.
Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
You only need a modern web browser (e.g., Chrome, Firefox, Edge, Safari) to run this project. No specific server environment is required as it's a front-end only application.

Installation
Clone the repository:
Bash

git clone https://github.com/Muhmd-Sabagh/TechNest-E-Commerce-Web-APP.git
Navigate to the project directory:
Bash

cd TechNest-E-Commerce-Web-APP
Open login.html or index.html: Simply open the login.html (for authentication flow) or index.html (if you already have a user session) file in your web browser.
Usage
Login/Register Page (login.html):
Register a new account if you don't have one. Passwords are encrypted client-side using a simple Caesar cipher (for demonstration).
Log in with your registered credentials.
Password visibility can be toggled using the eye icon.
Home Page (home.html):
Upon successful login, you will be redirected to the home page.
Your username will be displayed in the navbar.
Explore the hero slider and product categories.
Click "Logout" to end your session.
Navigation: Use the navbar to navigate between Home, Categories, Contact, and Cart.
Project Structure
.
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css    # Bootstrap framework CSS
│   │   ├── font-poppins.css     # Poppins font import
│   │   └── style.css            # Custom global styles
│   │   └── home.css             # (Optional) Specific styles for home page
│   ├── js/
│   │   ├── bootstrap.bundle.min.js # Bootstrap JavaScript bundle
│   │   ├── home.js              # Homepage specific scripts (slider, user greeting)
│   │   ├── navbar-toggler.js    # (Optional) Navbar toggler custom script
│   │   └── registration.js      # Login and Registration page scripts
│   ├── images/                  # General images (slider, categories, products)
│   │   └── Hero-Slider/         # Images specifically for the hero slider
│   ├── logo/                    # Project logos and favicon
├── about.html                   # About/Categories page (placeholder)
├── cart.html                    # Shopping Cart page (placeholder)
├── contact.html                 # Contact page (placeholder)
├── home.html                    # Main application home page
├── index.html                   # Entry point (often redirects or serves as a starting page)
├── login.html                   # User login and registration page
└── README.md                    # Project documentation (this file)

Contributing
Contributions are welcome! If you have any suggestions, bug reports, or want to contribute to the codebase, please feel free to:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Make your changes.
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature/your-feature-name).
Open a Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.
(Note: You need to create a https://www.google.com/search?q=LICENSE file in your repository if you haven't already.)

Contact
Muhammad El-Sabbagh - m.elsabagh.eg@gmail.com - www.linkedin.com/in/muhammad-el-sabbagh
Project Link: https://muhmd-sabagh.github.io/TechNest-E-Commerce-Web-APP/
