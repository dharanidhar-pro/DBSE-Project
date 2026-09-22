# 🛒 MARKETHUB — Multi-Vendor E-Commerce Management System

> A full-stack, database-driven multi-vendor e-commerce platform developed as a DBMS academic project.

---

## 📌 Project Overview

**MARKETHUB** is a database-driven multi-vendor e-commerce management system designed to provide a centralized platform where customers can browse products from multiple vendors, manage shopping carts, place orders, and track order information.

The system is designed with a clear separation between the **frontend, backend, and database layers**. The frontend provides an interactive and responsive shopping experience, while the backend is responsible for business logic, API communication, authentication, and database operations.

The project uses **MySQL** as the primary relational database management system.

The database schema has been designed specifically for managing:

* Customers
* Vendors
* Products
* Inventory
* Shopping carts
* Orders
* Vendor-wise order details
* Administrative operations

---

# 🎯 Objectives

The main objectives of MARKETHUB are:

1. To develop a centralized multi-vendor e-commerce platform.
2. To design and implement a normalized relational database.
3. To manage customers, vendors, products, inventory, and orders efficiently.
4. To provide a responsive and user-friendly shopping interface.
5. To establish relationships between different entities using primary and foreign keys.
6. To implement CRUD operations through backend APIs.
7. To provide secure user authentication and role-based access.
8. To demonstrate practical implementation of DBMS concepts in a real-world application.

---

# ✨ Key Features

## 👤 Customer Features

* Customer registration and login
* Customer profile management
* Product browsing
* Product search
* Product category filtering
* Product details
* Product pricing in Indian Rupees (₹ INR)
* Shopping cart management
* Add/remove products from cart
* Quantity management
* Order placement
* Order history
* Order status tracking
* Wishlist functionality
* Responsive interface

---

## 🏪 Vendor Features

The platform supports multiple vendors who can manage their products and inventory.

Vendor-related functionality includes:

* Vendor management
* Product management
* Inventory management
* Product availability tracking
* Vendor-specific order information
* Vendor order details
* Stock management

---

## 👨‍💼 Admin Features

Administrative functionality is separated from the normal customer interface.

The administrator can manage:

* Customers
* Vendors
* Products
* Inventory
* Orders
* Vendor order details
* Platform-level information

> **Important:** The administrator login is intended to be a separate role and should not be exposed as a normal customer login option.

---

# 🗄️ Database Design

The project uses the following MySQL database:

```text
multi_vendor_ecommerce
```

The database contains the following primary tables:

```text
admin
cart_items
customer
inventory
orders
product
vendor
vendor_order_details
```

---

# 📊 Database Tables

## 1. `admin`

Stores administrator-related information.

### Purpose

Used for managing administrative access and platform-level operations.

### Main responsibilities

* Administrator authentication
* Administrative management
* Platform control

---

## 2. `customer`

Stores information about registered customers.

### Purpose

Maintains customer accounts and customer-related information.

### Used for

* Registration
* Login
* Customer profile
* Customer identification
* Order association

---

## 3. `vendor`

Stores information about sellers/vendors registered on the platform.

### Purpose

Allows multiple vendors to sell and manage products through the platform.

### Used for

* Vendor identification
* Vendor management
* Vendor-product relationships
* Vendor order management

---

## 4. `product`

Stores product information available on MARKETHUB.

### Purpose

Contains the main product catalogue.

### Used for

* Product names
* Product descriptions
* Prices
* Categories
* Vendor association
* Product identification

---

## 5. `inventory`

Maintains product stock and inventory-related information.

### Purpose

Tracks the availability and stock information of products.

### Used for

* Stock quantity
* Product availability
* Inventory updates
* Last updated information

---

## 6. `cart_items`

Stores products added to customer shopping carts.

### Purpose

Connects customers with the products they have selected before checkout.

### Used for

* Cart creation
* Product selection
* Quantity management
* Cart updates

---

## 7. `orders`

Stores customer order information.

### Purpose

Maintains the main order records created after checkout.

### Used for

* Order ID
* Customer association
* Order date
* Total amount
* Delivery address
* Order status

---

## 8. `vendor_order_details`

Maintains vendor-specific information associated with customer orders.

### Purpose

Supports the multi-vendor nature of the platform by separating order information based on vendors.

### Used for

* Order-vendor association
* Vendor-specific products
* Vendor order processing
* Vendor-level order information

---

# 🔗 Database Relationship Overview

The major relationships in the database can be represented as:

