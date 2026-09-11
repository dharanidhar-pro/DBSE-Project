Build a complete production-quality responsive web application called "MarketHub", a multi-vendor e-commerce marketplace for my B.Tech DBMS semester project.

This must NOT look like a generic AI/vibe-coded website.

It must look like a realistic, professionally designed Indian e-commerce platform with a polished customer storefront and professional vendor/admin dashboards.

IMPORTANT DATABASE CONTEXT:

I already have an existing MySQL database called:

multi_vendor_ecommerce

It already contains EXACTLY these 8 tables:

1. admin
2. vendor
3. customer
4. product
5. inventory
6. cart_items
7. orders
8. vendor_order_details

The MySQL database already exists and is populated.

DO NOT create a new database.
DO NOT migrate the database to Supabase.
DO NOT create additional tables.
DO NOT modify the existing MySQL schema.

The final architecture must be:

Frontend
→ Flask REST API
→ MySQL Connector/Python
→ existing MySQL database

The frontend must never connect directly to MySQL.

The application will eventually communicate with a Flask backend through REST APIs.

==================================================
DESIGN DIRECTION
==================================================

Create a premium, realistic commerce experience.

Avoid:
- generic AI-generated layouts
- excessive gradients
- excessive rounded cards
- excessive glassmorphism
- giant hero sections
- random decorative blobs
- emoji-based UI
- fake-looking dashboards
- placeholder lorem ipsum
- unrealistic buttons
- inconsistent spacing
- inconsistent typography
- random colors

Use a restrained professional design system.

Colors:

Primary:
#0F172A

Secondary:
#3730A3

Accent:
#4F46E5

Success:
#16A34A

Warning:
#D97706

Error:
#DC2626

Background:
#F8FAFC

Surface:
#FFFFFF

Text:
#0F172A

Muted text:
#64748B

Borders:
#E2E8F0

Use color intentionally and consistently.

==================================================
TYPOGRAPHY
==================================================

Use a clean modern sans-serif similar to Inter.

Use a clear hierarchy:

Page titles:
28–32px

Section titles:
20–24px

Body:
14–16px

Small metadata:
12–13px

Avoid oversized text.

==================================================
GLOBAL NAVIGATION
==================================================

Customer navbar:

MarketHub logo
Home
Shop
Categories
Orders
Search
Cart
Account

Desktop navigation should be compact and professional.

Mobile navigation should become a clean responsive menu.

Vendor and Admin applications should use their own professional dashboard sidebar/navigation rather than the customer navbar.

==================================================
CUSTOMER EXPERIENCE
==================================================

Create these pages:

1. Home
2. Shop
3. Product Details
4. Search Results
5. Category Results
6. Cart
7. Checkout
8. Order Confirmation
9. My Orders
10. Order Details
11. Order Tracking
12. Customer Profile
13. Customer Login
14. Customer Registration

==================================================
HOME PAGE
==================================================

Create a realistic e-commerce homepage.

Sections:

- Navigation
- Search
- Hero section
- Featured categories
- Popular products
- New arrivals
- Deals section
- Why shop with MarketHub
- Vendor marketplace section
- Footer

Hero should NOT be huge.

Use realistic copy.

Example:

"Everything you need. From trusted local sellers."

Supporting text:

"Discover products from multiple vendors in one marketplace."

Primary CTA:

"Shop Products"

Secondary CTA:

"Become a Seller"

==================================================
SHOP
==================================================

Create a professional product listing experience.

Include:

- Search
- Category filter
- Price filter
- Availability filter
- Sort by
- Product grid
- Product count
- Pagination

Product cards must show:

- Correct product image
- Product name
- Category
- Vendor/business name
- Price in INR
- Stock availability
- Add to Cart
- View Details

Do NOT use random product images.

==================================================
CURRENCY
==================================================

EVERY PRICE MUST BE IN INDIAN RUPEES.

Use:

₹

Examples:

₹499.00
₹1,299.00
₹12,999.00

Never show:

$
USD
EUR
GBP

Create a centralized INR formatting utility.

==================================================
PRODUCT IMAGES
==================================================

Product images MUST EXACTLY MATCH the product.

Use product_id as the stable identifier.

Create an application-level product image mapping because the existing MySQL product table does not contain an image column.

Never randomly assign images.

Examples:

Laptop → laptop image
Smartphone → smartphone image
Running Shoes → running shoes image
Bluetooth Headphones → Bluetooth headphones image
Backpack → backpack image
Smart Watch → smartwatch image

If an exact image cannot confidently be matched, use a clean category-specific fallback instead of an incorrect product image.

The same product must always use the same image across:

