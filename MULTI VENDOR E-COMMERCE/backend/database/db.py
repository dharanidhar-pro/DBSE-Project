# ==================================================================================
# [CO1: RDBMS Foundations & Database Connectivity]
# [CO3: Backend API Engineering - Database Integration & Repository Pattern]
# Topic: DBMS architecture, connection management, PyMySQL cursor handling, ACID safety
# Explanation: Handles low-level connection pooling and execution for the 8-table
#              MySQL relational database schema (multi_vendor_ecommerce).
# ==================================================================================

import pymysql
from pymysql.cursors import DictCursor
from config import Config

def get_db_connection():
    """
    [CO1: Relational Database Engineering - Connection Management]
    Establishes connection to the multi_vendor_ecommerce MySQL database using PyMySQL.
    Returns a DictCursor so results are automatically serialized to JSON-ready dicts.
    """
    connection = pymysql.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        port=Config.MYSQL_PORT,
        cursorclass=DictCursor,
        autocommit=True
    )
    return connection

def query_db(query, args=(), one=False):
    """
    [CO1: SQL Querying - DML Execution & Result Fetching]
    Safely executes parameterized SELECT queries preventing SQL injection vulnerabilities.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, args)
            results = cursor.fetchall()
            return (results[0] if results else None) if one else results
    finally:
        conn.close()

def execute_db(query, args=()):
    """
    [CO1: Transactions & ACID Properties - Atomicity & Durability]
    Executes INSERT, UPDATE, or DELETE operations with transaction management.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, args)
            conn.commit()
            return cursor.lastrowid
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()