```text
                    ┌──────────────┐
                    │   CUSTOMER   │
                    └──────┬───────┘
                           │
                           │
                    ┌──────▼───────┐
                    │    ORDERS    │
                    └──────┬───────┘
                           │
                           │
              ┌────────────▼────────────┐
              │ VENDOR_ORDER_DETAILS    │
              └────────────┬────────────┘
                           │
                           │
                    ┌──────▼───────┐
                    │    VENDOR    │
                    └──────┬───────┘
                           │
                           │
                    ┌──────▼───────┐
                    │   PRODUCT    │
                    └──────┬───────┘
                           │
                           │
                    ┌──────▼───────┐
                    │  INVENTORY   │
                    └──────────────┘

CUSTOMER
   │
   ▼
CART_ITEMS
   │
   ▼
PRODUCT
```

The complete relationship structure is represented through the project's MySQL schema and EER diagram.

---

# 🏗️ System Architecture

MARKETHUB follows a layered application architecture:

```text
┌─────────────────────────────────────────────┐
│                 FRONTEND                    │
│       React / TypeScript / Vite             │
│                                             │
│  Pages • Components • UI • User Interaction│
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│                  BACKEND                    │
│                  Flask                     │
│                                             │
│ Routes • Services • Middleware • Auth       │
└──────────────────────┬──────────────────────┘
                       │
                       │ SQL Queries
                       ▼
┌─────────────────────────────────────────────┐
│                 DATABASE                    │
│                  MySQL                      │
│                                             │
│ Customers • Vendors • Products • Orders     │
│ Inventory • Cart • Admin                    │
└─────────────────────────────────────────────┘
```

---

# 💻 Technology Stack

## Frontend

* React.js
* TypeScript
* Vite
* HTML5
* CSS3
* JavaScript / TypeScript
* Responsive UI design

## Backend

* Python
* Flask
* Flask-CORS
* RESTful APIs
* Python-dotenv

## Database

* MySQL
* MySQL Workbench
* SQL

## Development Tools

* Visual Studio Code
* MySQL Workbench
* Git
* GitHub
* Google AI Studio / AI-assisted development tools

---

# 📁 Project Structure

The project is organized into separate frontend, backend, and database components.

```text
MARKETHUB/
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── public/
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── metadata.json
│   ├── .env.example
│   └── .gitignore
│
├── Backend/
│   │
│   ├── database/
│   │   └── db.py
│   │
│   ├── middleware/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
│
├── Database/
│   │
│   ├── multi_vendor_ecommerce.sql
│   ├── tables/
│   └── EER_Diagram/
│
└── README.md
```

> Folder names may be adjusted according to the final repository organization.

---

# 🎨 Frontend Design

The frontend is designed to provide a realistic modern e-commerce experience rather than a basic academic interface.

The interface focuses on:

* Clean navigation
* Product-focused layouts
* Responsive design
* Clear product cards
* Accurate product imagery
* Indian Rupee pricing
* Search and filtering
* Shopping cart interactions
* User account pages
* Order management
* Consistent visual design

All product images should correspond to their respective products to avoid misleading product representation.

---

# 💰 Currency

The platform uses:

```text
₹ INR
```

for all product prices, cart totals, order totals, and other monetary values.

Example:

```text
₹1,499
₹3,999
₹12,999
```

---

# 🔐 Authentication & Authorization

The application is designed to support role-based access.

### Customer

```text
Customer → Customer Login → Customer Features
```

### Vendor

```text
Vendor → Vendor Authentication → Vendor Features
```

### Administrator

```text
Admin → Separate Administrative Authentication → Admin Panel
```

The administrator interface should not be displayed as a normal customer registration/login option.

Authentication and authorization will be handled through the backend API.

---

# 🔌 Backend API Architecture

The backend follows a REST API architecture.

Example API structure:

```text
/api
│
├── /auth
│   ├── register
│   ├── login
│   └── logout
│
├── /customers
│
├── /vendors
│
├── /products
│
├── /inventory
│
├── /cart
│
├── /orders
│
└── /admin
```

The API layer is responsible for communicating between the frontend application and MySQL database.

---

# 🛢️ MySQL Database Connection

The backend connects to the existing MySQL database:

```text
Database Name:
multi_vendor_ecommerce
```

The backend is designed to work with the existing database schema rather than unnecessarily changing the established database structure.

