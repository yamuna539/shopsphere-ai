# 🛍️ ShopSphere AI

### AI-Powered Full-Stack E-Commerce Platform

ShopSphere AI is a modern full-stack e-commerce platform built with the **MERN stack**, enhanced with **Google Gemini AI** for intelligent shopping assistance, product recommendations, product comparison, and AI-powered review summaries.

The application provides separate customer and admin experiences with secure authentication, product management, cart and wishlist functionality, checkout, Razorpay test payments, order management, reviews, and AI-powered shopping features.

---

## ✨ Features

### 👤 Authentication & Authorization

* Customer registration and login
* Admin login
* JWT-based authentication
* Password hashing with bcrypt
* Role-based authorization
* Protected customer routes
* Protected admin routes
* Profile management
* Change password functionality

### 🛍️ Product Browsing

* Product listing
* Product details
* Product search
* Category filtering
* Brand filtering
* Price filtering
* Rating filtering
* Stock filtering
* Product sorting
* Pagination
* Product ratings and reviews
* Stock availability display

### 🛒 Shopping Cart

* Add products to cart
* Update quantity
* Remove products
* Clear cart
* Stock validation
* Server-side price validation
* Automatic subtotal calculation
* Tax calculation
* Shipping calculation
* Final amount calculated by backend

### ❤️ Wishlist

* Add products to wishlist
* Remove products
* View wishlist
* Move wishlist products to cart
* Duplicate wishlist prevention

### 💳 Checkout & Payments

* Checkout form
* Shipping address
* Order summary
* Backend price validation
* Stock validation
* Razorpay TEST MODE integration
* Razorpay payment verification
* Payment status tracking
* Order status tracking
* Order confirmation page

### 📦 Orders

* Place orders
* View order history
* View order details
* Payment status
* Order status
* Shipping information
* Order item snapshots
* Admin order management

### ⭐ Reviews & Ratings

* Add product reviews
* Update reviews
* Delete reviews
* Rating system
* Average product rating
* Review count
* Duplicate review prevention

---

# 🤖 AI Features

ShopSphere AI integrates Gemini through the backend.

The Gemini API key is never exposed to the React frontend.

### 💬 AI Shopping Assistant

Customers can ask questions such as:

> "I need a laptop for programming under ₹60,000."

The system:

1. Receives the customer's query.
2. Searches the product database.
3. Retrieves relevant products.
4. Sends only the relevant products to Gemini.
5. Gemini explains suitable recommendations.
6. The backend validates returned product IDs.
7. The frontend displays only real products from MongoDB.

The AI does not create fictional products or prices.

---

### 🧠 AI Product Recommendations

The Product Details page provides:

**AI Recommended Products**

The backend first retrieves real products from MongoDB.

Gemini then helps explain why the supplied products may be relevant based on:

* Category
* Brand
* Price
* Features
* Specifications
* Description
* Rating

Only products returned from the database can be recommended.

---

### ⚖️ AI Product Comparison

Customers can compare multiple products.

The comparison includes:

* Product image
* Product name
* Price
* Rating
* Brand
* Specifications
* Features

Gemini provides:

* Key differences
* Similarities
* Important specifications
* Suitable use cases

The system does not ask Gemini to invent product information or create a universal winner.

---

### 📝 AI Review Summary

Gemini summarizes real customer reviews retrieved from MongoDB.

The summary includes:

* Positive aspects
* Common concerns
* Overall summary

The result is clearly marked as:

**AI-generated summary**

If a product has no reviews, the application handles the situation appropriately instead of generating fictional feedback.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* Vite
* React Router DOM
* Redux Toolkit
* Axios
* Bootstrap
* Recharts

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Helmet
* Express Rate Limit

## AI

* Google Gemini API
* Backend Gemini service

## Payments

* Razorpay TEST MODE

## Image Management

* Cloudinary

## Development Tools

* VS Code
* Postman
* Git
* GitHub

---

# 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite UI   │
                    └──────────┬──────────┘
                               │
                         Redux Toolkit
                               │
                             Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        MongoDB            Razorpay          Gemini AI
             │                 │                 │
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Cloudinary Images │
                    └─────────────────────┘
