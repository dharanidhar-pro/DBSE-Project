-- ==================================================================================
-- MarketHub - Advanced RDBMS Engineering & Stored Logic (Syllabus Mapped: CO1)
-- Database: multi_vendor_ecommerce
-- ==================================================================================

USE `multi_vendor_ecommerce`;

-- ----------------------------------------------------------------------------------
-- [CO1: Relational Database Engineering - Views & Multi-Table Joins]
-- Topic: Views, Entity-Relationship Mapping, Catalog Tools
-- Explanation: Views abstract complex 5-table relational joins between Customer,
--              Orders, Vendor_Order_Details, Product, and Vendor entities.
-- ----------------------------------------------------------------------------------

DROP VIEW IF EXISTS `vw_customer_order_history`;
CREATE VIEW `vw_customer_order_history` AS
SELECT 
    o.order_id,
    c.customer_id,
    c.name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    vod.vendor_order_id,
    v.vendor_id,
    v.business_name,
    p.product_id,
    p.product_name,
    p.category,
    vod.quantity,
    vod.price,
    vod.subtotal,
    vod.payment_method,
    vod.payment_status,
    vod.delivery_status,
    vod.tracking_number,
    o.order_date,
    vod.delivery_date,
    o.delivery_address
FROM orders o
JOIN customer c ON o.customer_id = c.customer_id
JOIN vendor_order_details vod ON o.order_id = vod.order_id
JOIN product p ON vod.product_id = p.product_id
JOIN vendor v ON vod.vendor_id = v.vendor_id;