Database configuration is maintained through environment variables.

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=multi_vendor_ecommerce
```

> Never commit the real database password or other secrets to GitHub.

---

# ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment variables using the `.env` file.

Start the Flask backend:

```bash
python app.py
```

The backend will run locally on the configured Flask port.

---

# ⚙️ Frontend Setup

Navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

---

# 🗄️ Database Setup

1. Install MySQL Server.
2. Install MySQL Workbench.
3. Start the MySQL server.
4. Create/use the database:

```sql
CREATE DATABASE multi_vendor_ecommerce;
```

5. Import the provided SQL database/schema.
6. Verify that the required tables exist.

Expected tables:

```text
admin
cart_items
customer
inventory
orders
product
vendor
vendor_order_details
```

7. Configure the backend database credentials.
8. Start the backend server.

---

# 🧪 Testing

The system should be tested at three major levels.

## Frontend Testing

Verify:

* Navigation
* Product display
* Search
* Filtering
* Cart operations
* Wishlist interactions
* Login/register UI
* Checkout interface
* Responsive layout

## Backend Testing

Verify:

* API availability
* Request validation
* Authentication
* CRUD operations
* Error handling
* Database connectivity

## Database Testing

Verify:

* Insert operations
* Update operations
* Delete operations
* Select queries
* Primary keys
* Foreign keys
* Relationships
* Referential integrity

---

# 🔄 Application Flow

The basic customer workflow is:

```text
Open MARKETHUB
       ↓
Browse Products
       ↓
Search / Filter
       ↓
View Product
       ↓
Add to Cart
       ↓
Review Cart
       ↓
Checkout
       ↓
Enter Delivery Information
       ↓
Place Order
       ↓
Order Stored in MySQL
       ↓
Order History
```

---

# 📦 Multi-Vendor Workflow

MARKETHUB supports multiple vendors.

The conceptual workflow is:

```text
Vendor
  ↓
Adds Product
  ↓
Product Stored in Database
  ↓
Inventory Managed
  ↓
Customer Views Product
  ↓
Customer Adds Product to Cart
  ↓
Customer Places Order
  ↓
Order Created
  ↓
Vendor-Specific Order Details
  ↓
Vendor Processes Order
```

---

# 📚 DBMS Concepts Demonstrated

This project demonstrates practical application of several DBMS concepts:

* Relational database design
* Entity-Relationship modeling
* EER diagram
* Tables
* Primary keys
* Foreign keys
* Relationships
* Constraints
* CRUD operations
* SQL queries
* Data integrity
* Referential integrity
* Database normalization
* Multi-table relationships
* Joins
* Transaction-oriented operations
* Database-backed application architecture

---

# 📈 Future Enhancements

Future versions of MARKETHUB can include:

1. Online payment gateway integration.
2. Real email OTP authentication.
3. Advanced product recommendations.
4. Vendor analytics dashboard.
5. Sales and revenue analytics.
6. Real-time inventory updates.
7. Product reviews and ratings.
8. Order tracking.
9. Notification system.
10. Cloud deployment.
11. Advanced admin analytics.
12. Secure production authentication.
13. Image storage using cloud services.
14. Automated invoice generation.
15. Delivery partner integration.

---

# 🚀 Deployment

The application can be deployed using separate services for the frontend and backend.

### Frontend

Possible deployment platforms:

* Vercel
* Netlify
* Firebase Hosting

### Backend

Possible deployment platforms:

* Render
* Railway
* Google Cloud
* AWS

### Database

For production deployment, a managed MySQL database can be used.

---

# 🔒 Security Considerations

The following security practices should be followed:

* Never expose database credentials.
* Store secrets in environment variables.
* Never commit `.env` files.
* Validate user input.
* Use parameterized SQL queries.
* Implement password hashing.
* Apply role-based authorization.
* Protect administrative routes.
* Validate API requests.
* Handle authentication securely.

---

# 👥 Project Team

| Team Member   | Roll Number         |
| ------------- | ------------------- |
| Dhara­ni Dhar | 2520030163 |
| Thrinadh     | 2520030529
| S.Karthik    | 2520030235 |


> Update the team member names and roles according to the final project team.

---

# 👨‍🏫 Project Information

**Project:** MARKETHUB — Multi-Vendor E-Commerce Management System

**Subject:** Database Management Systems (DBMS)

**Database:** MySQL

**Backend:** Flask / Python

**Frontend:** React / TypeScript / Vite

**Development Environment:** Visual Studio Code

**Database Tool:** MySQL Workbench

**Version Control:** Git & GitHub

---


---

# 📝 Conclusion

MARKETHUB demonstrates how database management concepts can be integrated into a practical real-world e-commerce application.

The project combines a modern responsive frontend, a structured Flask backend, REST APIs, and a relational MySQL database to create a scalable multi-vendor e-commerce architecture.

The system provides a foundation for managing customers, vendors, products, inventory, shopping carts, and orders while demonstrating important DBMS concepts such as relational modeling, primary and foreign keys, database relationships, CRUD operations, data integrity, and multi-table queries.

The project can be further extended into a production-ready e-commerce platform by integrating secure authentication, payment processing, real-time inventory management, analytics, notifications, and cloud deployment.

---

## ⭐ MARKETHUB

**A database-driven multi-vendor e-commerce platform built to demonstrate practical DBMS concepts through a real-world application.**