Home
Shop
Product Details
Cart
Checkout
Orders
Vendor Dashboard
Admin Dashboard

==================================================
PRODUCT DETAILS
==================================================

Create a realistic product details page.

Include:

- Large product image
- Product name
- Vendor
- Category
- Description
- Price in INR
- Stock status
- Quantity selector
- Add to Cart
- Buy Now
- Product information
- Delivery information
- Related products

Buttons must actually perform actions.

==================================================
CART
==================================================

Create a real cart experience.

Show:

- Product
- Correct image
- Vendor
- Price
- Quantity
- Subtotal
- Remove
- Cart total

Include:

Continue Shopping
Proceed to Checkout

Quantity controls must work.

==================================================
CHECKOUT
==================================================

Create a realistic checkout page.

Sections:

Customer information
Delivery address
Order summary
Payment method
Final total

Payment methods:

UPI
Card
Cash on Delivery
Net Banking

This is a college project, so payment can be simulated.

Use INR.

Primary CTA:

"Place Order"

Do not use fake-looking payment UI.

==================================================
ORDERS
==================================================

Create:

My Orders
Order Details
Order Tracking

Show:

Order ID
Order date
Products
Quantity
Price
Total
Payment status
Delivery status
Tracking number
Delivery date

Order status:

Pending
Confirmed
Shipped
Delivered
Cancelled

Delivery status:

Processing
Shipped
Out for Delivery
Delivered
Cancelled

==================================================
VENDOR EXPERIENCE
==================================================

Create a professional vendor dashboard.

Pages:

Dashboard
Products
Add Product
Edit Product
Inventory
Orders
Order Details
Profile

Dashboard cards:

Total Products
Inventory Items
Low Stock
Orders
Revenue

Vendor must only see their own products, inventory and orders.

==================================================
ADMIN EXPERIENCE
==================================================

Create a professional admin dashboard.

Sidebar:

Dashboard
Vendors
Customers
Products
Inventory
Orders
Reports
Settings

Dashboard:

Total Vendors
Pending Vendors
Approved Vendors
Customers
Products
Orders
Revenue
Low Stock

Vendor management must include:

Business name
Email
Phone
Address
Approval status
Registration date
Approved date

Actions:

Approve
Reject
View Details

Use confirmation dialogs for destructive actions.

==================================================
REPORTS
==================================================

Create professional reports.

Include:

Orders
Revenue
Customers
Vendors
Products
Inventory
Payment status
Delivery status

Use charts only where they communicate useful information.

Do not overload the dashboard with charts.

==================================================
REALISTIC INTERACTIONS
==================================================

Every visible button must have a meaningful action.

Examples:

Add to Cart → updates cart

Remove → removes item

Quantity + → increases quantity

Quantity - → decreases quantity

Search → filters products

Category → filters products

Sort → changes product order

Checkout → opens checkout

Place Order → creates order through backend

Track Order → opens tracking

Approve Vendor → updates vendor status

Reject Vendor → updates vendor status

Edit Product → opens edit form

Update Inventory → saves inventory

Logout → logs out

Profile → opens profile

Do not create buttons that do nothing.

==================================================
STATES
==================================================

Every page must have:

Loading state
Empty state
Error state
Success state

Examples:

No products found
Cart is empty
No orders yet
No vendors found
Inventory unavailable
API error

Make these states look professionally designed.

==================================================
RESPONSIVE DESIGN
==================================================

Desktop:
1440px optimized

Tablet:
1024px

Mobile:
390px

Everything must remain usable.

No horizontal overflow.

Tables should become responsive cards or horizontally scrollable containers where appropriate.

==================================================
ACCESSIBILITY
==================================================

Use:

- Clear labels
- Accessible buttons
- Keyboard-friendly controls
- Good contrast
- Form validation
- Focus states

==================================================
REALISTIC COPY
==================================================

Do not use:

Lorem ipsum
Test Product
Click Here
Button 1
Sample text
AI generated placeholder content

Use realistic marketplace copy.

==================================================
FINAL VISUAL QUALITY
==================================================

The final website should look like something a real startup could launch.

It should NOT look like:

"AI generated dashboard"

It should feel intentionally designed.

Use consistent:

Spacing
Typography
Buttons
Colors
Cards
Tables
Forms
Icons
States
Navigation

Create a reusable design system so every page feels like part of the same product.

Build the full responsive frontend architecture now, with clean reusable components and realistic interactions.

Do not simplify the requested feature set.
Do not skip pages.
Do not create fake buttons.
Do not use mismatched product images.
Do not use USD.

The goal is a polished, realistic, complete MarketHub web application.