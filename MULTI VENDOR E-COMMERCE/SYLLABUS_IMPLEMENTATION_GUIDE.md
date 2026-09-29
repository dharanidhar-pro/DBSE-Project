# 🎓 MarketHub — University Syllabus & DBMS Implementation Guide

This project is engineered to directly implement key topics across all **6 Course Outcomes (CO1 to CO6)** from your database and backend engineering syllabus.

---

## 📌 Syllabus Outcomes Mapped in This Project

### 1. CO1: Relational Database Engineering (RDBMS Foundations, SQL & Stored Logic)
| Syllabus Topic | How It Is Implemented in MarketHub | File Location in Project |
| :--- | :--- | :--- |
| **DBMS Architecture & 3-Schema Model** | External schema (User/Vendor/Admin React views), Conceptual schema (8 Relational tables), Internal schema (InnoDB storage, B-tree indexes). | `backend/database/multi_vendor_ecommerce.sql` |
| **Entity-Relationship Modelling** | 8 distinct entities: `admin`, `vendor`, `customer`, `product`, `inventory`, `orders`, `vendor_order_details`, `cart_items` with strict 1:N and M:N cardinalities. | `src/types/database.ts` |
| **Schema Design & Normalisation** | 3NF compliant tables. Primary keys on all tables, Foreign keys with `ON DELETE CASCADE`, unique constraints on email fields. | `backend/database/multi_vendor_ecommerce.sql` |
| **SQL Advanced Querying** | 5-table joins across `orders`, `customer`, `vendor_order_details`, `product`, and `vendor`. Subqueries and aggregates (`COUNT`, `SUM`, `COALESCE`). | `backend/database/stored_procedures_and_queries.sql` |
| **CTEs & Window Functions** | `WITH VendorPerformanceCTE AS (...)`, and `DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC)`. | `backend/database/stored_procedures_and_queries.sql` |
| **Transactions & ACID Properties** | `sp_PlaceOrderTransaction` stored procedure executing checkout under atomic `START TRANSACTION`, `COMMIT`, and `ROLLBACK` on exception. | `backend/database/stored_procedures_and_queries.sql` |
| **Concurrency & MVCC Isolation** | Pessimistic locking using `FOR UPDATE` on `inventory` row during order placement to eliminate race conditions. | `backend/database/stored_procedures_and_queries.sql` |
| **Triggers** | `trg_deduct_inventory_on_order` (automatically reduces quantity) and `trg_prevent_negative_inventory` (signals error `45000` if stock < 0). | `backend/database/stored_procedures_and_queries.sql` |
| **Database Views** | `vw_customer_order_history` (5-table join view) and `vw_vendor_sales_summary` (analytic sales reporting view). | `backend/database/stored_procedures_and_queries.sql` |

---

### 2. CO2: Database Engineering (SQL vs NoSQL Comparative Study & Persistence)
| Syllabus Topic | How It Is Implemented in MarketHub | File Location in Project |
| :--- | :--- | :--- |
| **Relational vs Document Model** | Structured relational tables with foreign keys compared against client-side document/JSON caching. | `src/services/storage.ts` |
| **Polyglot Persistence Bridge** | Dual persistence strategy: PyMySQL backend persistence + in-browser state synchronization for instant offline-resilient UI testing. | `src/services/storage.ts` & `backend/database/db.py` |

---

### 3. CO3: Backend API Engineering (Flask / RESTful API Design)
| Syllabus Topic | How It Is Implemented in MarketHub | File Location in Project |
| :--- | :--- | :--- |
| **REST Constraints & HTTP Methods** | Standard HTTP methods used systematically: `GET` (fetch items/orders), `POST` (create order, login), `PUT` (update vendor approval), `DELETE` (cart items). | `backend/app.py` |
| **Layered Architecture** | Clean separation of concerns: Routers (`app.py`), Configuration (`config.py`), Database Execution Layer (`database/db.py`). | `backend/` directory |
| **Authentication & RBAC** | Role-Based Access Control enforcing distinct permissions and portal access for `CUSTOMER`, `VENDOR`, and `ADMIN`. | `backend/app.py` & `src/services/api/authService.ts` |
| **Database Integration** | Parameterized query execution preventing SQL Injection attacks; PyMySQL DictCursor for JSON serialization. | `backend/database/db.py` |

---

### 4. CO4: Multi-Framework Backend Engineering & Architecture
| Syllabus Topic | How It Is Implemented in MarketHub | File Location in Project |
| :--- | :--- | :--- |
| **Architectural Thinking & Service Boundaries** | Clear boundaries between Customer Storefront, Vendor Management Portal, and Admin Platform Governance. | `src/pages/` (admin, vendor, customer) |
| **Multi-Framework Integration** | Python Flask REST backend integrated with a modern React + TypeScript + Tailwind CSS Node.js client. | `backend/app.py` & `src/` |

---

### 5. CO5: Microservices Engineering
| Syllabus Topic | How It Is Implemented in MarketHub | File Location in Project |
| :--- | :--- | :--- |
| **Domain Decomposition** | Segregated functional domain responsibilities: Catalog Service, Order Processing Engine, Inventory Management, and Auth/RBAC. | `src/services/api/marketplaceService.ts` |
| **Resilient Order Pipeline** | Atomic line-item order placement that prevents partial checkout failures. | `backend/app.py` (`/api/orders/place`) |

---

### 6. CO6: Deployment, Observability & Delivery
| Syllabus Topic | How It Is Implemented in MarketHub | File Location in Project |
| :--- | :--- | :--- |
| **Containerisation with Docker** | Multi-stage `Dockerfile` for the Python Flask application. | `backend/Dockerfile` |
| **Docker Compose Assembly** | Complete 3-tier container stack (`mysql:8.0` database + `backend` API + `frontend` web application). | `docker-compose.yml` |
| **Observability & Health Checks** | Dedicated `/api/health` endpoint returning database connection status and service metadata. | `backend/app.py` |
| **Database Automation** | Automated schema and stored logic loading on MySQL container initialization via `/docker-entrypoint-initdb.d/`. | `docker-compose.yml` |

---

## 🔑 Default Credentials from Your MySQL Dump

| Role | Username / Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@marketplace.com` | `admin123` | Full admin privileges (approve/reject vendors, view all orders) |
| **Customer** | `customer01@gmail.com` | `pass123` | Customer 01 with order history and cart items |
| **Approved Vendor** | `vendor01@gmail.com` | `Vendor@123` | Tech World (Electronics vendor) |
| **Pending Vendor** | `vendor03@gmail.com` | `Vendor@123` | Smart Gadgets (Pending admin approval) |
| **Rejected Vendor** | `vendor05@gmail.com` | `Vendor@123` | Home Essentials (Application rejected) |