```

---

# 📁 Project Structure

```text
ShopSphere-AI/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── docs/
│   ├── performance-checklist.md
│   └── testing-report.md
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd ShopSphere-AI
```

---

# 🔧 Backend Setup

Navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
server/.env
```

Add:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm start
```

Development mode, if configured:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_test_public_key
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🗄️ MongoDB Setup

ShopSphere AI requires MongoDB.

You can use:

* MongoDB Atlas
* Local MongoDB

Set the connection string in:

```text
server/.env
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsphere
```

After connecting MongoDB, seed the database with:

* Admin user
* Customer user
* Categories
* Products
* Product images
* Product reviews

---

# 🤖 Gemini AI Setup

Create a Gemini API key and add it to:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The key must remain inside the backend environment.

It must NOT be placed in:

```text
client/.env
```

and must never be exposed through React.

Gemini is accessed through:

```text
server/services/geminiService.js
```

AI-related services include:

```text
aiShoppingService.js
aiRecommendationService.js
```

---

# 💳 Razorpay Setup

ShopSphere AI uses Razorpay in **TEST MODE**.

Configure:

```env
RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_test_secret
```

Frontend receives only the public key:

```env
VITE_RAZORPAY_KEY_ID=your_test_public_key
```

The Razorpay secret remains on the backend.

Payment verification is performed by the backend using the Razorpay signature.

---

# ☁️ Cloudinary Setup

Configure Cloudinary credentials in the backend:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Cloudinary is used for product image management.

Sensitive Cloudinary credentials must remain on the server.

---

# 🔐 Security

ShopSphere AI implements multiple security measures:

* JWT authentication
* bcrypt password hashing
* Role-based authorization
* Admin route protection
* Helmet security headers
* CORS configuration
* Rate limiting
* Input validation
* MongoDB ObjectId validation
* Environment variables
* Server-side price validation
* Server-side stock validation
* Razorpay signature verification
* Gemini API key protection
* Cloudinary credential protection
* Request body size limits
* Protection against unauthorized admin operations

The backend is authoritative for:

* Product prices
* Product stock
* Order totals
* Payment verification

The frontend must never be trusted for final payment calculations.

---

# 📡 API Overview

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/admin-login
GET    /api/auth/me
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/change-password
POST   /api/auth/logout
```

---

## Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Admin product mutations require authentication and admin authorization.

---

## Categories

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

---

## Cart

```text
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:productId
DELETE /api/cart/items/:productId
DELETE /api/cart
```

---

## Wishlist

```text
GET    /api/wishlist
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId
DELETE /api/wishlist
```

---

## Orders

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
```

---

## Payments

```text
POST   /api/payment/create-order
POST   /api/payment/verify
```

---

## AI

```text
GET    /api/ai/test
POST   /api/ai/chat
GET    /api/ai/recommendations/:productId
```

---

## Admin

### Dashboard

```text
GET /api/admin/dashboard
GET /api/admin/recent-orders
GET /api/admin/sales
```

### Products

```text
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

### Categories

```text
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

### Orders

```text
GET   /api/admin/orders
GET   /api/admin/orders/:id
PATCH /api/admin/orders/:id/status
```

### Users

```text
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

All admin endpoints require authentication and admin authorization.

---

# 🧪 Testing

ShopSphere AI was tested using:

**Postman**

Testing covers:

* Authentication
* Authorization
* Products
* Categories
* Cart
* Wishlist
* Reviews
* Checkout
* Orders
* Razorpay TEST MODE
* AI Shopping Assistant
* AI Recommendations
* AI Product Comparison
* AI Review Summary
* Admin Dashboard
* Admin Products
* Admin Categories
* Admin Orders
* Admin Users
* Invalid inputs
* Unauthorized access
* Security scenarios
* Responsive UI

Testing documentation:

```text
docs/testing-report.md
```

---

# ⚡ Performance Optimization

Performance improvements include:

* MongoDB indexes
* Query projection
* `.lean()` for read-heavy queries
* Pagination
* Response compression
* React lazy loading
* React memoization
* Debounced search
* Optimized API payloads
* Lazy-loaded images
* Optimized product images
* Reduced duplicate API requests
* AI candidate limits
* AI recommendation caching
* Optimized Gemini prompts
* Production build testing

