📚 MultiSellerBookstore – React Native Mobile App
<div align="center"> <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"> <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"> <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js"> <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"> <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT"> <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white" alt="Cloudinary"> </div>
🎯 Project Overview

MultiSellerBookstore is a full-stack mobile app that enables users to buy & sell books through a modern Instagram-like interface.

Users can switch roles dynamically:

Buyer Mode → Browse, purchase books, manage cart & orders

Seller Mode → List books, track sales, manage inventory

✨ Key Features

📱 Cross-platform app (React Native)

🔄 Buyer ↔ Seller dynamic role switching

🛒 Complete e-commerce flow (cart, checkout, orders)

📊 Seller dashboard with sales analytics

🖼️ Cloudinary-based image uploads

🔐 JWT Authentication with role-based access

🎨 Responsive UI with professional design

🛠️ Tech Stack

Frontend: React Native, React Navigation, Hook Form, Axios, AsyncStorage, Expo Image Picker, Vector Icons
Backend: Node.js, Express.js, MySQL, JWT, bcrypt, Multer, Cloudinary
Database: MySQL with connection pooling
Others: dotenv, CORS

📱 App Features
🛍️ Buyer

Instagram-like feed of books

Product detail & add-to-cart

Cart management with totals

Order history & tracking

Advanced search & filtering

🏪 Seller

Add / edit / delete books

Sales analytics dashboard

Order management (update status)

Real-time stock monitoring

Cloudinary image upload

🔧 Backend API

RESTful design with role-based access

Full CRUD for users, books, cart, orders

JWT + bcrypt authentication

Cloudinary file uploads


🚀 Installation & Setup
Prerequisites

Node.js (v16+)

npm or yarn

React Native CLI / Expo CLI

MySQL (v8.0+)

Android Studio / Xcode (for testing)

1. Clone Repo
git clone [https://github.com/johnkhore5911/multi-seller-bookstore.git](https://github.com/johnkhore5911/multi-seller-bookstore.git)
cd MultiSellerBookstore

2. Backend Setup
cd backend
npm install


Create .env file:

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bookstore_db
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


Run backend:

npm start

3. Frontend Setup
cd ../frontend
npm install


Update src/services/api.js:

const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000/api';


Run app:

npx react-native run-android   # For Android
npx react-native run-ios       # For iOS
npx expo start                 # If using Expo

🎮 Usage Guide

Register as Buyer or Seller (can switch roles anytime)

As Buyer → browse, add to cart, order & track

As Seller → list books, view sales, manage orders

Role switching happens seamlessly without logout

🔐 Security

JWT stateless authentication

Role-based access control

Passwords hashed with bcrypt

Token expiration handling

📊 API Endpoints (Sample)

Auth: POST /api/auth/register, POST /api/auth/login

Books: GET /api/books, POST /api/books (seller only)

Cart: GET /api/cart, POST /api/cart

Orders: POST /api/orders, GET /api/orders/buyer, GET /api/orders/seller

🎨 Design System

Brand Colors: Orange (#FF6B35), Blue (#2E3192), Yellow (#FFD23F)

Reusable components: Custom Buttons, Inputs, Cards, Spinners

Clean UI with professional layout

🚧 Development Notes

Role switching relaxed for dev

Cloudinary integration for scalable storage

Uses connection pooling for DB

Error handling with friendly messages

Future Enhancements:

Push notifications for orders

Payment gateway integration

Ratings & reviews

Advanced analytics

📞 Contact

👨‍💻 Developer: John Khore
📧 Email: johnkhore26@gmail.com

📱 Phone: +91 9056653906

📄 License

Developed as an assignment project to demonstrate full-stack React Native + Node.js skills.

<div align="center"> <h3>⭐ If you found this project helpful, please give it a star! ⭐</h3> </div>