DROP VIEW IF EXISTS `vw_vendor_sales_summary`;
CREATE VIEW `vw_vendor_sales_summary` AS
SELECT 
    v.vendor_id,
    v.business_name,
    v.approval_status,
    COUNT(DISTINCT vod.order_id) AS total_orders,
    SUM(vod.quantity) AS total_units_sold,
    SUM(vod.subtotal) AS gross_revenue,
    SUM(CASE WHEN vod.payment_status = 'Completed' THEN vod.subtotal ELSE 0 END) AS settled_revenue,
    SUM(CASE WHEN vod.delivery_status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
    SUM(CASE WHEN vod.delivery_status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM vendor v
LEFT JOIN vendor_order_details vod ON v.vendor_id = vod.vendor_id
GROUP BY v.vendor_id, v.business_name, v.approval_status;

-- ----------------------------------------------------------------------------------
-- [CO1: Transactions & Stored Logic - Triggers]
-- Topic: Triggers, Constraints, Integrity Enforcement
-- Explanation: Ensures automated real-time consistency between orders placed and
--              live inventory stock quantities without application-layer delay.
-- ----------------------------------------------------------------------------------

DELIMITER $$

DROP TRIGGER IF EXISTS `trg_deduct_inventory_on_order`$$
CREATE TRIGGER `trg_deduct_inventory_on_order`
AFTER INSERT ON `vendor_order_details`
FOR EACH ROW
BEGIN
    -- Deducts the purchased quantity from active inventory
    UPDATE inventory 
    SET quantity = quantity - NEW.quantity
    WHERE product_id = NEW.product_id 
      AND vendor_id = NEW.vendor_id;
END$$

DROP TRIGGER IF EXISTS `trg_prevent_negative_inventory`$$
CREATE TRIGGER `trg_prevent_negative_inventory`
BEFORE UPDATE ON `inventory`
FOR EACH ROW
BEGIN
    -- Enforces domain constraint that warehouse stock cannot drop below zero
    IF NEW.quantity < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Transaction Rejected: Insufficient inventory stock available';
    END IF;
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------------
-- [CO1: Transactions & Stored Logic - ACID Transactions & Stored Procedures]
-- Topic: ACID Properties (Atomicity, Consistency, Isolation, Durability), Procedures
-- Explanation: Encapsulates atomic multi-table checkout operations within a single
--              isolated transaction with pessimistic locking and rollback support.
-- ----------------------------------------------------------------------------------

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_PlaceOrderTransaction`$$
CREATE PROCEDURE `sp_PlaceOrderTransaction`(
    IN p_order_id VARCHAR(20),
    IN p_customer_id INT,
    IN p_total_amount DECIMAL(10,2),
    IN p_delivery_address VARCHAR(255),
    IN p_vendor_id INT,
    IN p_product_id INT,
    IN p_business_name VARCHAR(100),
    IN p_payment_method VARCHAR(30),
    IN p_quantity INT,
    IN p_price DECIMAL(10,2),
    IN p_tracking_number VARCHAR(50),
    OUT p_status_code INT,
    OUT p_status_message VARCHAR(255)
)
proc_label: BEGIN
    DECLARE v_available_stock INT;
    
    -- Error handler triggers automatic ROLLBACK on SQL exception
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_status_code = 500;
        SET p_status_message = 'Transaction Rolled Back: Database exception encountered.';
    END;

    -- Begin ACID Transaction
    START TRANSACTION;

    -- [Isolation & MVCC]: Check and lock inventory row to prevent race conditions
    SELECT quantity INTO v_available_stock
    FROM inventory
    WHERE product_id = p_product_id AND vendor_id = p_vendor_id
    FOR UPDATE;

    IF v_available_stock IS NULL OR v_available_stock < p_quantity THEN
        ROLLBACK;
        SET p_status_code = 400;
        SET p_status_message = 'Transaction Aborted: Insufficient stock in inventory.';
        LEAVE proc_label;
    END IF;

    -- 1. Insert Master Order record
    INSERT INTO orders (order_id, customer_id, order_date, total_amount, delivery_address, order_status)
    VALUES (p_order_id, p_customer_id, CURDATE(), p_total_amount, p_delivery_address, 'Pending');

    -- 2. Insert Detailed Vendor Line Item
    INSERT INTO vendor_order_details (
        order_id, customer_id, vendor_id, product_id, business_name,
        order_date, delivery_date, payment_method, payment_status,
        delivery_status, tracking_number, quantity, price, subtotal
    ) VALUES (
        p_order_id, p_customer_id, p_vendor_id, p_product_id, p_business_name,
        CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), p_payment_method, 'Pending',
        'Processing', p_tracking_number, p_quantity, p_price, (p_quantity * p_price)
    );

    -- 3. Inventory automatically updated by trigger 'trg_deduct_inventory_on_order'
    
    -- Commit ACID Transaction to ensure Durability
    COMMIT;
    SET p_status_code = 200;
    SET p_status_message = 'Order successfully placed under transactional consistency.';
END$$

DELIMITER ;

-- ----------------------------------------------------------------------------------
-- [CO1: Advanced SQL Querying - CTEs, Window Functions & Aggregates]
-- Topic: CTEs (Common Table Expressions), Window Functions (DENSE_RANK, SUM OVER)
-- Explanation: Demonstrates advanced analytic SQL querying required for business
--              intelligence reporting and vendor analytics.
-- ----------------------------------------------------------------------------------

-- Query 1: Top performing products ranked within each category using Window Function DENSE_RANK()
SELECT 
    category,
    product_name,
    price,
    DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_rank_in_category
FROM product
WHERE product_status = 'Active';

-- Query 2: CTE calculating cumulative vendor revenue and transaction volumes
WITH VendorPerformanceCTE AS (
    SELECT 
        v.vendor_id,
        v.business_name,
        COUNT(vod.vendor_order_id) as total_items_sold,
        COALESCE(SUM(vod.subtotal), 0) as total_sales_volume
    FROM vendor v
    LEFT JOIN vendor_order_details vod ON v.vendor_id = vod.vendor_id
    GROUP BY v.vendor_id, v.business_name
)
SELECT 
    vendor_id,
    business_name,
    total_items_sold,
    total_sales_volume,
    RANK() OVER (ORDER BY total_sales_volume DESC) as marketplace_rank
FROM VendorPerformanceCTE;