Performance checklist:

```text
docs/performance-checklist.md
```

---

# 👨‍💼 Admin Features

The admin dashboard provides:

### Dashboard

* Total users
* Total products
* Total orders
* Pending orders
* Delivered orders
* Revenue
* Sales chart
* Recent orders

### Product Management

* Create products
* Edit products
* Delete products
* Update price
* Update stock
* Manage images
* Manage features
* Manage specifications

### Category Management

* Create categories
* Edit categories
* Delete categories

### Order Management

* View orders
* Search orders
* Filter orders
* View order details
* Update order status

### User Management

* View users
* Search users
* Change user role
* Delete users

---

# 👤 Customer Flow

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
Search / Filter / Sort
   ↓
Product Details
   ↓
Reviews
   ↓
AI Recommendations
   ↓
Add to Cart
   ↓
Wishlist
   ↓
Checkout
   ↓
Razorpay TEST Payment
   ↓
Payment Verification
   ↓
Order Confirmation
   ↓
Order History
```

---

# 🤖 AI Shopping Flow

```text
Customer Query
      ↓
POST /api/ai/chat
      ↓
Backend
      ↓
MongoDB Product Search
      ↓
Relevant Products
      ↓
Gemini
      ↓
Structured Recommendation
      ↓
Backend Product Validation
      ↓
Real MongoDB Products
      ↓
React UI
```

This architecture prevents Gemini from inventing products, prices, product IDs, specifications, or stock information.

---

# 📸 Screenshots

Add screenshots here after completing the final UI.

Recommended screenshots:

### Home / Product Listing

```text
docs/screenshots/home.png
```

### Product Details

```text
docs/screenshots/product-details.png
```

### Shopping Cart

```text
docs/screenshots/cart.png
```

### Checkout

```text
docs/screenshots/checkout.png
```

### AI Shopping Assistant

```text
docs/screenshots/ai-assistant.png
```

### AI Recommendations

```text
docs/screenshots/ai-recommendations.png
```

### Product Comparison

```text
docs/screenshots/comparison.png
```

### Admin Dashboard

```text
docs/screenshots/admin-dashboard.png
```

### Admin Products

```text
docs/screenshots/admin-products.png
```

---

# 🚀 Production Build

Frontend:

```bash
cd client
npm run build
```

Preview:

```bash
npm run preview
```

Backend:

```bash
cd server
npm start
```

Before deployment, configure production environment variables and update the frontend API URL.

---

# 🌐 Deployment

The application can be deployed using separate frontend and backend hosting.

### Frontend

Possible hosting platforms:

* Vercel
* Netlify

### Backend

Possible hosting platforms:

* Render
* Railway
* Other Node.js-compatible hosting

### Database

* MongoDB Atlas

### Images

* Cloudinary

### Payments

* Razorpay

### AI

* Gemini API

---

# 🔮 Future Improvements

Possible future improvements include:

* Advanced recommendation personalization
* Product embeddings
* Semantic product search
* Voice-based shopping assistant
* Order tracking integration
* Coupon and discount system
* Inventory alerts
* Seller/vendor accounts
* Advanced analytics
* Email notifications
* Push notifications
* AI-powered product search
* AI-powered customer support
* Personalized home page

---

# 📌 Project Highlights

ShopSphere AI demonstrates practical full-stack development concepts including:

* MERN architecture
* REST API development
* JWT authentication
* Role-based authorization
* MongoDB data modeling
* Redux Toolkit state management
* Payment gateway integration
* Server-side validation
* AI API integration
* Secure backend architecture
* Admin dashboard development
* Responsive UI
* Performance optimization
* API testing
* Production deployment

---

# 👩‍💻 Author

**Yamuna Jyothi**

Full Stack Developer

### Technologies

React.js • JavaScript • Node.js • Express.js • MongoDB • Java • Spring Boot • REST APIs • Gemini AI

---

# ⭐ Project

If you find this project useful, consider giving the repository a star.

```text
Built with ❤️ using the MERN Stack + Gemini AI
```
