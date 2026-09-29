import os
from dotenv import load_dotenv

load_dotenv()

# [CO3: Backend API Engineering - Configuration & Environment Setup]
# Topic: Layered Architecture, Configuration Management, MySQL Connection Settings
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'markethub-university-dbms-secret-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'markethub-jwt-secret-key')
    
    # [CO1: RDBMS Foundations & Catalog Tools]
    # Connects directly to the user's multi_vendor_ecommerce MySQL database
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_DB = os.getenv('MYSQL_DB', 'multi_vendor_ecommerce')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
    MYSQL_CURSORCLASS = 'DictCursor'
